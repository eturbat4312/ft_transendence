from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    # path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
    path("", include(router.urls)),
]
