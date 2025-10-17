from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Task, DailyNote, FocusItem, ScheduleEvent # Make sure ScheduleEvent is imported
from .serializers import TaskSerializer, DailyNoteSerializer, FocusItemSerializer, ScheduleEventSerializer # Make sure ScheduleEventSerializer is imported

# Helper function for calculating XP needed for the next level
def xp_for_next_level(level):
    return int(100 * (level ** 1.5))

class TaskViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing task instances.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all tasks for the currently authenticated user.
        It can also be filtered by due_date.
        """
        queryset = self.request.user.tasks.all()
        due_date = self.request.query_params.get('due_date')
        if due_date:
            queryset = queryset.filter(due_date=due_date)
        return queryset

    def perform_create(self, serializer):
        """
        Assign the current user to the task when it is created.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        """
        Marks a task as complete and applies gamification logic.
        """
        task = self.get_object()
        if task.completed:
            return Response({'status': 'task already completed'}, status=status.HTTP_400_BAD_REQUEST)

        task.completed = True
        task.save()

        # --- Gamification Logic ---
        profile = request.user.profile
        xp_earned = 10 

        if task.priority == 'H':
            xp_earned += 5
        if task.due_date and date.today() <= task.due_date:
            xp_earned += 10
        
        profile.xp += xp_earned

        # --- Streak Logic ---
        today = date.today()
        if profile.last_completion_date:
            if today == profile.last_completion_date + timedelta(days=1):
                profile.current_streak += 1
            elif today > profile.last_completion_date + timedelta(days=1):
                profile.current_streak = 1
        else:
            profile.current_streak = 1
        
        profile.last_completion_date = today

        # --- Level Up Logic ---
        leveled_up = False
        xp_needed = xp_for_next_level(profile.level)
        while profile.xp >= xp_needed:
            profile.level += 1
            leveled_up = True
            xp_needed = xp_for_next_level(profile.level)

        profile.save()

        return Response({
            'status': 'task completed',
            'xp_earned': xp_earned,
            'current_xp': profile.xp,
            'current_streak': profile.current_streak,
            'leveled_up': leveled_up,
            'new_level': profile.level if leveled_up else None
        })

class DailyNoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the user's note for the current day.
    """
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notes.filter(date=date.today())

    def perform_create(self, serializer):
        note, created = DailyNote.objects.update_or_create(
            owner=self.request.user,
            date=date.today(),
            defaults={'content': serializer.validated_data.get('content')}
        )
        serializer.instance = note

class FocusItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the user's focus items for the current day.
    """
    serializer_class = FocusItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.focus_items.filter(date=date.today())

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, date=date.today())

# ✔️ FIX IS HERE: Add the missing ScheduleEventViewSet
class ScheduleEventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the user's schedule events for the current day.
    """
    serializer_class = ScheduleEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.schedule_events.filter(date=date.today())

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, date=date.today())