

from rest_framework import serializers
from django.db import transaction   # For atomic sale creation

from .models import Pharmacy, LocalInventory, Sale, SaleItem, Patient, StaffAttendance

class PharmacySerializer(serializers.ModelSerializer):

    is_open = serializers.ReadOnlyField()


    owner_email = serializers.SerializerMethodField()

    class Meta:
        model  = Pharmacy
        fields = [
            'id', 'name', 'contact_number', 'address',
            'latitude', 'longitude', 'status',
            'open_time', 'close_time', 'is_open',
            'low_stock_threshold', 'license_number',
            'owner_email', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'status']
      

    def get_owner_email(self, pharmacy_object):
        return pharmacy_object.user.email


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
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']


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

        with transaction.atomic():

            sale  = Sale.objects.create(**validated_data)
            total = 0  #  add to this  we process items

            #  Process each item in the bill
            for item_data in items_data:
                inventory = item_data['inventory']  
                qty       = item_data['quantity']   # How many sell

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
