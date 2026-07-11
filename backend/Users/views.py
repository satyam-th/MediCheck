from rest_framework import generics, permissions, status
from rest_framework.response import Response
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


# ── Pharmacy Register ─────────────────────────────────────────────────────────

class RegisterPharmacyView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        data = request.data
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'email': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=data['email'],
            username=data.get('username', data['email']),
            password=data['password'],
            role='pharmacy',
            phone=data.get('primaryContact', ''),
            first_name=data.get('pharmacyName', ''),
        )

        from pharmacies.models import Pharmacy
        Pharmacy.objects.create(
            user=user,
            name=data['pharmacyName'],
            contact_number=data['primaryContact'],
            address=data.get('address', ''),
            license_number=data.get('licenseNo', ''),
            open_time=data.get('openTime', None),
            close_time=data.get('closeTime', None),
            status='pending',
        )

        return Response({'message': 'Pharmacy registered successfully. Awaiting admin approval.'}, status=status.HTTP_201_CREATED)


# ── Me View ───────────────────────────────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):

    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
