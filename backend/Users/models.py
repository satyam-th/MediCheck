from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):

    # Role choices
    ROLE_CHOICES = [
        ('customer',     'Customer'),
        ('pharmacy',     'Pharmacy'),
        ('worker_admin', 'Worker Admin'),
        ('super_admin',  'Super Admin'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer'  # New registrations only customers
    )

    phone = models.CharField(max_length=20, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} [{self.role}]"
    @property
    def is_pharmacy(self):
        return self.role == 'pharmacy'

    @property
    def is_admin_user(self):
        return self.role in ('worker_admin', 'super_admin')
