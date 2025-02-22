from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import Issue
from .serializers import IssueSerializer

User = get_user_model()

# Issue view: --> Only foe students
class IssueCreateView(generics.CreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'Student':
            raise PermissionDenied("Only students can create issues.")
        
        # Find Registrar: --> of students college
        registrar = User.objects.filter(role='registrar', college=user.college).first()
        serializer.save(created_by=user, assigned_to=registrar)

# Retrieve issue by token (for tracking)
class IssueDetailView(generics.RetrieveAPIView):
    serializer_class = IssueSerializer
    lookup_field = 'token'
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated]