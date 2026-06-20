
from rest_framework import serializers
from .models import GlobalMedicine


class MedicineAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GlobalMedicine
        fields = [
            'id', 'name', 'generic_name', 'composition',
            'side_effects', 'manufacturer', 'category',
            'requires_prescription', 'photo',
            'approval_status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
        # id and created_at are auto generated 


class MedicinePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model  = GlobalMedicine
        fields = [
            'id', 'name', 'generic_name', 'composition',
            'requires_prescription', 'photo', 'category'
        ]
