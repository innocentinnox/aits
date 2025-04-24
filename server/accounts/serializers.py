from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import College, Notification, School, Department, Course, CourseUnit, UnifiedToken
from django.utils import timezone

import random

User = get_user_model()


# serializer for the College model.
# The User model is the custom user model defined in the accounts app
# The College model represents a college in the system

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']


# serializer for the School model.
# The CollegeSerializer class is a serializer for the College model
# It defines how the College model should be serialized and deserialized
class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

# serializer for the Department model.
# The SchoolSerializer class is a serializer for the School model
# It defines how the School model should be serialized and deserialized
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


# serializer for the Course model.
# The DepartmentSerializer class is a serializer for the Department model
# It defines how the Department model should be serialized and deserialized
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']
# The CourseSerializer class is a serializer for the Course model
# It defines how the Course model should be serialized and deserialized
class CourseUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUnit
        fields = ['id', 'title', 'code']


# Registration: Only username, email, and password are required.
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
# The RegisterSerializer class is a serializer for the User model
# It defines how the User model should be serialized and deserialize


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
                    'department': user.department.name if user.department else None,
                    'date_of_birth': user.date_of_birth,
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
    college = serializers.PrimaryKeyRelatedField(
        queryset=College.objects.all(),
        required=False,
        allow_null=True
    )
    school = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(),
        required=False,
        allow_null=True
    )
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        required=False,
        allow_null=True
    )
   # The ProfileUpdateSerializer class is a serializer for the User model
    # It defines how the User model should be serialized and deserialized for profile updates 
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'profile_image',
            'college', 'school', 'department', 'course',
            'student_number', 'registration_number'
        ]
class UserSerializer(serializers.ModelSerializer):
    college_name = serializers.ReadOnlyField(source='college.name')
    department_name = serializers.ReadOnlyField(source='department.name')
    course_name = serializers.ReadOnlyField(source='course.name')
    school_name = serializers.ReadOnlyField(source='school.name')
    # The UserSerializer class is a serializer for the User model
    # It defines how the User model should be serialized and deserialized
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'college', 'college_name', 'school', 'school_name',
            'department', 'department_name', 'course', 'course_name',
            'date_of_birth', 'student_number', 'registration_number', 
            'profile_image'
        )
        read_only_fields = ('id',)
# The UserSerializer class is a serializer for the User model
# It defines how the User model should be serialized and deserialized
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'read']

class EmailSerializer(serializers.Serializer):
    to = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    html = serializers.CharField()

"""
    This is used for email verifications and code verifications
"""
# This serializer is used to send a verification code to the user's email.
class SignupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# This serializer is used to create a token for email verification.
class UnifiedTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnifiedToken
        fields = '__all__'

# This serializer is used to verify the token and code sent to the user.
class VerifyTokenSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(required=False, write_only=True)

    def validate(self, data):
        try:
            token_obj = UnifiedToken.objects.get(id=data['token'])
        except UnifiedToken.DoesNotExist:
            raise serializers.ValidationError("Token not found.")

        if token_obj.expires_at < timezone.now():
            raise serializers.ValidationError("Token has expired.")


        if token_obj.code != data['code']:
            raise serializers.ValidationError("Invalid code.")

        data['token_obj'] = token_obj
        return data