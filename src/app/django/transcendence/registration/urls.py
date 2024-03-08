from django.urls import path, include, re_path
from . import views
from .views import LoginView, LogoutView, GetUsernameView, VerifyTokenView
from rest_framework.routers import DefaultRouter

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    path('api/login/', LoginView.as_view(), name='user-login'),
    path('api/logout/', LogoutView.as_view(), name='user-logout'),
    path('api/verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    re_path("register/", views.register),
    path('api/get_username/', GetUsernameView.as_view(), name='get-username'),
    path("", include(router.urls)),
]
