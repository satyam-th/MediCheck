
from rest_framework import serializers
from .models import GlobalMedicine


class MedicineAdminSerializer(serializers.ModelSerializer):
    submitted_by_email = serializers.SerializerMethodField()

    class Meta:
        model  = GlobalMedicine
        fields = [
            'id', 'name', 'generic_name', 'composition',
            'side_effects', 'manufacturer', 'category',
            'requires_prescription', 'photo',
            'approval_status', 'submitted_by', 'submitted_by_email', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_submitted_by_email(self, obj):
        if obj.submitted_by:
            return obj.submitted_by.email
        return None


class MedicinePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GlobalMedicine
        fields = [
            'id', 'name', 'generic_name', 'composition',
            'requires_prescription', 'photo', 'category'
        ]
