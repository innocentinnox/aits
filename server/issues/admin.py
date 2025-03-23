from django.contrib import admin
from .models import Issue, IssueCategory  # Import your models

# Register each model
admin.site.register(Issue)
admin.site.register(IssueCategory)