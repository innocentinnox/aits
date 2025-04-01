from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .models import Issue, IssueCategory, IssueAttachment
from .serializers import IssueSerializer, IssueCategorySerializer
from accounts.utils import send_notification, log_audit
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from accounts.serializers import EmailSerializer
from accounts.utils import mailer

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
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'student':
            raise PermissionDenied("Only students can create issues.")
        
        registrar = User.objects.filter(role='registrar', college=user.college).first()
        issue = serializer.save(created_by=user, assigned_to=registrar)
        log_audit(user, "Issue Created", f"Issue '{issue.title}' with token {issue.token} created.")
        
        # Process file attachments if any
        for file in self.request.FILES.getlist('attachments'):
            IssueAttachment.objects.create(issue=issue, file=file)
        
        # Email notifications...
        result = mailer.send(
                to=user,
                subject="Issue Submitted Successfully",
                html=f"""
                    <h3>Issue has been Submitted Successfully to the authorities.</h3>
                    <p>Your issue '{issue.title}' has been submitted.</p>
                    <p><strong>Token:</strong> {issue.token}</p>
                    <p><strong>Details:</strong> {issue.description}</p>
                    """
                )
        if result:
            return Response({"message": result}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if registrar:
            result = mailer.send(
                to=registrar,
                subject="New Issue Assigned",
                html=f"""
                    <h3>There has been a new issue created!</h3>
                    <p>New Issue submitted by '{user.username}'.</p>
                    <p><strong>Token:</strong> {issue.token}</p>
                    <p><strong>Title:</strong> {issue.title}</p>
                    """
            )
            if result:
                return Response({"message": result}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
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
                # Notify student
                result = mailer.send(
                    to=issue.created_by,
                    subject="Issue Resolved Successfully!",
                    html=f"""
                        <h3>Your Issue has been resolved Successfully</h3>
                        <p>Your issue '{issue.title}' has been resolved by the registrar.</p>
                        <p><strong>Token:</strong> {issue.token}</p>
                        """
                )
                if result:
                    return Response({"message": result}, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            elif action == 'forward':
                # Registrar forwards the issue to a lecturer; expect 'forwarded_to' field in request data
                lecturer_id = request.data.get('forwarded_to')
                if not lecturer_id:
                    return Response({"error": "Lecturer id is required for forwarding."}, status=status.HTTP_400_BAD_REQUEST)
                request.data['status'] = 'forwarded'
                # Notify lecturer
                lecturer = User.objects.filter(id=lecturer_id, role='lecturer').first()
                if lecturer:
                    result = mailer.send(
                        to=lecturer,
                        subject="Issue Forwarded to You",
                        html=f"""
                            <h3>There has been an issue forwarded to you.</h3>
                            <p>Issue '{issue.title}'.</p>
                            <p><strong>Token:</strong> {issue.token}</p>
                            <p><strong>Action:</strong>This has been forwarded to you by the registrar! </p>
                            """
                    )
                    if result:
                        return Response({"message": result}, status=status.HTTP_200_OK)
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
            result = mailer.send(
                    to=issue.created_by,
                    subject="Issue Resolved by Lecturer",
                    html=f"""
                        <h3>The Lecturer has resolved your issue!.</h3>
                        <p>Your Issue with title: ' {issue.title} '.</p>
                        <p><strong>Token: </strong> {issue.token}</p>
                        <p><strong>Action: </strong>This issue has been resolved by the Lecturer! </p>
                        """
            )
            if result:
                return Response({"message": result}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return super().patch(request, *args, **kwargs)
        
        else:
            return Response({"error": "Not authorized to update this issue."}, status=status.HTTP_403_FORBIDDEN)
        

class IssueListView(generics.ListAPIView):
    """
    Returns a paginated list of issues for the current student.
    Supports filtering via query parameters:
      - search: text to search in title, description, or resolution_details.
      - priority: filter by priority (1, 2, or 3).
      - category: filter by IssueCategory id.
      - assigned_to: filter by assigned_to user's email (case insensitive).
      - college: filter by College id.
      - course_unit: filter by CourseUnit id.
      - status: filter by status (e.g., 'pending').
      - year: filter by year_of_study.
      - ordering: sort the results (e.g., 'priority', '-created_at').
      - take: number of records per page (default: 10).
      - skip: offset (default: 0).
    The response includes metadata: total, take, skip and the issues list.
    """
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Show only issues created by the student.
        qs = Issue.objects.filter(created_by=user)

        # Search filter (title, description, resolution_details)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(resolution_details__icontains=search)
            )

        # Filter by priority
        priority = self.request.query_params.get("priority")
        if priority:
            qs = qs.filter(priority=priority)

        # Filter by category id
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__id=category)

        # Filter by assigned_to (using email)
        assigned_to = self.request.query_params.get("assigned_to")
        if assigned_to:
            qs = qs.filter(assigned_to__email__iexact=assigned_to)

        # Filter by college id
        college = self.request.query_params.get("college")
        if college:
            qs = qs.filter(college__id=college)

        # Filter by course_unit id
        course_unit = self.request.query_params.get("course_unit")
        if course_unit:
            qs = qs.filter(course_unit__id=course_unit)

        # Filter by status
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status__iexact=status_param)

        # Filter by year_of_study
        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year_of_study=year)

        # Sorting: ordering parameter (e.g., "priority", "-created_at")
        ordering = self.request.query_params.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        total = qs.count()
        try:
            take = int(request.query_params.get("take", 10))
        except ValueError:
            take = 10
        try:
            skip = int(request.query_params.get("skip", 0))
        except ValueError:
            skip = 0

        # Apply pagination manually.
        qs_paginated = qs[skip:skip + take]
        serializer = self.get_serializer(qs_paginated, many=True)
        return Response({
            "total": total,
            "take": take,
            "skip": skip,
            "issues": serializer.data
        }, status=status.HTTP_200_OK)