from django.db import models
from django.contrib.auth.models import AbstractUser


# Role choices, email hosts, and names
# This dictionary contains the role names and their corresponding email hosts
import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta

TOKEN_TYPE_CHOICES = (
    ('email_verification', 'Email Verification'),
    ('password_reset', 'Password Reset'), 
)

# Role choices
ROLES_DATA = {
    "student": {
        "email_hosts": ["students.mak.ac.ug"],
        "name": "Student",
    },
    "lecturer": {
        "email_hosts": ["cit.ac.ug", "chuss.mak.ac.ug", "cocis.mak.ac.ug", "cedat.mak.ac.ug"],
        "name": "Lecturer",
    },
    "department_head": {
        "email_hosts": ["mak.ac.ug", "cit.ac.ug", "chuss.mak.ac.ug", "cocis.mak.ac.ug", "cedat.mak.ac.ug"],
        "name": "Department Head",
    },
    "registrar": {
        "email_hosts": ["mak.ac.ug", "cit.ac.ug", "chuss.mak.ac.ug", "cocis.mak.ac.ug", "cedat.mak.ac.ug"],
        "name": "Registrar",
    },
}

def user_profile_image_path(instance, filename):
    return f"profile_images/user_{instance.id}/{filename}"
# This function generates a path for the user profile image based on the user's ID.
class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=20, blank=True, null=True)
   
    def __str__(self):
        return self.name
# This class represents a college in the university system.
class School(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='schools')
   
    def __str__(self):
        return self.name
# This class represents a school within a college.
# Each school is associated with a college.
class Department(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='departments')
    # Optional department head field
    department_head = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments',
        limit_choices_to={'role': 'department_head'}
    )
   
    def __str__(self):
        return self.name
# This class represents a department within a school.
# Each department is associated with a school.
class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='courses')
    department = models.ForeignKey(Department, on_delete=models.DO_NOTHING, related_name='courses')
    years = models.IntegerField(default=3)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

from django.db import models

# This class represents a course unit within a course.
# Each course unit is associated with a course and can have multiple lecturers.
class CourseUnit(models.Model):
    YEAR_CHOICES = [
        (1, "Year 1"), 
        (2, "Year 2"), 
        (3, "Year 3"), 
        (4, "Year 4"), 
        (5, "Year 5")
    ]

    SEMESTER_CHOICES = [
        (1, "Semester 1"), 
        (2, "Semester 2") 
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="units")
    code = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    lecturers = models.ManyToManyField(
        "accounts.CustomUser",
        related_name="course_units",
        help_text="Assign one or more lecturers to this course unit.",
    )
    year_taken = models.PositiveSmallIntegerField(choices=YEAR_CHOICES, default=1)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES, default=1)

    def __str__(self):
        return f"{self.code} - {self.title} (Year {self.year_taken}, Semester {self.semester})"

    def clean(self):
        from django.core.exceptions import ValidationError
        
        # Ensure that at least one lecturer is assigned.
        if self.pk and self.lecturers.count() < 1:
            raise ValidationError("At least one lecturer must be assigned to a course unit.")
# This method is called before saving the instance to validate the data.
# It checks if at least one lecturer is assigned to the course unit.        
class Class(models.Model):
    name = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    
    def __str__(self):
        return f"{self.course.code} - {self.name}"
#
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=[(key, value["name"]) for key, value in ROLES_DATA.items()],  # Extract choices from ROLES
        default="student",
    )
#
    # Foreign keys
    college = models.ForeignKey("College", on_delete=models.SET_NULL, null=True, blank=True)
    school = models.ForeignKey("School", on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey("Department", on_delete=models.SET_NULL, null=True, blank=True)
    course = models.ForeignKey("Course", on_delete=models.SET_NULL, null=True, blank=True, related_name="students")

    # Additional fields
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    email_verified = models.DateField(blank=True, null=True)
    student_number = models.CharField(max_length=50, blank=True, null=True)
    registration_number = models.CharField(max_length=50, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Only auto-assign if this is a new record and the role is still the default value.
        if self.pk is None and self.role == "student":
            email_domain = self.email.split("@")[-1]  # Extract domain from email
            for role, data in ROLES_DATA.items():
                if email_domain in data["email_hosts"]:
                    self.role = role
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
    
# Notification model for browser popup alerts, email alerts, and SMS alerts
# This model is used to store notifications for users.
class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
   
    def __str__(self):
        return f"Notification for {self.recipient.email}: {self.message[:20]}"

# Audit log model to track activities, changes, and actions performed by users
# This model is used to store audit logs for user actions.
class AuditLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
    
    @classmethod
    def log_action(cls, user, action, description='', request=None):
        ip_address = None
        user_agent = None
        if request:
            ip_address = request.META.get('REMOTE_ADDR') or request.META.get('HTTP_X_FORWARDED_FOR')
            user_agent = request.META.get('HTTP_USER_AGENT')
        
        return cls.objects.create(
            user=user,
            action=action,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent
        )

    def __str__(self):
        return f"{self.timestamp} - {self.user}: {self.action}"

class UnifiedToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=6)  # 6-digit numeric code
    email = models.EmailField()
    token_type = models.CharField(max_length=20, choices=TOKEN_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} - {self.token_type} ({self.id})"