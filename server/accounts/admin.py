from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, College, School, Department, Course  # Import your custom user model

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email')
    ordering = ('date_joined',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(College)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(School)