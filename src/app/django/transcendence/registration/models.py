# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Add your additional fields here
    custom_field = models.CharField(max_length=255)

    def __str__(self):
        return self.username

    class Meta:
        # Add the following line to resolve the related_name conflict
        swappable = "AUTH_USER_MODEL"

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)