from django.db import models
from django.conf import settings
# Create your models here.
 
class Medicine(models.Model):
    name = models.CharField(
        max_length=255, 
        db_index=True,  # Index for FAST search
        help_text="Medicine name (e.g., Paracetamol 500mg)"
    )
    generic_name = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Generic name (e.g., Paracetamol)"
    )
    composition = models.TextField(
        blank=True, 
        null=True,
        help_text="Active ingredients and their quantities"
    )
    side_effects = models.TextField(
        blank=True, 
        null=True,
        help_text="Known side effects"
    )
    manufacturer = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Pharmaceutical company"
    )
    medicine_type = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Tablet, Capsule, Syrup, Injection, etc."
    )
    requires_prescription = models.BooleanField(
        default=False,
        help_text="Does this require a doctor's prescription?"
    )
    photo = models.ImageField(
        upload_to='medicines/', 
        blank=True, 
        null=True,
        help_text="Medicine photo"
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Has an admin approved this medicine for public view?"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        help_text="Admin who created this entry"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        db_table = 'global_catalog'  # Physical table name
        ordering = ['name']           # Default sort by name
        verbose_name_plural = 'Medicines'
        # Composite index for fast name + generic search
        indexes = [
            models.Index(fields=['name', 'generic_name']),
        ]
 
    def __str__(self):
        return f"{self.name} ({self.generic_name or 'N/A'})"
