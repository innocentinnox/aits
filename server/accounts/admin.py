from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, College, School, Department, Course

class CustomUserAdmin(UserAdmin):
    model = CustomUser
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
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Additional Info", {
            "fields": (
                'role', 'college', 'school', 'department', 'course',
                'date_of_birth', 'profile_image', 'student_number', 'registration_number'
            ),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(College)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(School)
