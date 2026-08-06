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

        # Only banned pharmacies are locked out — suspended pharmacies may log in
        # but are restricted to the sales / medicine sections.
        user_data = UserSerializer(self.user).data

        if self.user.role == 'pharmacy':
            from pharmacies.models import Pharmacy
            pharmacy = getattr(self.user, 'pharmacy', None)

            if pharmacy and pharmacy.status == 'banned':
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(
                    'Your pharmacy account has been banned. Please contact support.'
                )

            if pharmacy:
                user_data['pharmacy_status'] = pharmacy.status

        data['user'] = user_data

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

        password = data.get('password')
        if not password or len(password) < 8:
            return Response(
                {'password': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            email=data['email'],
            username=data.get('username', data['email']),
            password=password,
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
