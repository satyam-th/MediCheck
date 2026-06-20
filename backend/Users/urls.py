from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView  # Built-in refresh view

from .views import LoginView, RegisterView, MeView

urlpatterns = [
    #returns JWT tokens + user info
    path('login/', LoginView.as_view(), name='login'),
    #creates customer account
    path('register/', RegisterView.as_view(), name='register'),
    #updates own info
    path('me/', MeView.as_view(), name='me'),
    # Refresh: new access token
    # Use when access token expires
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
