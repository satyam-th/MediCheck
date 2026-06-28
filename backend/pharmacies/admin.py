
from django.contrib import admin
from .models import Pharmacy, LocalInventory, Sale, SaleItem, Patient, StaffAttendance


@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display  = ['name', 'contact_number', 'status', 'is_open', 'created_at']
    list_filter   = ['status']
    search_fields = ['name', 'contact_number', 'address']
    actions = ['approve_pharmacies']

    def approve_pharmacies(self, request, queryset):
        queryset.update(status='active')

    approve_pharmacies.short_description = " Approve selected pharmacies"


@admin.register(LocalInventory)
class LocalInventoryAdmin(admin.ModelAdmin):

    list_display  = ['pharmacy', 'medicine', 'quantity', 'mrp', 'stock_status', 'updated_at']
    list_filter   = ['pharmacy']
    search_fields = ['medicine__name', 'pharmacy__name']
    ordering      = ['pharmacy', 'medicine__name']


class SaleItemInline(admin.TabularInline):
 

    model  = SaleItem
    extra  = 0       
    fields = ['inventory', 'quantity', 'unit_price']


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
  
    list_display = ['id', 'pharmacy', 'patient_name', 'total_amount', 'is_credit', 'created_at']
    list_filter  = ['pharmacy', 'is_credit', 'credit_paid', 'created_at']

    inlines = [SaleItemInline]


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):

    list_display  = ['name', 'phone', 'pharmacy', 'outstanding_credit']
    search_fields = ['name', 'phone']
    list_filter   = ['pharmacy']


@admin.register(StaffAttendance)
class StaffAttendanceAdmin(admin.ModelAdmin):
    list_display = ['staff_member', 'pharmacy', 'date', 'status']
    list_filter  = ['status', 'pharmacy', 'date']
