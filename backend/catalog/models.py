from django.db import models
from django.conf import settings
# Create your models here.
 
class GlobalMedicine(models.Model):
    STATUS_CHOICES = [
        ('pending',  'Pending Review'),
        ('approved', 'Approved'), 
        ('rejected', 'Rejected'),
    ]

    # Medicine 
    name         = models.CharField(max_length=200, db_index=True)
    generic_name = models.CharField(max_length=200, blank=True)
    composition  = models.TextField(blank=True)   # long text (no length limit)
    side_effects = models.TextField(blank=True)
    manufacturer = models.CharField(max_length=200, blank=True)
    category     = models.CharField(max_length=100, blank=True)

    requires_prescription = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='medicines/', null=True, blank=True)
    submitted_by = models.ForeignKey(
        'users.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,   
        related_name='submitted_medicines'  
    )
    approved_by = models.ForeignKey(
        'users.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_medicines'   
    )

    approval_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'  
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name'] 

    def __str__(self):
        return f"{self.name} ({self.generic_name})"
