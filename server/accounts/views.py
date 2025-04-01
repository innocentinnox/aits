from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import (
    RegisterSerializer, ProfileUpdateSerializer, LoginSerializer, 
    CollegeSerializer, NotificationSerializer, SchoolSerializer, 
    DepartmentSerializer, CourseSerializer, CourseUnitSerializer,
    EmailSerializer
)
from .utils import log_audit
from .utils import mailer
from .models import College, Notification, School, Department, Course, CourseUnit

User = get_user_model()

# API to test if email can be sent
class SendEmailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            result = mailer.send(
                to=serializer.validated_data['to'],
                subject=serializer.validated_data['subject'],
                html=serializer.validated_data['html']
            )
            return Response({"message": result}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def serialize_obj(obj):
    """Helper function to serialize objects to include only name and id."""
    if obj:
        return {"id": obj.id, "name": obj.name, "code": obj.code}
    return None

@api_view(['GET'])
def status_view(request):
    if not request.user.is_authenticated:
        return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'college': serialize_obj(user.college),      
            'school': serialize_obj(user.school),          
            'department': serialize_obj(user.department),  
            'course': serialize_obj(user.course),  
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_image': user.profile_image.url if user.profile_image else None,
            'student_number': user.student_number,
            'registration_number': user.registration_number,
        }
    })
    

    

class CollegeView(generics.ListCreateAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [AllowAny]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        log_audit(user, "User signed up", f"User {user.email} signed up")

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        user_data = serializer.validated_data
        
        if not user_data:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        response = Response({
            "user": user_data["user"],
            "message": "Logged in successfully",
            "access": user_data["access"],
            "refresh": user_data["refresh"]
        }, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key="access_token",
            value=user_data["access"],
            httponly=True,
            secure=False,  # Set to True in production (requires HTTPS)
            samesite="Lax",
        )
        response.set_cookie(
            key="refresh_token",
            value=user_data["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
        )
        return response

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        user = serializer.save()
        log_audit(user, "Profile Updated", f"User {user.email} updated their profile.")

@api_view(['POST'])
def logout_view(request):
    user = request.user if request.user.is_authenticated else None
    if user:
        log_audit(user, "User Logged Out", f"User {user.email} logged out.")
    
    response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class TokenRefreshCookieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Try to get refresh token from the request body, then from cookies
        refresh_token = request.data.get("refresh") or request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
        except TokenError:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        response = Response({"access": new_access_token}, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=False,
            samesite="Lax"
        )
        return response

class CollegeListAPIView(generics.ListAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [IsAuthenticated]

class SchoolListAPIView(generics.ListAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        college_id = self.request.query_params.get('college_id')
        if college_id:
            return School.objects.filter(college__id=college_id)
        return School.objects.none()

class DepartmentListAPIView(generics.ListAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        school_id = self.request.query_params.get('school_id')
        if school_id:
            return Department.objects.filter(school__id=school_id)
        return Department.objects.none()

class CourseListAPIView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        department_id = self.request.query_params.get('department_id')
        school_id = self.request.query_params.get('school_id')
        college_id = self.request.query_params.get('college_id')

        if department_id or school_id or college_id:
            filters = {}
            if department_id:
                filters["department__id"] = department_id
            if school_id:
                filters["school__id"] = school_id
            if college_id:
                filters["school__college__id"] = college_id

            return Course.objects.filter(**filters)

        return Course.objects.none()

class CourseUnitesListAPIView(generics.ListAPIView):
    serializer_class = CourseUnitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        year_taken = self.request.query_params.get('year_taken')
        if course_id:
            return CourseUnit.objects.filter(course__id=course_id, year_taken=year_taken)
        return Course.objects.none()