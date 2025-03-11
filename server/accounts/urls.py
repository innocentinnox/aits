from django.urls import path
from .views import RegisterView, LoginView, logout_view, CollegeView, ProfileUpdateView, NotificationListView, status_view, TokenRefreshCookieView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('login-test/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('colleges/', CollegeView.as_view(), name='colleges'),
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('token/refresh/', TokenRefreshCookieView.as_view(), name='refresh-token'),
    path('status/', status_view, name='status'),
]

