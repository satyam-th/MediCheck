
from django.urls import path
from .views import MedicineSearchView, MedicineAvailabilityView, NearbyPharmaciesView

urlpatterns = [
    path('search/', MedicineSearchView.as_view(), name='medicine-search'),
    path('availability/', MedicineAvailabilityView.as_view(), name='availability'),

    path('pharmacies/nearby/', NearbyPharmaciesView.as_view(), name='nearby-pharmacies'),

]
