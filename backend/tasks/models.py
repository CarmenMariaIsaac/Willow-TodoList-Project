from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import date

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('L', 'Low'),
        ('M', 'Medium'),
        ('H', 'High'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks", null=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='M')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # New fields for timed events
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['completed', '-created_at']

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    current_streak = models.IntegerField(default=0)
    last_completion_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()

class DailyNote(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    date = models.DateField(default=timezone.now)
    content = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('owner', 'date')

    def __str__(self):
        return f"Note for {self.owner.username} on {self.date}"

class FocusItem(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='focus_items')
    date = models.DateField(default=timezone.now)
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text

class ScheduleEvent(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedule_events')
    date = models.DateField(default=timezone.now)
    start_time = models.TimeField()
    end_time = models.TimeField(blank=True, null=True)
    title = models.CharField(max_length=200)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.title} at {self.start_time}"