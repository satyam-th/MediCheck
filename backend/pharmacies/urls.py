
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PharmacyProfileView,
    InventoryViewSet,
    SaleViewSet,
    PatientViewSet,
    AttendanceViewSet,
    AdminPharmacyViewSet,
)

from catalog.views import ApprovedMedicinesView

#pharmacy dashboard.

pharmacy_router = DefaultRouter()
pharmacy_router.register('inventory',  InventoryViewSet,  basename='inventory')
pharmacy_router.register('sales',      SaleViewSet,       basename='sales')
pharmacy_router.register('patients',   PatientViewSet,    basename='patients')
pharmacy_router.register('attendance', AttendanceViewSet, basename='attendance')

#admin management of pharmacies.
admin_router = DefaultRouter()
admin_router.register('', AdminPharmacyViewSet, basename='admin-pharmacies')

urlpatterns = [

    path('profile/', PharmacyProfileView.as_view(), name='pharmacy-profile'),
    path('catalog/', ApprovedMedicinesView.as_view(), name='pharmacy-catalog'),

    path('', include(pharmacy_router.urls)),
]

admin_pharmacy_urlpatterns = [
    path('', include(admin_router.urls)),
]
