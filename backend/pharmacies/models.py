
from django.db import models, transaction
from django.utils import timezone


class Pharmacy(models.Model):

    STATUS_CHOICES = [
        ('pending',   'Pending Approval'),    # Just created
        ('active',    'Active'),              # Visible to customers
        ('suspended', 'Suspended'),           # Temporarily hidden
        ('banned',    'Banned'),              # Permanently blocked
    ]

    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,  
        related_name='pharmacy',   
    )

    name           = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20)

    address        = models.TextField()

    # GPS coordinates (for the map)
    latitude  = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    license_number = models.CharField(max_length=100, blank=True)
    pan_number     = models.CharField(max_length=100, blank=True)

    open_time  = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)

    low_stock_threshold = models.PositiveIntegerField(default=10)
    approved_by = models.ForeignKey(
        'users.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,  
        related_name='approved_pharmacies',
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def is_open(self):
        if not self.open_time or not self.close_time:
            return False

      
        now = timezone.now().time()

      
        return self.open_time <= now <= self.close_time



class PharmacyProfileChangeRequest(models.Model):

    STATUS_CHOICES = [
        ('pending',  'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    # Fields a pharmacy may request to change (admin must approve)
    # key -> target: license_number/pan_number -> Pharmacy; owner_* -> User
    REQUESTABLE_FIELDS = {
        'license_number':     'pharmacy',
        'pan_number':         'pharmacy',
        'owner_first_name':   'user',
        'owner_last_name':    'user',
        'owner_phone':        'user',
    }

    # Request key -> actual model field on the owner User account
    OWNER_FIELD_MAP = {
        'owner_first_name': 'first_name',
        'owner_last_name':  'last_name',
        'owner_phone':      'phone',
    }

    pharmacy = models.ForeignKey(
        Pharmacy,
        on_delete=models.CASCADE,
        related_name='profile_change_requests',
    )
    requested_by = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='profile_change_requests',
    )

    requested_changes = models.JSONField(default=dict)

    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    note       = models.CharField(max_length=300, blank=True)

    reviewed_by   = models.ForeignKey(
        'users.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='reviewed_profile_requests',
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.pharmacy.name} — {self.status}"

    def apply_changes(self):
        """Write the approved changes onto the Pharmacy / owner User."""
        with transaction.atomic():
            pharmacy = self.pharmacy
            user     = pharmacy.user
            user_fields = []

            for field, value in self.requested_changes.items():
                target = self.REQUESTABLE_FIELDS.get(field)
                if target == 'pharmacy' and value is not None:
                    setattr(pharmacy, field, value)
                elif target == 'user' and value is not None:
                    attr = self.OWNER_FIELD_MAP.get(field)
                    if attr is None:
                        continue
                    setattr(user, attr, value)
                    user_fields.append(attr)

            pharmacy.save()
            if user_fields:
                user.save(update_fields=user_fields)



class LocalInventory(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy,
        on_delete=models.CASCADE,  
        related_name='inventory', 
    )

    medicine = models.ForeignKey(
        'catalog.GlobalMedicine',
        on_delete=models.CASCADE,  
        related_name='stock',      
                )

    
    quantity     = models.PositiveIntegerField(default=0)
    mrp          = models.DecimalField(max_digits=10, decimal_places=2)
    

    batch_number = models.CharField(max_length=100, blank=True)
    expiry_date  = models.DateField(null=True, blank=True)

    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('pharmacy', 'medicine', 'batch_number')

    def __str__(self):
        return f"{self.pharmacy.name} → {self.medicine.name} (qty: {self.quantity})"

    @property
    def stock_status(self):
        if self.quantity == 0:
            return 'out_of_stock'
        elif self.quantity <= self.pharmacy.low_stock_threshold:
            return 'low_stock'
        else:
            return 'available'

#pos
class Sale(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy,
        on_delete=models.CASCADE,
        related_name='sales',     # pharmacy.sales.all()
    )

    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,  # Keep sale history even if staff account is deleted
        null=True,
        related_name='sales',
    )

    patient_name  = models.CharField(max_length=200, blank=True)
    patient_phone = models.CharField(max_length=20, blank=True)

    #  Financial details
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
   
    is_credit   = models.BooleanField(default=False)
   

    credit_paid = models.BooleanField(default=False)
   
    notes      = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale #{self.id} — {self.pharmacy.name} — nrs{self.total_amount}"


class SaleItem(models.Model):
    sale      = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,  
        related_name='items',     
    )
    inventory = models.ForeignKey(
        LocalInventory,
        on_delete=models.PROTECT, 
       
    )

    quantity   = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
   

    @property
    def subtotal(self):
     
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.inventory.medicine.name} + {self.quantity}"


# ─────────────────────────────────────────────────────────────────────────────
# MODEL 5: PATIENT (credit tracking)
# ─────────────────────────────────────────────────────────────────────────────

class Patient(models.Model):
    pharmacy = models.ForeignKey(
        Pharmacy,
        on_delete=models.CASCADE,
        related_name='patients',
    )

    name               = models.CharField(max_length=200)
    phone              = models.CharField(max_length=20, blank=True)
    address            = models.TextField(blank=True)
    outstanding_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
   
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (owes nrs{self.outstanding_credit})"


class StaffAttendance(models.Model):
    STATUS_CHOICES = [
        ('present',  'Present'),
        ('absent',   'Absent'),
        ('late',     'Late'),
        ('half_day', 'Half Day'),
    ]

    pharmacy     = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='attendance')
    staff_member = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='attendance')
    date         = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    notes  = models.TextField(blank=True)  # Optional

    class Meta:

        unique_together = ('pharmacy', 'staff_member', 'date')

    def __str__(self):
        return f"{self.staff_member.username} — {self.date} — {self.status}"
