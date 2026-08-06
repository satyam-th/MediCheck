

from rest_framework import serializers
from django.db import transaction   # For atomic sale creation
from django.db.models import Sum
from django.db.models.functions import Coalesce

from .models import Pharmacy, LocalInventory, Sale, SaleItem, Patient, StaffAttendance, PharmacyProfileChangeRequest
from catalog.models import GlobalMedicine

class PharmacySerializer(serializers.ModelSerializer):

    is_open = serializers.ReadOnlyField()


    owner_email = serializers.SerializerMethodField()
    owner_name  = serializers.SerializerMethodField()
    owner_phone = serializers.SerializerMethodField()
    owner_first_name = serializers.SerializerMethodField()
    owner_last_name  = serializers.SerializerMethodField()

    class Meta:
        model  = Pharmacy
        fields = [
            'id', 'name', 'contact_number', 'address',
            'latitude', 'longitude', 'status',
            'open_time', 'close_time', 'is_open',
            'low_stock_threshold', 'license_number', 'pan_number',
            'owner_email', 'owner_name', 'owner_phone',
            'owner_first_name', 'owner_last_name',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'status']
      

    def get_owner_email(self, pharmacy_object):
        return pharmacy_object.user.email

    def get_owner_name(self, pharmacy_object):
        return pharmacy_object.user.get_full_name() or pharmacy_object.user.username

    def get_owner_phone(self, pharmacy_object):
        return pharmacy_object.user.phone or pharmacy_object.contact_number

    def get_owner_first_name(self, pharmacy_object):
        return pharmacy_object.user.first_name

    def get_owner_last_name(self, pharmacy_object):
        return pharmacy_object.user.last_name

    def create(self, validated_data):
        return Pharmacy.objects.create(**validated_data)


class PharmacyPublicSerializer(serializers.ModelSerializer):
   
    is_open = serializers.ReadOnlyField()  # True or False

    class Meta:
        model  = Pharmacy
        fields = ['id', 'name', 'contact_number', 'address', 'latitude', 'longitude', 'is_open']


