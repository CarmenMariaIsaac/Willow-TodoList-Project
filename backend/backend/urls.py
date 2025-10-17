"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),          # For our tasks app
    path('auth/', include('djoser.urls')),          # For user registration etc.
    path('auth/', include('djoser.urls.jwt')),    # For login (JWT creation)
]