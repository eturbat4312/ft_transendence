# Generated by Django 4.2.8 on 2024-03-06 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0003_remove_user_avatar_alter_user_custom_field'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=100)),
                ('score', models.IntegerField()),
                ('won', models.BooleanField()),
            ],
        ),
    ]