class InventorySerializer(serializers.ModelSerializer):
 
    # read-only — pharmacy can't change them
    medicine_name        = serializers.ReadOnlyField(source='medicine.name')
    generic_name         = serializers.ReadOnlyField(source='medicine.generic_name')
    composition          = serializers.ReadOnlyField(source='medicine.composition')
    requires_prescription = serializers.ReadOnlyField(source='medicine.requires_prescription')
    photo                = serializers.ImageField(source='medicine.photo', read_only=True)

    stock_status = serializers.ReadOnlyField()

    # Overall availability of this medicine across all its batches
    medicine_stock_status = serializers.SerializerMethodField()

    # Write-only fields for creating new medicine requests
    medicine = serializers.PrimaryKeyRelatedField(queryset=GlobalMedicine.objects.all(), required=False)
    new_medicine_name = serializers.CharField(write_only=True, required=False)
    new_generic_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_category = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model  = LocalInventory
        fields = [
            'id',
            'medicine',         # The ForeignKey ID  sent when POSTing a new item
            'medicine_name',    # GlobalMedicine automatically
            'generic_name',
            'composition',
            'requires_prescription',
            'photo',
            'quantity',         # Pharmacy sets this
            'mrp',              # Pharmacy sets this
            'batch_number',
            'expiry_date',
            'stock_status',     # Auto calculated
            'medicine_stock_status',
            'updated_at',
            'new_medicine_name',
            'new_generic_name',
            'new_category',
        ]
        read_only_fields = ['id', 'updated_at']

    def get_medicine_stock_status(self, obj):
        total = getattr(obj, 'medicine_total_qty', None)
        if total is None:
            total = LocalInventory.objects.filter(
                pharmacy=obj.pharmacy, medicine=obj.medicine
            ).aggregate(t=Coalesce(Sum('quantity'), 0))['t']

        if total == 0:
            return 'out_of_stock'
        if total <= obj.pharmacy.low_stock_threshold:
            return 'low_stock'
        return 'available'

    def validate(self, data):
        if self.instance is None:
            medicine_id = data.get('medicine')
            new_medicine_name = data.get('new_medicine_name')

            if not medicine_id and not new_medicine_name:
                raise serializers.ValidationError(
                    "Either 'medicine' (existing ID) or 'new_medicine_name' is required."
                )
            if medicine_id and new_medicine_name:
                raise serializers.ValidationError(
                    "Provide either 'medicine' or 'new_medicine_name', not both."
                )
        else:
            medicine = data.get('medicine', self.instance.medicine)
            batch_number = data.get('batch_number', self.instance.batch_number)

            if medicine is not None or batch_number is not None:
                exists = LocalInventory.objects.filter(
                    pharmacy=self.instance.pharmacy,
                    medicine=medicine,
                    batch_number=batch_number,
                ).exclude(pk=self.instance.pk).exists()
                if exists:
                    raise serializers.ValidationError(
                        'An inventory entry with this medicine and batch number already exists.'
                    )
        return data

    def create(self, validated_data):
        new_medicine_name = validated_data.pop('new_medicine_name', None)
        new_generic_name = validated_data.pop('new_generic_name', '')
        new_category = validated_data.pop('new_category', '')

        pharmacy = validated_data.pop('pharmacy', self.context['request'].user.pharmacy)

        if new_medicine_name:
            # A brand-new medicine typed by a pharmacy is added straight to the
            # global catalogue (approved) so it becomes available to customers.
            medicine, _ = GlobalMedicine.objects.get_or_create(
                name__iexact=new_medicine_name,
                defaults={
                    'name': new_medicine_name,
                    'generic_name': new_generic_name,
                    'category': new_category,
                    'approval_status': 'approved',
                    'submitted_by': self.context['request'].user,
                },
            )
            if medicine.approval_status == 'pending':
                medicine.approval_status = 'approved'
                medicine.save(update_fields=['approval_status'])
            validated_data['medicine'] = medicine

        medicine = validated_data.pop('medicine')
        batch_number = validated_data.pop('batch_number', '')

        # Same medicine + same batch -> add to the existing stock entry.
        existing = LocalInventory.objects.filter(
            pharmacy=pharmacy,
            medicine=medicine,
            batch_number=batch_number,
        ).first()

        if existing:
            existing.quantity = existing.quantity + validated_data.pop('quantity', 0)
            existing.mrp = validated_data.get('mrp', existing.mrp)
            existing.expiry_date = validated_data.get('expiry_date', existing.expiry_date)
            existing.save()
            return existing

        # Same medicine but a different batch -> a separate entry under the same medicine.
        return LocalInventory.objects.create(
            pharmacy=pharmacy,
            medicine=medicine,
            batch_number=batch_number,
            **validated_data,
        )


class CustomerStockSerializer(serializers.ModelSerializer):
   
    # Medicine details 
    medicine_name         = serializers.ReadOnlyField(source='medicine.name')
    generic_name          = serializers.ReadOnlyField(source='medicine.generic_name')
    requires_prescription = serializers.ReadOnlyField(source='medicine.requires_prescription')
    photo                 = serializers.ImageField(source='medicine.photo', read_only=True)

    # Pharmacy details
    pharmacy_name    = serializers.ReadOnlyField(source='pharmacy.name')
    pharmacy_address = serializers.ReadOnlyField(source='pharmacy.address')
    pharmacy_lat     = serializers.ReadOnlyField(source='pharmacy.latitude')
    pharmacy_lng     = serializers.ReadOnlyField(source='pharmacy.longitude')
    pharmacy_is_open = serializers.ReadOnlyField(source='pharmacy.is_open')
    pharmacy_contact = serializers.ReadOnlyField(source='pharmacy.contact_number')

    # Stock status 
    stock_status = serializers.ReadOnlyField()

    class Meta:
        model  = LocalInventory
        fields = [
            'id',
            'medicine_name', 'generic_name',
            'requires_prescription', 'photo', 'mrp',
            'stock_status', 'quantity',
            'pharmacy_name', 'pharmacy_address',
            'pharmacy_lat', 'pharmacy_lng',
            'pharmacy_is_open', 'pharmacy_contact',
        ]




