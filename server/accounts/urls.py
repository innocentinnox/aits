from django.urls import path
from .views import (RegisterView, LoginView, logout_view, CollegeView, ProfileUpdateView, NotificationListView, status_view, TokenRefreshCookieView, CollegeView,   
    CollegeListAPIView,
    SchoolListAPIView,
    DepartmentListAPIView,
    CourseListAPIView,
    CourseUnitesListAPIView,
    SendEmailAPIView
    )

from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    # path('colleges/', CollegeView.as_view(), name='colleges'),
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('token/refresh/', TokenRefreshCookieView.as_view(), name='refresh-token'),
    path('status/', status_view, name='status'),

    path('colleges/', CollegeListAPIView.as_view(), name='colleges-list'),
    path('schools/', SchoolListAPIView.as_view(), name='schools-list'),
    path('departments/', DepartmentListAPIView.as_view(), name='departments-list'),
    path('courses/', CourseListAPIView.as_view(), name='courses-list'),
    path('course-units/', CourseUnitesListAPIView.as_view(), name='course-units-list'),
    
    path('send-email/', SendEmailAPIView.as_view(), name='send-email'),
]

