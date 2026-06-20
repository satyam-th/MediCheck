from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import GlobalMedicine
from .serializers import MedicineAdminSerializer

# Create your views here.




class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('worker_admin', 'super_admin')
        )



class AdminCatalogViewSet(viewsets.ModelViewSet):
    queryset           = GlobalMedicine.objects.all().order_by('name')
    serializer_class   = MedicineAdminSerializer
    permission_classes = [IsAdminRole]  # Only for admins 

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        medicine = self.get_object()  # Fetches the GlobalMedicine with this pk

        medicine.approval_status = 'approved'
        medicine.approved_by = request.user  # Track with admin approved it

        medicine.save(update_fields=['approval_status', 'approved_by'])

        return Response({
            'status': 'approved',
            'medicine': medicine.name
        })

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        medicine = self.get_object()

        medicine.approval_status = 'rejected'
        medicine.save(update_fields=['approval_status'])

        return Response({
            'status': 'rejected',
            'medicine': medicine.name
        })
