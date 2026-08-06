from datetime import date

from django.utils import timezone

from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q, Sum, OuterRef, Subquery
from django.db.models.functions import Coalesce

from users.models import User
from .models import Pharmacy, LocalInventory, Sale, Patient, StaffAttendance, PharmacyProfileChangeRequest
from .serializers import (
    PharmacySerializer,
    InventorySerializer,
    SaleSerializer,
    PatientSerializer,
    StaffAttendanceSerializer,
    PharmacyProfileChangeRequestSerializer,
    AdminProfileChangeRequestSerializer,
)


class IsPharmacyOwner(permissions.BasePermission):


    def has_permission(self, request, view):
       
        if not (request.user.is_authenticated and request.user.role == 'pharmacy'):
            return False

        pharmacy = getattr(request.user, 'pharmacy', None)
        if pharmacy is None:
            return False

        # Banned pharmacies are locked out. Suspended pharmacies may log in
        # (restricted to the sales / medicine sections by the frontend).
        return pharmacy.status in ('active', 'pending', 'suspended')


def sync_owner_fields(user, data):
    """Copy owner details from a request payload onto the linked User account."""
    changed = False
    fields = []

    for key, attr in [
        ('owner_first_name', 'first_name'),
        ('owner_last_name', 'last_name'),
        ('owner_phone', 'phone'),
    ]:
        if key in data and data[key] is not None:
            setattr(user, attr, data[key])
            changed = True
            fields.append(attr)

    password = data.get('owner_password')
    if password:
        user.set_password(password)
        changed = True
        fields.append('password')

    owner_email = data.get('owner_email')
    if owner_email:
        user.email = owner_email
        user.username = owner_email
        changed = True
        fields.extend(['email', 'username'])

    if changed:
        user.save(update_fields=fields)


class IsAdminRole(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('worker_admin', 'super_admin')
        )


class PharmacyProfileView(generics.RetrieveUpdateAPIView):
 
    serializer_class   = PharmacySerializer
    permission_classes = [IsPharmacyOwner]

    def get_object(self):
        """Return the pharmacy belonging to the currently logged-in user."""
        return self.request.user.pharmacy

    def update(self, request, *args, **kwargs):
        if self.get_object().status == 'suspended':
            raise PermissionDenied('Suspended pharmacies cannot update their profile.')
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()
        sync_owner_fields(self.get_object().user, self.request.data)


class PharmacyProfileChangeRequestView(generics.ListCreateAPIView):
    """Pharmacy submits requests to change license/PAN/owner details.

    The requested changes are stored as 'pending' until an admin approves
    or rejects them. Nothing is written to the profile here.
    """

    serializer_class   = PharmacyProfileChangeRequestSerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        return PharmacyProfileChangeRequest.objects.filter(
            pharmacy=self.request.user.pharmacy
        ).order_by('-created_at')

    def perform_create(self, serializer):
        if self.request.user.pharmacy.status == 'suspended':
            raise PermissionDenied('Suspended pharmacies cannot submit change requests.')
        serializer.save(
            pharmacy     = self.request.user.pharmacy,
            requested_by = self.request.user,
        )


class InventoryViewSet(viewsets.ModelViewSet):

    serializer_class   = InventorySerializer
    permission_classes = [IsPharmacyOwner]
    pagination_class   = None  # POS + low-stock views need the full inventory

    def get_queryset(self):
        # Total quantity of a medicine across all its batches (for medicine-level stock status)
        medicine_total = LocalInventory.objects.filter(
            pharmacy=OuterRef('pharmacy'),
            medicine=OuterRef('medicine'),
        ).values('medicine').annotate(
            t=Coalesce(Sum('quantity'), 0)
        ).values('t')

        return LocalInventory.objects.filter(
            pharmacy=self.request.user.pharmacy
        ).select_related('medicine', 'pharmacy').annotate(medicine_total_qty=Subquery(medicine_total))

    def perform_create(self, serializer):
        serializer.save(pharmacy=self.request.user.pharmacy)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        pharmacy  = request.user.pharmacy

        low_items = self.get_queryset().filter(
            medicine_total_qty__lte=pharmacy.low_stock_threshold
        )

        serializer = self.get_serializer(low_items, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')

        items = self.get_queryset().filter(
            Q(medicine__name__icontains=query) |
            Q(medicine__generic_name__icontains=query)
        )

        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)



class SaleViewSet(viewsets.ModelViewSet):
    serializer_class   = SaleSerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        return Sale.objects.filter(
            pharmacy=self.request.user.pharmacy
        ).prefetch_related('items__inventory__medicine').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(
            pharmacy   = self.request.user.pharmacy,
            created_by = self.request.user,  # Track who made the sale
        )

    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        today       = date.today()
        today_sales = self.get_queryset().filter(created_at__date=today)

        return Response({
            'date'               : today,
            'total_revenue'      : today_sales.aggregate(t=Sum('total_amount'))['t'] or 0,
            'transaction_count'  : today_sales.count(),
            'credit_outstanding' : today_sales.filter(
                is_credit=True, credit_paid=False
            ).aggregate(t=Sum('total_amount'))['t'] or 0,
        })


