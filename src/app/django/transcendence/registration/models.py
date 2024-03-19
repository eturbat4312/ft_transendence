# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Add your additional fields here
    custom_field = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to="avatars", null=True, blank=True)

    def __str__(self):
        return self.username

    class Meta:
        # Add the following line to resolve the related_name conflict
        swappable = "AUTH_USER_MODEL"


class GameResult(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField()
    won = models.BooleanField()
