from django.db import models
from django.conf import settings

import random
import string

# Generate a 5-character alphanumeric token.
def generate_issue_token():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))

ISSUE_DEFAULT_CHOICES = [
    ('missing_marks', 'Missing Marks'),
    ('exam_remark', 'Examination Remark'),
    ('missed_test', 'Missed Test'),
]

STATUS_CHOICES = [
    ('submitted', 'Submitted'),
    ('forwarded', 'Forwarded'),
    ('resolved', 'Resolved'),
]

SEMESTER_CHOICES = [
    ('semester_1', 'Semester One'),
    ('semester_2', 'Semester Two'),
    ('semester_3', 'Semester Three'),
]

YEAR_OF_STUDY = [
    ('first_year', 'First Year'),
    ('second_year', 'Second Year'),
    ('third_year', 'Third Year'),
    
]

class IssueCategory(models.Model):
    name = models.CharField(max_length=255)

class Issue(models.Model):
    token = models.CharField(max_length=5, unique=True, blank=True)
    category = models.ForeignKey(IssueCategory,choices=ISSUE_DEFAULT_CHOICES ,on_delete=models.CASCADE)
    description = models.TextField()
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='issues')
    
    # Student specific details
    student_registration_number = models.CharField(max_length=50)
    year_of_study = models.CharField(max_length=100, choices=YEAR_OF_STUDY)
    course_code = models.CharField(max_length=20)
    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)
    college = models.ForeignKey('accounts.College', on_delete=models.CASCADE)
    
    # Issue automatically assigned to the College Registrar --> Resolved or forwarded to the lecturer
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    forwarded_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='forwarded_issues')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    resolution_details = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = generate_issue_token()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.title} {self.token}"
