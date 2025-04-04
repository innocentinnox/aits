# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.root_page, name='root_page'),
]