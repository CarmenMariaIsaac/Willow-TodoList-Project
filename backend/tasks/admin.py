from django.contrib import admin
from .models import Task, UserProfile, DailyNote, FocusItem # Import new models

# Register your models here.
admin.site.register(Task)
admin.site.register(UserProfile)
admin.site.register(DailyNote)
admin.site.register(FocusItem)