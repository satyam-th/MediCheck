from django.contrib import admin
from .models import GlobalMedicine
# Register your models here.



@admin.register(GlobalMedicine)
class GlobalMedicineAdmin(admin.ModelAdmin):
    list_display  = ['name', 'generic_name', 'category', 'requires_prescription', 'approval_status']
    list_filter   = ['approval_status', 'requires_prescription', 'category']
    search_fields = ['name', 'generic_name', 'manufacturer']

  
    ordering      = ['name']
    actions = ['bulk_approve']

    def bulk_approve(self, request, queryset):
        queryset.update(approval_status='approved')
    
    bulk_approve.short_description = "Approve  medicines"
