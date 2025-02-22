from rest_framework import serializers
from .models import Issue, IssueCategory

class IssueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueCategory
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['token', 'created_by', 'assigned_to', 'forwarded_to', 'status', 'created_at', 'updated_at']