class SaleItemSerializer(serializers.ModelSerializer):
  
    medicine_name = serializers.ReadOnlyField(source='inventory.medicine.name')
    subtotal      = serializers.ReadOnlyField()  # From SaleItem.subtotal property

    class Meta:
        model  = SaleItem
        fields = ['id', 'inventory', 'medicine_name', 'quantity', 'unit_price', 'subtotal']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model  = Sale
        fields = [
            'id', 'patient_name', 'patient_phone',
            'total_amount', 'is_credit', 'credit_paid',
            'notes', 'created_at', 'items',
        ]
        read_only_fields = ['id', 'total_amount', 'created_at']
       
    def create(self, validated_data):
        items_data = validated_data.pop('items')

        if not items_data:
            raise serializers.ValidationError({'items': 'At least one item is required.'})

        with transaction.atomic():

            sale  = Sale.objects.create(**validated_data)
            total = 0  #  add to this  we process items

            #  Process each item in the bill
            for item_data in items_data:
                inventory = item_data['inventory']  
                qty       = item_data['quantity']   # How many sell

                # Only allow selling from THIS pharmacy's own inventory
                if inventory.pharmacy_id != sale.pharmacy_id:
                    raise serializers.ValidationError(
                        f"'{inventory.medicine.name}' is not part of this pharmacy's inventory."
                    )

                # Safety check
                if inventory.quantity < qty:
                    raise serializers.ValidationError(
                        f"Not enough stock for '{inventory.medicine.name}'. "
                        f"Available: {inventory.quantity}, Requested: {qty}"
                    )
            
                inventory.quantity -= qty
                inventory.save(update_fields=['quantity'])
                
                price     = item_data.get('unit_price', inventory.mrp)
                sale_item = SaleItem.objects.create(
                    sale       = sale,
                    inventory  = inventory,
                    quantity   = qty,
                    unit_price = price,
                )

                total += sale_item.subtotal

            sale.total_amount = total
            sale.save(update_fields=['total_amount'])


        return sale


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Patient
        fields = ['id', 'name', 'phone', 'address', 'outstanding_credit', 'created_at']
        read_only_fields = ['id', 'created_at']


class StaffAttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField()

    class Meta:
        model  = StaffAttendance
        fields = ['id', 'staff_member', 'staff_name', 'date', 'status', 'notes']
        read_only_fields = ['id']

    def get_staff_name(self, attendance_object):
       
        user = attendance_object.staff_member
        return user.get_full_name() or user.username


class PharmacyProfileChangeRequestSerializer(serializers.ModelSerializer):
    """Pharmacy-facing serializer: submit & track their own change requests."""

    class Meta:
        model  = PharmacyProfileChangeRequest
        fields = ['id', 'requested_changes', 'status', 'note', 'created_at', 'reviewed_at']
        read_only_fields = ['id', 'status', 'note', 'created_at', 'reviewed_at']

    def validate_requested_changes(self, value):
        if not isinstance(value, dict) or not value:
            raise serializers.ValidationError('Provide at least one change to request.')

        for field, new_value in value.items():
            if field not in PharmacyProfileChangeRequest.REQUESTABLE_FIELDS:
                raise serializers.ValidationError(f"'{field}' cannot be changed via a request.")
            if new_value is None or str(new_value).strip() == '':
                raise serializers.ValidationError(f"'{field}' cannot be empty.")
        return value


class AdminProfileChangeRequestSerializer(serializers.ModelSerializer):
    """Admin-facing serializer: includes pharmacy + requester info."""

    pharmacy_name        = serializers.ReadOnlyField(source='pharmacy.name')
    pharmacy_status      = serializers.ReadOnlyField(source='pharmacy.status')
    pharmacy_contact     = serializers.ReadOnlyField(source='pharmacy.contact_number')
    pharmacy_address     = serializers.ReadOnlyField(source='pharmacy.address')
    requested_by_name    = serializers.SerializerMethodField()
    requested_by_email   = serializers.ReadOnlyField(source='requested_by.email')
    reviewed_by_email    = serializers.SerializerMethodField()

    class Meta:
        model  = PharmacyProfileChangeRequest
        fields = [
            'id', 'pharmacy_name', 'pharmacy_status', 'pharmacy_contact', 'pharmacy_address',
            'requested_by_name', 'requested_by_email',
            'requested_changes', 'status', 'note', 'created_at', 'reviewed_at', 'reviewed_by_email',
        ]
        read_only_fields = fields

    def get_requested_by_name(self, obj):
        return obj.requested_by.get_full_name() or obj.requested_by.username

    def get_reviewed_by_email(self, obj):
        return obj.reviewed_by.email if obj.reviewed_by else None
