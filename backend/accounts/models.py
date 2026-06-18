from django.contrib.auth.models import AbstractUser
from django.db import models
 
 
class User(AbstractUser):
 
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('pharmacy', 'Pharmacy'),
        ('customer', 'Customer'),
    )
    
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPE_CHOICES, 
        default='customer',
        help_text="User role: admin, pharmacy, or customer"
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="Contact phone number"
    )
    latitude = models.DecimalField(
        max_digits=9, 
        decimal_places=6, 
        null=True, 
        blank=True,
        help_text="User's latitude for geo-location"
    )
    longitude = models.DecimalField(
        max_digits=9, 
        decimal_places=6, 
        null=True, 
        blank=True,
        help_text="User's longitude for geo-location"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Can this user log in?"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'users'  # Table name in database
        verbose_name = 'User'
        verbose_name_plural = 'Users'
 
    def __str__(self):
       
        return f"{self.get_full_name() or self.username} ({self.get_user_type_display()})"
 
    def is_admin_user(self):
      
        return self.user_type == 'admin'
 
    def is_pharmacy_user(self):
        return self.user_type == 'pharmacy'
 
    def is_customer_user(self):
        return self.user_type == 'customer'
