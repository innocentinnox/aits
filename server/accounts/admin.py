from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, College, School, Department, Course, CourseUnit

class CustomUserAdmin(UserAdmin):
    # This is the custom user admin class that inherits from UserAdmin
    model = CustomUser
    # The list_display attribute specifies the fields to be displayed in the admin list view
    # The fields are specified in the order they should appear
    # The fields include the default UserAdmin fields and some additional fields
    list_display = (
        'username', 'email', 'role', 'college', 'school', 'department', 'course',
        'date_of_birth', 'student_number', 'registration_number', 'is_staff', 
        'is_active', 'date_joined'
    )
    search_fields = ('username', 'email', 'student_number', 'registration_number')
    ordering = ('date_joined',)
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {
            "fields": (
                'role', 'college', 'school', 'department', 'course',
                'date_of_birth', 'profile_image', 'student_number', 'registration_number'
            ),
        }),
    )
    # The add_fieldsets attribute specifies the fields to be displayed when adding a new user
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Additional Info", {
            "fields": (
                'role', 'college', 'school', 'department', 'course',
                'date_of_birth', 'profile_image', 'student_number', 'registration_number'
            ),
        }),
    )
# The form attribute specifies the form to be used for creating and updating users
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(College)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(CourseUnit)
admin.site.register(School)