class PatientViewSet(viewsets.ModelViewSet):

    serializer_class   = PatientSerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        """Return only THIS pharmacy's patients."""
        return Patient.objects.filter(pharmacy=self.request.user.pharmacy).order_by('-created_at')

    def perform_create(self, serializer):
        """Attach this pharmacy when creating a new patient."""
        serializer.save(pharmacy=self.request.user.pharmacy)



class AttendanceViewSet(viewsets.ModelViewSet):

    serializer_class   = StaffAttendanceSerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        queryset    = StaffAttendance.objects.filter(
            pharmacy=self.request.user.pharmacy
        ).order_by('-date', '-id')
        filter_date = self.request.query_params.get('date')

        if filter_date:
            queryset = queryset.filter(date=filter_date)

        return queryset

    def perform_create(self, serializer):
        """Mark attendance. One record per staff member per day — re-submitting
        updates the existing entry instead of raising a unique-constraint error."""
        pharmacy = self.request.user.pharmacy
        data     = serializer.validated_data

        attendance, _ = StaffAttendance.objects.update_or_create(
            pharmacy  = pharmacy,
            staff_member = data['staff_member'],
            date         = data.get('date', timezone.localdate()),
            defaults = {
                k: v for k, v in data.items()
                if k not in ('staff_member', 'date')
            },
        )
        serializer.instance = attendance


class AdminPharmacyViewSet(viewsets.ModelViewSet):

    serializer_class   = PharmacySerializer
    permission_classes = [IsAdminRole]
    queryset           = Pharmacy.objects.all().select_related('user').order_by('-created_at')
    #load the linked User in the same SQL query

    def perform_create(self, serializer):
        data = self.request.data

        owner_email = data.get('owner_email')
        if not owner_email:
            raise ValidationError({'owner_email': 'Owner email is required.'})
        if User.objects.filter(email=owner_email).exists():
            raise ValidationError({'owner_email': 'A user with this email already exists.'})

        owner_password = data.get('owner_password') or 'changeme123'
        if len(owner_password) < 8:
            raise ValidationError({'owner_password': 'Password must be at least 8 characters.'})

        pharmacy_user = User.objects.create_user(
            email    = owner_email,
            username = owner_email,         # email = username
            password = owner_password,
            role     = 'pharmacy',
            first_name = data.get('owner_first_name', ''),
            last_name  = data.get('owner_last_name', ''),
            phone      = data.get('owner_phone', ''),
        )

        # Admin-created pharmacies are immediately active.
        serializer.save(
            user        = pharmacy_user,
            approved_by = self.request.user,
            status      = 'active',
        )

    def perform_update(self, serializer):
        serializer.save()
        pharmacy = self.get_object()
        sync_owner_fields(pharmacy.user, self.request.data)

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        pharmacy = self.get_object() 
        pharmacy.status      = 'active'
        pharmacy.approved_by = request.user 
        pharmacy.save(update_fields=['status', 'approved_by'])
        return Response({'status': 'approved', 'pharmacy': pharmacy.name})

    @action(detail=True, methods=['patch'])
    def suspend(self, request, pk=None):
    
        pharmacy = self.get_object()
        pharmacy.status = 'suspended'
        pharmacy.save(update_fields=['status'])
        return Response({'status': 'suspended'})

    @action(detail=True, methods=['patch'])
    def ban(self, request, pk=None):
  
        pharmacy = self.get_object()
        pharmacy.status = 'banned'
        pharmacy.save(update_fields=['status'])
        return Response({'status': 'banned'})


class AdminProfileChangeRequestViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin sees all pharmacy change requests and approves/rejects them."""

    serializer_class   = AdminProfileChangeRequestSerializer
    permission_classes = [IsAdminRole]
    queryset           = PharmacyProfileChangeRequest.objects.select_related(
        'pharmacy', 'pharmacy__user', 'requested_by'
    ).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        profile_request = self.get_object()
        if profile_request.status != 'pending':
            return Response(
                {'detail': f'Request already {profile_request.status}.'},
                status=400,
            )

        profile_request.apply_changes()
        profile_request.status       = 'approved'
        profile_request.reviewed_by  = request.user
        profile_request.reviewed_at  = timezone.now()
        profile_request.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        profile_request = self.get_object()
        if profile_request.status != 'pending':
            return Response(
                {'detail': f'Request already {profile_request.status}.'},
                status=400,
            )

        profile_request.status      = 'rejected'
        profile_request.reviewed_by = request.user
        profile_request.reviewed_at = timezone.now()
        profile_request.note        = request.data.get('note', '')[:300]
        profile_request.save()
        return Response({'status': 'rejected'})
