from django.urls import path, include, re_path
from . import views
from rest_framework.routers import DefaultRouter

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    re_path("login/", views.login),
    re_path("register/", views.register),
    re_path("test_token/", views.test_token),
    path("", include(router.urls)),
]
