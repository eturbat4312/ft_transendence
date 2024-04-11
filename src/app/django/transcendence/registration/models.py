# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    friends = models.ManyToManyField('self', symmetrical=False, related_name='friends_list')
    blocked = models.ManyToManyField('self', symmetrical=False, related_name='blocked_list')
    custom_field = models.CharField(max_length=255)
    profil_pic = models.ImageField(upload_to="profil_pic", null=True, blank=True)
    elo = models.IntegerField(default=0, blank=True, null=True)
    

    def __str__(self):
        return self.username
    
    def total_matches(self):
        return self.player.count()

    def count_won_matches(self):
        return self.won_matches.all().count()

    def lost_matches(self):
        return self.total_matches() - self.count_won_matches()

    class Meta:
        # Add the following line to resolve the related_name conflict
        swappable = "AUTH_USER_MODEL"

class Match(models.Model):
    player = models.ForeignKey(User, related_name='player', on_delete=models.CASCADE)
    opponent = models.ForeignKey(User, related_name='opponent', on_delete=models.CASCADE)
    player_score = models.IntegerField()
    opponent_score = models.IntegerField()
    winner = models.ForeignKey(User, related_name='won_matches', on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.content}"

class Tournament(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tournament created by {self.creator.username}"