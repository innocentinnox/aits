from django.db import models
from django.contrib.auth.models import AbstractUser

ROLE_CHOICES = (
        ('registrar', 'Registrar'),
        ('lecturer', 'Lecturer'),
        ('student', 'Student'),
    )

def user_profile_image_path(instance, filename):
    return f"profile_images/user_{instance.id}/{filename}"


class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Student')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
    
    profile_image = models.ImageField(upload_to=user_profile_image_path, null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    # Additional fields for students only
    student_number = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        # Auto-assign role based on email structure if role is not explicitly set.
        if not self.role:
            email_lower = self.email.lower()
            if email.endswith("@students.mak"):
            group_name = "Student"
            elif email.endswith("@cit.mak"):
            group_name = "Lecturer"
            elif email.endswith("@cit.mak"):
            group_name = "Registrar"
            else:
            group_name = "Student"  # Assign a default group if no match

        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.email} {self.role}"