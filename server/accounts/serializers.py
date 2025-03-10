from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import College, Notification

User = get_user_model()

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']

# Registration: Only username, email, and password are required.
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()
        if user and user.check_password(data['password']):
            refresh = RefreshToken.for_user(user)
            return {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'college': user.college.name if user.college else None,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_image': user.profile_image.url if user.profile_image else None,
                    'student_number': user.student_number if user.role == 'student' else None,
                    'registration_number': user.registration_number if user.role == 'student' else None,
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
        raise serializers.ValidationError("Invalid credentials")
    
# Profile update serializer: Allows updating personal details.
class ProfileUpdateSerializer(serializers.ModelSerializer):
    college = serializers.SlugRelatedField(
        queryset=College.objects.all(),
        slug_field='name',
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = User
        # All users can update first/last name, profile image, and college.
        # Student-specific fields (student_number, registration_number) are optional.
        fields = ['first_name', 'last_name','date_of_birth', 'profile_image', 'college', 'student_number', 'registration_number']
        
# These are optional
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'read']
