# Generated by Django 4.2.8 on 2024-03-15 17:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0005_friendship'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='friends',
            field=models.ManyToManyField(related_name='friends_list', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Friendship',
        ),
    ]
