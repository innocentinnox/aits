from django.urls import path
from .views import IssueCreateView, IssueDetailView, IssueUpdateView, IssueCategoryView

urlpatterns = [
    path('issues/', IssueCreateView.as_view(), name='issue-create'),
    path('issue-categories/', IssueCategoryView.as_view(), name='issue-create-category'),
    path('issues/<str:token>/', IssueDetailView.as_view(), name='issue-detail'),
    path('issues/<str:token>/update/', IssueUpdateView.as_view(), name='issue-update'),
]
