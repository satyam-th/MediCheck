from datetime import date

from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum

from users.models import User
from .models import Pharmacy, LocalInventory, Sale, Patient, StaffAttendance
from .serializers import (
    PharmacySerializer,
    InventorySerializer,
    SaleSerializer,
    PatientSerializer,
    StaffAttendanceSerializer,
)


class IsPharmacyOwner(permissions.BasePermission):


    def has_permission(self, request, view):
       
        # role == pharmacy
        return (
            request.user.is_authenticated and
            request.user.role == 'pharmacy'
        )


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


class InventoryViewSet(viewsets.ModelViewSet):

    serializer_class   = InventorySerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        return LocalInventory.objects.filter(
            pharmacy=self.request.user.pharmacy
        ).select_related('medicine')

    def perform_create(self, serializer):
        serializer.save(pharmacy=self.request.user.pharmacy)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        pharmacy  = request.user.pharmacy

        low_items = self.get_queryset().filter(
            quantity__lte=pharmacy.low_stock_threshold
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
        return Patient.objects.filter(pharmacy=self.request.user.pharmacy)

    def perform_create(self, serializer):
        """Attach this pharmacy when creating a new patient."""
        serializer.save(pharmacy=self.request.user.pharmacy)



class AttendanceViewSet(viewsets.ModelViewSet):

    serializer_class   = StaffAttendanceSerializer
    permission_classes = [IsPharmacyOwner]

    def get_queryset(self):
        queryset    = StaffAttendance.objects.filter(pharmacy=self.request.user.pharmacy)
        filter_date = self.request.query_params.get('date')

        if filter_date:
            queryset = queryset.filter(date=filter_date)

        return queryset

    def perform_create(self, serializer):
        """ pharmacy when marking attendance."""
        serializer.save(pharmacy=self.request.user.pharmacy)


class AdminPharmacyViewSet(viewsets.ModelViewSet):

    serializer_class   = PharmacySerializer
    permission_classes = [IsAdminRole]
    queryset           = Pharmacy.objects.all().select_related('user')
    #load the linked User in the same SQL query

    def perform_create(self, serializer):
        data = self.request.data

        pharmacy_user = User.objects.create_user(
            email    = data.get('owner_email'),
            username = data.get('owner_email'),         # email = username
            password = data.get('owner_password', 'changeme123'),
            role     = 'pharmacy',                     
        )

        serializer.save(
            user        = pharmacy_user,
            approved_by = self.request.user, 
        )

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
