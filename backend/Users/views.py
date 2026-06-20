from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from .serializers import UserSerializer, RegisterSerializer

# Create your views here.

class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = UserSerializer(self.user).data

        return data


# Login 

class LoginView(TokenObtainPairView):
    serializer_class   = CustomTokenSerializer
    permission_classes = [permissions.AllowAny]


# Register 

class RegisterView(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ── Me View ───────────────────────────────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):

    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
