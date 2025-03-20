from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

ROLE_CHOICES = (
    ('registrar', 'Registrar'),
    ('lecturer', 'Lecturer'),
    ('student', 'Student'),
)

def user_profile_image_path(instance, filename):
    return f"profile_images/user_{instance.id}/{filename}"

class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=20, blank=True, null=True)
   
    def __str__(self):
        return self.name

class School(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='schools')
   
    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='departments')
   
    def __str__(self):
        return self.name
   
class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    lecturer = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='courses_taught')
   
    def __str__(self):
        return f"{self.code} - {self.name}"

class Class(models.Model):
    name = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    
    def __str__(self):
        return f"{self.course.code} - {self.name}"
   
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name='school_users')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    profile_image = models.ImageField(upload_to=user_profile_image_path, null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    # Additional fields for students only
    student_number = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)
   
    def save(self, *args, **kwargs):
        # Auto-assign role based on email structure if role is not explicitly set.
        if not self.role:
            email = self.email.lower()
            if email.endswith("@students.ac.ug"):
                self.role = "student"
            elif email.endswith("@cit.ac.ug"):
                self.role = "lecturer"
            elif email.endswith("@mak.ac.ug"):
                self.role = "registrar"
            else:
                self.role = "student"  # Assign a default group if no match
        super().save(*args, **kwargs)
       
    def __str__(self):
        return f"{self.email} {self.role}"

# Notification model for browser popup alerts
class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
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
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
   
    def __str__(self):
        return f"{self.timestamp} - {self.user}: {self.action}"