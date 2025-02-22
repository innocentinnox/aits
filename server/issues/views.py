from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import Issue, IssueCategory
from .serializers import IssueSerializer, IssueCategorySerializer

User = get_user_model()

# Categories of issues
class IssueCategoryView(generics.ListCreateAPIView):
    query_set = IssueCategory.objects.all()
    serializer_class = IssueCategorySerializer
    permission_classes = [AllowAny]

# Issue view: --> Only foe students
class IssueCreateView(generics.CreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]
    
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


# Update Issue view: --> for registrar or lecturer to update issue status
class IssueUpdateView(generics.UpdateAPIView):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    lookup_field = 'token'
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        issue = self.get_object()
        user = request.user
        
        # Registrar actions: can resolve or forward an issue
        if user.role == 'registrar' and issue.assigned_to == user:
            action = request.data.get('action')
            if action == 'resolve':
                # Registrar resolves the issue
                request.data['status'] = 'resolved'
            elif action == 'forward':
                # Registrar forwards the issue to a lecturer; expect 'forwarded_to' field in request data
                lecturer_id = request.data.get('forwarded_to')
                if not lecturer_id:
                    return Response({"error": "Lecturer id is required for forwarding."}, status=status.HTTP_400_BAD_REQUEST)
                request.data['status'] = 'forwarded'
            else:
                return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
            return super().patch(request, *args, **kwargs)
        
        # Lecturer actions: if issue is forwarded to them, they can mark it resolved by adding resolution details.
        elif user.role == 'lecturer' and issue.forwarded_to == user:
            request.data['status'] = 'resolved'
            return super().patch(request, *args, **kwargs)
        
        else:
            return Response({"error": "Not authorized to update this issue."}, status=status.HTTP_403_FORBIDDEN)