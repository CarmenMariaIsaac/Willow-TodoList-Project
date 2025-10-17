# tasks/serializers.py

from rest_framework import serializers
from .models import Task, UserProfile, DailyNote, FocusItem, ScheduleEvent # CORRECTED IMPORT
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('xp', 'level', 'current_streak')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'profile')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'due_date', 'priority', 'created_at', 'start_time', 'end_time']
        read_only_fields = ('user',)

class DailyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyNote
        fields = ['id', 'date', 'content']
        read_only_fields = ('owner',)

class FocusItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FocusItem
        fields = ['id', 'date', 'text']
        read_only_fields = ('owner',)

class ScheduleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleEvent
        fields = ['id', 'date', 'start_time', 'end_time', 'title']
        read_only_fields = ('owner',)