
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model  = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'phone']
        read_only_fields = ['id', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'phone']

    def create(self, validated_data):
        return User.objects.create_user( # change into hashed create_user
            email      = validated_data['email'],
            username   = validated_data['username'],
            password   = validated_data['password'],
            first_name = validated_data.get('first_name', ''),
            last_name  = validated_data.get('last_name', ''),
            phone      = validated_data.get('phone', ''),
            role       = 'customer',  # Self-registration is ALWAYS customer
        )
