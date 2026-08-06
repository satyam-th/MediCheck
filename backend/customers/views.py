
from rest_framework.views import APIView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.db.models import Q  # For combining filter conditions with OR

from users.models import User
from catalog.models import GlobalMedicine
from catalog.serializers import MedicinePublicSerializer
from pharmacies.models import Pharmacy, LocalInventory
from pharmacies.serializers import CustomerStockSerializer, PharmacyPublicSerializer, PharmacySerializer
from .serializers import AdminCustomerSerializer


class IsAdminRole(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('worker_admin', 'super_admin')
        )


class AdminCustomerListView(generics.ListAPIView):
    """List all registered customers for the admin panel."""

    serializer_class   = AdminCustomerSerializer
    permission_classes = [IsAdminRole]
    queryset           = User.objects.filter(role='customer').order_by('-date_joined')


class AdminCustomerDetailView(generics.RetrieveUpdateAPIView):
    """Update a customer's active status (active/inactive)."""

    serializer_class   = AdminCustomerSerializer
    permission_classes = [IsAdminRole]
    queryset           = User.objects.filter(role='customer')

class MedicineSearchView(APIView):


    permission_classes = [AllowAny]  # Anyone can search — no login needed

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if len(query) < 2:
            return Response([])

        words = [w for w in query.split() if w]
        q_filter = Q()
        for word in words:
            q_filter |= (
                Q(name__icontains=word) |
                Q(generic_name__icontains=word) |
                Q(composition__icontains=word)
            )

        medicines = list(
            GlobalMedicine.objects.filter(
                q_filter,
                approval_status='approved'
            )
        )

        # Rank so exact / prefix matches come first, then similar ones.
        query_lower = query.lower()
        def rank(med):
            name = med.name.lower()
            generic = (med.generic_name or '').lower()
            if name == query_lower:
                return 0
            if name.startswith(query_lower):
                return 1
            if generic.startswith(query_lower):
                return 2
            if query_lower in name:
                return 3
            return 4

        medicines.sort(key=rank)
        medicines = medicines[:15]

        serializer = MedicinePublicSerializer(medicines, many=True, context={'request': request})
        return Response(serializer.data)


class MedicineDetailView(APIView):
    """Public single-medicine lookup used by the customer detail page."""

    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            medicine = GlobalMedicine.objects.get(pk=pk, approval_status='approved')
        except GlobalMedicine.DoesNotExist:
            return Response({'detail': 'Medicine not found.'}, status=404)

        serializer = MedicinePublicSerializer(medicine, context={'request': request})
        return Response(serializer.data)


class MedicineAvailabilityView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
     
        medicine_id = request.query_params.get('medicine_id')

        if not medicine_id:
            return Response({'error': 'medicine_id parameter is required'}, status=400)

        inventory_list = LocalInventory.objects.filter(
            medicine_id=medicine_id,
            pharmacy__status='active',
        ).select_related('pharmacy', 'medicine')
        user_lat = request.query_params.get('lat')
        user_lng = request.query_params.get('lng')

        if user_lat and user_lng:
            try:
                lat = float(user_lat)
                lng = float(user_lng)

                def distance_from_user(inventory_item):
                    ph = inventory_item.pharmacy
                    if ph.latitude and ph.longitude:
                        delta_lat = float(ph.latitude) - lat
                        delta_lng = float(ph.longitude) - lng
                        return (delta_lat ** 2 + delta_lng ** 2) ** 0.5
                    return 9999  # No GPS → push to the end of the list


                inventory_list = sorted(inventory_list, key=distance_from_user)

            except (ValueError, TypeError):
                pass 

        serializer = CustomerStockSerializer(
            inventory_list, many=True, context={'request': request}
        )
        return Response(serializer.data)

class NearbyPharmaciesView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        pharmacies = Pharmacy.objects.filter(
            status='active',
            latitude__isnull=False,   
            longitude__isnull=False,
        )

        serializer = PharmacyPublicSerializer(pharmacies, many=True)
        return Response(serializer.data)


class AdminStatsView(APIView):
    """Return platform stats for admin dashboard."""

    permission_classes = [IsAdminRole]

    def get(self, request):
        return Response({
            'total_customers': User.objects.filter(role='customer').count(),
            'total_pharmacies': Pharmacy.objects.count(),
            'total_medicines': GlobalMedicine.objects.filter(approval_status='approved').count(),
            'pending_medicines': GlobalMedicine.objects.filter(approval_status='pending').count(),
            'pending_pharmacies': Pharmacy.objects.filter(status='pending').count(),
            'active_pharmacies': Pharmacy.objects.filter(status='active').count(),
        })
