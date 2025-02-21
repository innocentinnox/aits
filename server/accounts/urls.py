from django.urls import path
from .views import RegisterView, LoginView, logout_view, CollegeView, ProfileUpdateView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('college-reg/', CollegeView.as_view(), name='college'),
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),
]

