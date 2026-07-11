
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.db.models import Q  # For combining filter conditions with OR

from catalog.models import GlobalMedicine
from catalog.serializers import MedicinePublicSerializer
from pharmacies.models import Pharmacy, LocalInventory
from pharmacies.serializers import CustomerStockSerializer, PharmacyPublicSerializer

class MedicineSearchView(APIView):


    permission_classes = [AllowAny]  # Anyone can search — no login needed

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if len(query) < 2:
            return Response([])

        medicines = GlobalMedicine.objects.filter(
            Q(name__icontains=query) | Q(generic_name__icontains=query),
            approval_status='approved' 
        )[:10]  

        serializer = MedicinePublicSerializer(medicines, many=True, context={'request': request})
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
