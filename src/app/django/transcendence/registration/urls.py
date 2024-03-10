from django.urls import path, include, re_path
from . import views
from .views import LoginView, LogoutView, GetUsernameView, GetUserIdView, VerifyTokenView, send_friend_request
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
    path('api/get_user_id/', GetUserIdView.as_view(), name='get-user-id'),
    path("", include(router.urls)),
    path('send_friend_request/<int:to_user_id>/', send_friend_request, name='send_friend_request'),
]
