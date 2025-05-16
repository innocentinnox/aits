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


    def test_college_serializer(self):
        # Test 1: CollegeSerializer serialization/deserialization
        college = College.objects.create(name='Science')
        serializer = CollegeSerializer(college)
        self.assertEqual(serializer.data['name'], 'Science')
        data = {'name': 'Arts'}
        serializer = CollegeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        college = serializer.save()
        self.assertEqual(college.name, 'Arts')

    def test_college_list_api(self):
        # Test 2: CollegeListAPIView returns colleges
        response = self.client.get('/api/colleges/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Engineering')

    def test_school_list_api(self):
        # Test 3: SchoolListAPIView returns schools
        response = self.client.get('/api/schools/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Computer Science')

    def test_department_list_api(self):
        # Test 4: DepartmentListAPIView returns departments
        response = self.client.get('/api/departments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Software Engineering')

    def test_course_list_api(self):
        # Test 5: CourseListAPIView returns courses
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'BSc Software Engineering')

    def test_course_unit_list_api(self):
        # Test 6: CourseUnitesListAPIView returns course units
        response = self.client.get('/api/course-units/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Web Development')

    def test_send_email_api(self):
        # Test 7: SendEmailAPIView sends an email
        data = {'to': 'test@example.com', 'subject': 'Test', 'body': 'Hello'}
        response = self.client.post('/api/send-email/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Test')




