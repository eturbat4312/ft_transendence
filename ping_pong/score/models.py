from django.db import models
from django.contrib.auth.models import User


class Score(models.Model):
    name = models.CharField(max_length=255)
    # score = models.IntegerField()

    def __str__(self):
        return self.name


class Game(models.Model):
    name = models.CharField(max_length=255)
    score = models.IntegerField()
    is_won = models.BooleanField(default=False)
    played_at = models.DateTimeField(auto_now_add=True)
    played_by = models.ForeignKey(User, related_name="game", on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatar_images", blank=True, null=True)


# Create your models here.
