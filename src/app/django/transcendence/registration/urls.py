from django.urls import path, include, re_path
from . import views
from .views import (
    LoginView,
    LogoutView,
    GetUsernameView,
    VerifyTokenView,
)
from rest_framework.routers import DefaultRouter
from .views import save_game_result
from django.conf import settings
from django.conf.urls.static import static

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    path("api/login/", LoginView.as_view(), name="user-login"),
    path("api/logout/", LogoutView.as_view(), name="user-logout"),
    path("api/verify-token/", VerifyTokenView.as_view(), name="verify-token"),
    re_path("register/", views.register),
    path("api/get_username/", GetUsernameView.as_view(), name="get-username"),
    path("save_game_result/", save_game_result, name="save-game-result"),
    path("", include(router.urls)),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
