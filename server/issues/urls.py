from django.urls import path
from .views import (
    IssueCreateView, IssueDetailView, IssueUpdateView, 
    IssueListView, IssueCategoryView, RegistrarIssuesListView
)

urlpatterns = [
    path('create/', IssueCreateView.as_view(), name='issue-create'),
    path('list/', IssueListView.as_view(), name='issue-list'),
    path('categories/', IssueCategoryView.as_view(), name='issue-categories'),
    path('detail/<str:token>/', IssueDetailView.as_view(), name='issue-detail'),
    path('update/<str:token>/', IssueUpdateView.as_view(), name='issue-update'),
    path('registrar-view/', RegistrarIssuesListView.as_view(), name='registrar-issues'),
]
