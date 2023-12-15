from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register.html', views.register, name='register'),
    path('game.html', views.game, name='game'),
]