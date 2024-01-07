# Generated by Django 5.0 on 2023-12-26 15:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('score', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('score', models.IntegerField()),
                ('is_won', models.BooleanField(default=False)),
                ('played_at', models.DateTimeField(auto_now_add=True)),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='avatar_images')),
                ('played_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
