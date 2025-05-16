from django.test import TestCase
from rest_framework.test import APIClient, APILiveServerTestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.core import mail
from issue_tracker.models import College, School, Department, Course, CourseUnit, Notification
from issue_tracker.serializers import CollegeSerializer
from rest_framework.authtoken.models import Token
import jwt
from django.conf import settings
from django.urls import reverse

class AITSTestCase(APILiveServerTestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='test@example.com')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.college = College.objects.create(name='Engineering')
        self.school = School.objects.create(name='Computer Science', college=self.college)
        self.department = Department.objects.create(name='Software Engineering', school=self.school)
        self.course = Course.objects.create(name='BSc Software Engineering', department=self.department)
        self.course_unit = CourseUnit.objects.create(name='Web Development', course=self.course)
        self.notification = Notification.objects.create(user=self.user, message='Test notification')