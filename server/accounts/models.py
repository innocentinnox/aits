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
            if email.endswith("@students.ac.ug"):
                self.role = "Student"
            elif email.endswith("@cit.ac.ug"):
                self.role = "Lecturer"
            elif email.endswith("@mak.ac.ug"):
                self.role = "Registrar"
            else:
                self.role = "Student"  # Assign a default group if no match

        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.email} {self.role}"

# Notification model for browser popup alerts
class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications') 
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Notification for {self.recipient.email}: {self.message[:20]}"

# Audit log model to track activities
class AuditLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.timestamp} - {self.user}: {self.action}"