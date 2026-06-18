from django.db import models
import uuid
from decimal import Decimal
from django.conf import settings
# Create your models here.
 


class Pharmacy(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='pharmacy_profile'
    )
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        help_text="For OSM map marker placement"
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6,
        help_text="For OSM map marker placement"
    )
    primary_contact = models.CharField(max_length=20)
    alternate_contact = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    license_number = models.CharField(max_length=100, unique=True)
    opening_time = models.TimeField(default='09:00')
    closing_time = models.TimeField(default='21:00')
    is_open = models.BooleanField(
        default=True,
        help_text="Is the pharmacy currently open?"
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Has admin approved this pharmacy?"
    )
    logo = models.ImageField(upload_to='pharmacy_logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'pharmacies'
        verbose_name_plural = 'Pharmacies'
 
    def __str__(self):
        return self.name
 
 
class LocalInventory(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='inventory_items'
    )
    medicine = models.ForeignKey(
        'catalog.Medicine', 
        on_delete=models.CASCADE, 
        related_name='local_inventory'
    )
    batch_number = models.CharField(max_length=100)
    stock_quantity = models.PositiveIntegerField(default=0)
    mrp = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Maximum Retail Price"
    )
    selling_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Pharmacy's selling price (can be lower than MRP)"
    )
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Is this inventory item currently sellable?"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'local_inventory'
        # Prevent: same medicine + same batch at same pharmacy
        unique_together = ['pharmacy', 'medicine', 'batch_number']
        verbose_name_plural = 'Local Inventory'
        indexes = [
            # Speed up queries: "pharmacy + medicine"
            models.Index(fields=['pharmacy', 'medicine']),
        ]
 
    def is_low_stock(self):
        return self.stock_quantity <= settings.LOW_STOCK_THRESHOLD
 
    def __str__(self):
        return f"{self.medicine.name} @ {self.pharmacy.name} (Qty: {self.stock_quantity})"
 
 
class Patient(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='patients'
    )
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'patients'
        # One patient per pharmacy per phone number
        unique_together = ['pharmacy', 'phone']
 
    def __str__(self):
        return f"{self.name} ({self.phone})"
 
 
class Supplier(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='suppliers'
    )
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    outstanding_balance = models.DecimalField(
        max_digits=12, decimal_places=2, 
        default=Decimal('0.00')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'suppliers'
 
    def __str__(self):
        return f"{self.name} ({self.company})"
 
 
class Sale(models.Model):
    invoice_number = models.UUIDField(
        default=uuid.uuid4, 
        unique=True, 
        editable=False,
        help_text="Random UUID — prevents sequential invoice guessing"
    )
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='sales'
    )
    patient = models.ForeignKey(
        Patient, 
        on_delete=models.SET_NULL, 
        null=True, blank=True
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='cash')
    is_credit = models.BooleanField(
        default=False,
        help_text="Customer will pay later (credit sale)"
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        db_table = 'sales'
        ordering = ['-created_at']  # Newest first
 
    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.pharmacy.name}"
 
 
class SaleItem(models.Model):
    sale = models.ForeignKey(
        Sale, 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    inventory_item = models.ForeignKey(
        LocalInventory, 
        on_delete=models.PROTECT,  # PROTECT = cannot delete sold items
        help_text="Cannot delete inventory that has sale history"
    )
    medicine_name = models.CharField(
        max_length=255,
        help_text="Snapshot of medicine name at sale time"
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
 
    class Meta:
        db_table = 'sale_items'
 
    def __str__(self):
        return f"{self.medicine_name} x{self.quantity}"
 
 
 
class LowStockNotification(models.Model):
 
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='low_stock_alerts'
    )
    inventory_item = models.ForeignKey(
        LocalInventory, 
        on_delete=models.CASCADE
    )
    current_stock = models.PositiveIntegerField()
    is_read = models.BooleanField(
        default=False,
        help_text="Has the pharmacy staff seen this alert?"
    )
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        db_table = 'low_stock_notifications'
        ordering = ['-created_at']
 
    def __str__(self):
        return f"Low Stock: {self.inventory_item.medicine.name} @ {self.pharmacy.name}"
 

class StaffAttendance(models.Model):
    """optional"""
    pharmacy = models.ForeignKey(
        Pharmacy, 
        on_delete=models.CASCADE, 
        related_name='attendance_records'
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=[
            ('present', 'Present'),
            ('absent', 'Absent'),
            ('half_day', 'Half Day'),
            ('leave', 'On Leave'),
        ], 
        default='present'
    )
 
    class Meta:
        db_table = 'staff_attendance'
        unique_together = ['staff', 'date']  # One entry per staff per day
 
    def __str__(self):
        return f"{self.staff.username} - {self.date} ({self.status})"