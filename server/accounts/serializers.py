from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import College, Notification, School, Department, Course, CourseUnit, UnifiedToken

import random

User = get_user_model()

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

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

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'read']

class EmailSerializer(serializers.Serializer):
    to = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    html = serializers.CharField()
