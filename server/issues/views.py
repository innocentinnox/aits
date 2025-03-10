from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import Issue, IssueCategory
from .serializers import IssueSerializer, IssueCategorySerializer
from accounts.utils import send_notification, log_audit

User = get_user_model()

# Categories of issues
class IssueCategoryView(generics.ListCreateAPIView):
    queryset = IssueCategory.objects.all()
    serializer_class = IssueCategorySerializer
    permission_classes = [AllowAny]

# Issue view: --> Only for students
class IssueCreateView(generics.CreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'Student':
            raise PermissionDenied("Only students can create issues.")
        
        # Find Registrar: --> of students college
        registrar = User.objects.filter(role='registrar', college=user.college).first()
        issue = serializer.save(created_by=user, assigned_to=registrar)
        
        # Audit log for issue creation
        log_audit(user, "Issue Created", f"Issue '{issue.title}' with token {issue.token} created.")
        
        # Email notifications:
        # Email the student with full details.
        send_notification(
            recipient=user,
            subject="Issue Submitted Successfully",
            message=f"Your issue '{issue.title}' has been submitted with token {issue.token}. Details: {issue.description}"
        )
        # Email the registrar with brief details.
        if registrar:
            send_notification(
                recipient=registrar,
                subject="New Issue Assigned",
                message=f"New issue submitted by {user.username}.\nToken: {issue.token}\nTitle: {issue.title}"
            )

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
                msg = f"Issue '{issue.title}' has been resolved by the registrar."
                # Notify student
                send_notification(
                    recipient=issue.created_by,
                    subject="Issue Resolved",
                    message=msg
                )
            elif action == 'forward':
                # Registrar forwards the issue to a lecturer; expect 'forwarded_to' field in request data
                lecturer_id = request.data.get('forwarded_to')
                if not lecturer_id:
                    return Response({"error": "Lecturer id is required for forwarding."}, status=status.HTTP_400_BAD_REQUEST)
                request.data['status'] = 'forwarded'
                # Notify lecturer
                lecturer = User.objects.filter(id=lecturer_id, role='lecturer').first()
                if lecturer:
                    send_notification(
                        recipient=lecturer,
                        subject="Issue Forwarded to You",
                        message=f"Issue '{issue.title}' (Token: {issue.token}) has been forwarded to you by the registrar."
                    )
                    # Audit log for forwarding
                    log_audit(user, "Issue Forwarded", f"Issue '{issue.title}' with token {issue.token} forwarded to lecturer {lecturer.username}.")
                else:
                    return Response({"error": "Lecturer not found."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
            log_audit(user, "Issue Updated", f"Registrar {user.username} updated issue '{issue.title}' with action {action}.")
            return super().patch(request, *args, **kwargs)
        
        # Lecturer actions: if issue is forwarded to them, they can mark it resolved by adding resolution details.
        elif user.role == 'lecturer' and issue.forwarded_to == user:
            request.data['status'] = 'resolved'
            log_audit(user, "Issue Resolved", f"Lecturer {user.username} resolved issue '{issue.title}'.")
            # Notify student upon resolution.
            send_notification(
                recipient=issue.created_by,
                subject="Issue Resolved by Lecturer",
                message=f"Your issue '{issue.title}' (Token: {issue.token}) has been resolved."
            )
            return super().patch(request, *args, **kwargs)
        
        else:
            return Response({"error": "Not authorized to update this issue."}, status=status.HTTP_403_FORBIDDEN)