from django.urls import path
from .views import IssueCreateView

urlpatterns = [
    path('view_issues/', IssueCreateView.as_view(), name='index'),
]