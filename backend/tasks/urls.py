from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, DailyNoteViewSet, FocusItemViewSet, ScheduleEventViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'notes', DailyNoteViewSet, basename='dailynote')
router.register(r'focus-items', FocusItemViewSet, basename='focusitem')
router.register(r'schedule-events', ScheduleEventViewSet, basename='scheduleevent')

urlpatterns = [
    path('', include(router.urls)),
]