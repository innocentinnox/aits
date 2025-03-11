from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('issues.urls')),
]