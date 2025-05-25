from django.urls import path
from .views import (LoginView, CollegeView, ProfileUpdateView, NotificationListView, status_view, TokenRefreshCookieView, CollegeView,   
    CollegeListAPIView,
    SchoolListAPIView,
    DepartmentListAPIView,
    CourseListAPIView,
    CourseUnitesListAPIView,
    LecturersListAPIView,
    SendEmailAPIView,
    SignupAPIView, 
    VerifyTokenAPIView,
    PasswordResetRequestAPIView,
    LogoutView
    )

from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
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
    path('lecturers/', LecturersListAPIView.as_view(), name='lecturers-list'),
    
    path('send-email/', SendEmailAPIView.as_view(), name='send-email'),
    
    # Verification
    
    path('password-reset/', PasswordResetRequestAPIView.as_view(), name='password-reset'),
    path('verify/', VerifyTokenAPIView.as_view(), name='verify-token'),
]