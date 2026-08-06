
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PharmacyProfileView,
    PharmacyProfileChangeRequestView,
    InventoryViewSet,
    SaleViewSet,
    PatientViewSet,
    AttendanceViewSet,
    AdminPharmacyViewSet,
    AdminProfileChangeRequestViewSet,
)

from catalog.views import ApprovedMedicinesView, CategoryListView, GenericNameListView

#pharmacy dashboard.

pharmacy_router = DefaultRouter()
pharmacy_router.register('inventory',  InventoryViewSet,  basename='inventory')
pharmacy_router.register('sales',      SaleViewSet,       basename='sales')
pharmacy_router.register('patients',   PatientViewSet,    basename='patients')
pharmacy_router.register('attendance', AttendanceViewSet, basename='attendance')

#admin management of pharmacies.
admin_router = DefaultRouter()
admin_router.register('', AdminPharmacyViewSet, basename='admin-pharmacies')

# Admin change-request endpoints as explicit paths. A second DefaultRouter here
# would add its own '^$' root view and shadow the pharmacy list above.
admin_requests_urlpatterns = [
    path('requests/', AdminProfileChangeRequestViewSet.as_view({'get': 'list'}), name='admin-profile-requests-list'),
    path('requests/<int:pk>/approve/', AdminProfileChangeRequestViewSet.as_view({'patch': 'approve'}), name='admin-profile-requests-approve'),
    path('requests/<int:pk>/reject/', AdminProfileChangeRequestViewSet.as_view({'patch': 'reject'}), name='admin-profile-requests-reject'),
]

urlpatterns = [

    path('profile/', PharmacyProfileView.as_view(), name='pharmacy-profile'),
    path('profile/change-requests/', PharmacyProfileChangeRequestView.as_view(), name='pharmacy-profile-change-requests'),
    path('catalog/categories/', CategoryListView.as_view(), name='pharmacy-catalog-categories'),
    path('catalog/generic-names/', GenericNameListView.as_view(), name='pharmacy-catalog-generic-names'),
    path('catalog/', ApprovedMedicinesView.as_view(), name='pharmacy-catalog'),

    path('', include(pharmacy_router.urls)),
]

admin_pharmacy_urlpatterns = [
    # Requests paths must be included BEFORE the empty-prefix pharmacy router,
    # otherwise its generic ^(?P<pk>[^/.]+)/$ detail pattern swallows 'requests/'.
    path('', include(admin_requests_urlpatterns)),
    path('', include(admin_router.urls)),
]
