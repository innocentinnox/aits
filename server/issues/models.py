from django.db import models
from django.conf import settings
import uuid
from datetime import timedelta
from django.utils import timezone

# Generate a 5-character alphanumeric token.
def generate_issue_token():
    return f"ISS-{str(uuid.uuid4())[:8].upper()}"


STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('forwarded', 'Forwarded'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ('rejected', 'Rejected'),
]

YEAR_CHOICES = [(1, "Year 1"), (2, "Year 2"), (3, "Year 3"), (4, "Year 4"), (5, "Year 5")]
SEMESTER_CHOICES = [ (1, "Semester 1"), (2, "Semester 2") ]

class IssueCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.description.strip()[:60]}{'' if len(self.description) <= 60 else '...'}"

class Issue(models.Model):
    token = models.CharField(max_length=5, unique=True, blank=True)
    category = models.ForeignKey(IssueCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='issues')
    
    # Student specific details
    student_registration_number = models.CharField(max_length=50)
    course = models.ForeignKey('accounts.Course', on_delete=models.CASCADE)
    course_unit = models.ForeignKey('accounts.CourseUnit', on_delete=models.CASCADE)
    college = models.ForeignKey('accounts.College', on_delete=models.CASCADE) 
    year_of_study = models.PositiveSmallIntegerField(choices=YEAR_CHOICES, default=1)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES, default=1)

    # Issue automatically assigned to the College Registrar --> Resolved or forwarded to the lecturer
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    forwarded_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='forwarded_issues')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')

    # Additional fields
    resolution_details = models.TextField(blank=True, null=True)
    attachments = models.FileField(upload_to='attachments/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = generate_issue_token()
        super().save(*args, **kwargs)

        # If status is changed to resolved, set resolved_at
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
    def __str__(self):
        return f"{self.title} - {self.token}"
