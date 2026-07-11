from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminCatalogViewSet

router = DefaultRouter()
router.register('', AdminCatalogViewSet, basename='catalog')


urlpatterns = [
    path('', include(router.urls)),
]