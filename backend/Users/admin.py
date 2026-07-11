from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['email', 'username', 'role', 'is_active', 'date_joined']

    list_filter   = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering      = ['-date_joined']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Medicheck Info', {
            'fields': ('role', 'phone')
        }),
    )
