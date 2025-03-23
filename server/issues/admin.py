from django.contrib import admin
from .models import Issue, IssueCategory, IssueAttachment  # Import your models

# Register each model
admin.site.register(Issue)
admin.site.register(IssueCategory)
admin.site.register(IssueAttachment)