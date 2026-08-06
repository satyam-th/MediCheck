
from django.urls import path
from .views import (
    MedicineSearchView, MedicineDetailView, MedicineAvailabilityView,
    NearbyPharmaciesView, AdminStatsView,
    AdminCustomerListView, AdminCustomerDetailView,
)

urlpatterns = [
    path('search/', MedicineSearchView.as_view(), name='medicine-search'),
    path('availability/', MedicineAvailabilityView.as_view(), name='availability'),
    path('medicines/<int:pk>/', MedicineDetailView.as_view(), name='medicine-detail'),

    path('pharmacies/nearby/', NearbyPharmaciesView.as_view(), name='nearby-pharmacies'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path('admin/customers/<int:pk>/', AdminCustomerDetailView.as_view(), name='admin-customer-detail'),

]
