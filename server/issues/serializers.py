from rest_framework import serializers
from .models import Issue, IssueCategory, IssueAttachment
from accounts.serializers import UserSerializer

# This serializer is used for creating and updating issues.
# from courses.serializers import CourseSerializer
class IssueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueCategory
        fields = '__all__'

#        read_only_fields = ('id', 'created_at', 'updated_at')

class IssueAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueAttachment
        fields = ['id', 'file', 'uploaded_at']


# This serializer is used for creating and updating issues
class IssueSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    # Include attachments as a nested read-only list.
    attachments = IssueAttachmentSerializer(many=True, read_only=True)

    # Include category as a nested serializer.
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = (
            'id', 'token', 'created_by', 'assigned_to', 'statuses', 
            'created_at', 'updated_at', 'resolved_at'
        )
    def create(self, validated_data):
        # Additional custom logic can be added here if needed.
        return super().create(validated_data)

class IssueListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing issues."""
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')
    category_name = serializers.ReadOnlyField(source='category.name')
    course_code = serializers.ReadOnlyField(source='course.code')
    
    class Meta:
        model = Issue
        fields = (
            'id', 'token', 'title', 'statuses', 'priority', 
            'created_by_name', 'category_name', 'course_code', 
            'created_at', 'resolved_at'
        )
