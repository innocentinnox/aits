from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializers):
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['token', 'created_by', 'assigned_to', 'forwarded_to', 'status', 'created_at', 'updated_at']