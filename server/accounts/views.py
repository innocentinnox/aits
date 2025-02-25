from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, ProfileUpdateSerializer, LoginSerializer, CollegeSerializer, NotificationSerializer
from .utils import log_audit
from .models import College, Notification

User = get_user_model()

@api_view(['GET'])
def status_view(request):
    if not request.user.is_authenticated:
        return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'role': request.user.role
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
        
        response = Response({"user": user_data["user"], "message": "Logged in successfully"}, status=status.HTTP_200_OK)
        # Set JWT tokens in HTTP-only cookies
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
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)