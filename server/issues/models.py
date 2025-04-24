from django.db import models
from django.conf import settings
import random
import time
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError

# Generate a 5-character token (using 8 characters for uniqueness)
def generate_issue_token(category_id, user_id):
    # Generate a random number with 3 digits
    random_part = random.randint(100, 999)
    # Get the last 4 digits of the current epoch time
    time_factor = int(time.time()) % 10000  
    return f"ISS-{category_id}-{user_id}-{random_part}-{time_factor}"

# Priority choices for categories and issues, with default values.
PRIORITY_CHOICES = [
    (1, "Low"),
    (2, "Medium"),
    (3, "High"),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('forwarded', 'Forwarded'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ('rejected', 'Rejected'),
    ('closed', 'Closed'),
]

YEAR_CHOICES = [(1, "Year 1"), (2, "Year 2"), (3, "Year 3"), (4, "Year 4"), (5, "Year 5")]
SEMESTER_CHOICES = [(1, "Semester 1"), (2, "Semester 2")]

# issue categories for the system.
class IssueCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    # Priority for the category; issues in this category will inherit this by default.
    priority = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, default=2)
    # Automatically assign issues of this category to a lecturer.
    auto_assign_to_lecturer = models.BooleanField(default=False)
    # Automatically assign issues of this category to a department head.
    def __str__(self):
        desc = (self.description.strip()[:60] + '...') if self.description and len(self.description) > 60 else (self.description or '')
        return f"{self.name} - {desc}"

class Issue(models.Model):
    token = models.CharField(max_length=24, unique=True, blank=True)
    category = models.ForeignKey(IssueCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='issues')
    
    # Student-specific details, if applicable. 
    course = models.ForeignKey('accounts.Course', on_delete=models.CASCADE)
    course_unit = models.ForeignKey('accounts.CourseUnit', on_delete=models.SET_NULL, null=True, blank=True)
    college = models.ForeignKey('accounts.College', on_delete=models.CASCADE) 
    year_of_study = models.PositiveSmallIntegerField(choices=YEAR_CHOICES, default=1)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES, default=1)

    # Automatically or manually assigned issue (for example, to the department head or Lecturer).
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    closed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='closed_issues')

    # Issue priority; default is inherited from the category if not specified.
    priority = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, blank=True, null=True, default=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Additional fields.
    resolution_details = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    # Track who last modified the issue.
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='modified_issues')


    class Meta:
        ordering = ['-created_at']


    def clean(self):
        # Example placeholder for status transition validations.
        # You can check if the status is being set in a valid sequence.
        # For instance, you might not allow transitioning from 'resolved' back to 'pending'.
        # if self.pk:
        #     old_instance = Issue.objects.get(pk=self.pk)
        #     if old_instance.status == 'resolved' and self.status not in ['reopened', 'closed']:
        #         raise ValidationError("Cannot change status from resolved to this state.")
        pass

    def save(self, *args, **kwargs):
        if not self.token:
            # Ensure that category and created_by are set.
            if self.category_id and self.created_by_id:
                self.token = generate_issue_token(self.category_id, self.created_by_id)
            else:
                # Fallback if for some reason they aren't set.
                self.token = generate_issue_token(0, 0)
            super().save(*args, **kwargs)

        # Set resolved_at when status changes to resolved (and it's not already set).
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
            super().save(update_fields=['resolved_at'])

    def attachment_list(self):
            return self.attachments.all()
    def __str__(self):
        return f"{self.title} - {self.token}"

# This model represents an attachment to an issue.
class IssueAttachment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Attachment for {self.issue.token} uploaded at {self.uploaded_at}"
