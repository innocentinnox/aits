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

