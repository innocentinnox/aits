from django.urls import path
from .views import IssueCreateView, IssueDetailView, IssueUpdateView, IssueCategoryView

urlpatterns = [
    path('create/', IssueCreateView.as_view(), name='issue-create'),
    path('categories/', IssueCategoryView.as_view(), name='issue-create-category'),
    path('<str:token>/', IssueDetailView.as_view(), name='issue-detail'),
    path('<str:token>/update/', IssueUpdateView.as_view(), name='issue-update'),
]
