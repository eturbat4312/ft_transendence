from django.urls import path, include, re_path
from . import views
from .views import LoginView, LogoutView, GetUsernameView, GetUserIdView, GetUsernameFromIdView, VerifyTokenView, SendFriendRequestView, FriendRequestsView, HandleFriendRequestView
from rest_framework.routers import DefaultRouter

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    path('api/login/', LoginView.as_view(), name='user-login'),
    path('api/logout/', LogoutView.as_view(), name='user-logout'),
    path('api/verify_token/', VerifyTokenView.as_view(), name='verify-token'),
    re_path("register/", views.register),
    path('api/get_username/', GetUsernameView.as_view(), name='get-username'),
    path('api/get_user_id/', GetUserIdView.as_view(), name='get-user-id'),
    path('api/get_username_from_id/<int:user_id>/', GetUsernameFromIdView.as_view(), name='get-user-from-id'),
    path("", include(router.urls)),
    path('api/send_friend_request/<int:to_user_id>/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('api/friend_requests/', FriendRequestsView.as_view(), name='friend-requests'),
    path('api/handle_friends_requests/<int:friend_request_id>/', HandleFriendRequestView.as_view(), name='handle-friend-requests'),
]
