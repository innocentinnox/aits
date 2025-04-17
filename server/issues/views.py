from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model

from .signals import issue_status_changed  # Updated import from local signals
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

class IssueCreateView(generics.CreateAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'student':
            raise PermissionDenied("Only students can create issues.")
        
        # Getting registrar and the college she belongs to
        registrar = User.objects.filter(role='registrar', college=user.college).first()
        issue = serializer.save(created_by=user, assigned_to=registrar)
        log_audit(user, "Issue Created", f"Issue '{issue.title}' with token {issue.token} created.")
        
        # Process file attachments if any
        for file in self.request.FILES.getlist('attachments'):
            IssueAttachment.objects.create(issue=issue, file=file)
        
        # Email notifications are now handled by the post_save signal
        issue_status_changed(sender=Issue, instance=issue, created=True)
        return issue
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Issue created successfully and notifications sent."}, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )

# New Registrar Issues List View
class RegistrarIssuesListView(generics.ListAPIView):
    """
    Returns a paginated list of issues for the current registrar to handle.
    Only shows issues from students in the registrar's college.
    
    Supports filtering via query parameters:
      - search: text to search in title, description, or resolution_details.
      - priority: filter by priority (1, 2, or 3).
      - category: filter by IssueCategory id.
      - status: filter by status (e.g., 'pending', 'forwarded').
      - course: filter by Course id.
      - course_unit: filter by CourseUnit id.
      - year: filter by year_of_study.
      - semester: filter by semester.
      - created_after: filter by creation date (YYYY-MM-DD).
      - created_before: filter by creation date (YYYY-MM-DD).
      - ordering: sort the results (e.g., 'priority', '-created_at').
      - take: number of records per page (default: 10).
      - skip: offset (default: 0).
    """
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Only allow registrars to access this endpoint
        if user.role != 'registrar':
            raise PermissionDenied("Only registrars can view this list.")
        
        # Get issues assigned to this registrar (which should be from their college)
        qs = Issue.objects.filter(assigned_to=user)
        
        # Apply filters
        
        # Search filter (title, description, resolution_details, token)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(resolution_details__icontains=search) |
                Q(token__icontains=search)
            )

        # Filter by priority
        priority = self.request.query_params.get("priority")
        if priority:
            qs = qs.filter(priority=priority)

        # Filter by category id
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__id=category)

        # Filter by course id
        course = self.request.query_params.get("course")
        if course:
            qs = qs.filter(course__id=course)

        # Filter by course_unit id
        course_unit = self.request.query_params.get("course_unit")
        if course_unit:
            qs = qs.filter(course_unit__id=course_unit)

        # Filter by status with comma-separated values
        status_param = self.request.query_params.get("statuses")
        if status_param:
            statuses = [s.strip() for s in status_param.split(",") if s.strip()]
            qs = qs.filter(status__in=statuses)

        # Filter by year_of_study
        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year_of_study=year)
            
        # Filter by semester
        semester = self.request.query_params.get("semester")
        if semester:
            qs = qs.filter(semester=semester)
            
        # Filter by created_after date
        created_after = self.request.query_params.get("created_after")
        if created_after:
            qs = qs.filter(created_at__gte=created_after)
            
        # Filter by created_before date
        created_before = self.request.query_params.get("created_before")
        if created_before:
            qs = qs.filter(created_at__lte=created_before)

        # Sorting: ordering parameter (e.g., "priority", "-created_at")
        ordering = self.request.query_params.get("ordering", "-created_at")  # Default to newest first
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
        
        # Log the action
        log_audit(request.user, "View Issues List", f"Registrar viewed list of {total} issues")
        
        return Response({
            "total": total,
            "take": take,
            "skip": skip,
            "issues": serializer.data
        }, status=status.HTTP_200_OK)
        
# Retrieve issue by token (for tracking)
class IssueDetailView(generics.RetrieveAPIView):
    serializer_class = IssueSerializer
    lookup_field = 'token'
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated]

# This will be used for resolving and forwarding issues
class IssueUpdateView(generics.UpdateAPIView):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    lookup_field = 'token'
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, *args, **kwargs):
        issue = self.get_object()
        user = request.user
        
        # Registrar actions: can resolve or forward an issue
        if user.role == 'registrar' and issue.assigned_to.email == user.email:
            action = request.data.get('action')
            if action == 'resolve':
                # Registrar resolves the issue
                request.data['status'] = 'resolved'

                # Email will be sent via signal
                issue_status_changed(sender=Issue, instance=issue, created=False)

                # Log the action
                log_audit(user, "Issue Resolved", f"Issue '{issue.title}' with token {issue.token} resolved by registrar.")

                response = super().patch(request, *args, **kwargs)
                if response.status_code == 200:
                    return Response({"message": "Issue resolved and notification sent."}, status=status.HTTP_200_OK)
                return response
                
            elif action == 'forward':
                # Registrar forwards the issue to a lecturer; expect 'forwarded_to' field in request data
                lecturer_id = request.data.get('forwarded_to')
                if not lecturer_id:
                    return Response({"error": "Lecturer id is required for forwarding."}, status=status.HTTP_400_BAD_REQUEST)
                
                lecturer = User.objects.filter(id=lecturer_id, role='lecturer').first()
                if not lecturer:
                    return Response({"error": "Lecturer not found."}, status=status.HTTP_400_BAD_REQUEST)
                
                request.data['status'] = 'forwarded'

                # Email will be sent via signal
                issue_status_changed(sender=Issue, instance=issue, created=False)


                response = super().patch(request, *args, **kwargs)
                if response.status_code == 200:
                    # Audit log for forwarding
                    log_audit(user, "Issue Forwarded", f"Issue '{issue.title}' with token {issue.token} forwarded to lecturer {lecturer.username}.")
                    return Response({"message": "Issue forwarded and notification sent."}, status=status.HTTP_200_OK)
                return response
                
            else:
                return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
            
            log_audit(user, "Issue Updated", f"Registrar {user.username} updated issue '{issue.title}' with action {action}.")
            
        # Lecturer actions: if issue is forwarded to them, they can mark it resolved by adding resolution details.
        elif user.role == 'lecturer' and issue.forwarded_to == user:
            request.data['status'] = 'resolved'
            log_audit(user, "Issue Resolved", f"Lecturer {user.username} resolved issue '{issue.title}'.")
            
            # Email will be sent via signal
            issue_status_changed(sender=Issue, instance=issue, created=False)

            response = super().patch(request, *args, **kwargs)
            if response.status_code == 200:
                return Response({"message": "Issue resolved and notification sent."}, status=status.HTTP_200_OK)
            return response
            
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

        # Filter by status with comma-separated values
        status_param = self.request.query_params.get("statuses")
        if status_param:
            statuses = [s.strip() for s in status_param.split(",") if s.strip()]
            qs = qs.filter(status__in=statuses)

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