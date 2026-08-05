from rest_framework import serializers

from users.models import User


class AdminCustomerSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'name', 'email', 'date_joined', 'is_active']
        read_only_fields = ['id', 'email', 'date_joined']

    def get_name(self, obj):
        return obj.get_full_name() or obj.username or obj.email
