from django.urls import path, include, re_path
from . import views
from .views import LoginView, LogoutView, GetUsernameView, GetUserIdView, GetUsernameFromIdView, VerifyTokenView
from .views import SendFriendRequestView, FriendRequestsView, RespondFriendRequestView, GetFriendsView, RemoveFriendView
from .views import GetMessageHistoryView, SendMessageView, CreateTournamentView, CheckTournamentView, DeleteTournamentView
from .views import BlockUserView, RemoveBlockedUserView, GetBlockedUserView, GetEloView, UpdateEloView, PlayerStatsView
from .views import PostMatchView
from rest_framework.routers import DefaultRouter

# from .views import UserViewSet

router = DefaultRouter()
# router.register(r"users", UserViewSet)

urlpatterns = [
    # path("", views.home, name="home"),
    path('api/login/', LoginView.as_view(), name='user-login'),
    path('api/logout/', LogoutView.as_view(), name='user-logout'),
    path('api/verify_token/', VerifyTokenView.as_view(), name='verify-token'),
    re_path('api/register/', views.register),
    path('api/get_username/', GetUsernameView.as_view(), name='get-username'),
    path('api/get_user_id/', GetUserIdView.as_view(), name='get-user-id'),
    path('api/get_username_from_id/<int:user_id>/', GetUsernameFromIdView.as_view(), name='get-user-from-id'),
    path("", include(router.urls)),
    path('api/send_friend_request/<int:to_user_id>/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('api/friend_requests/', FriendRequestsView.as_view(), name='friend-requests'),
    path('api/respond_friend_request/<int:from_user_id>/', RespondFriendRequestView.as_view(), name='respond-friend-request'),
    path('api/remove_friend/<int:friend_id>/', RemoveFriendView.as_view(), name='remove-friend'),
    path('api/get_friends/', GetFriendsView.as_view(), name='get-friends'),
    path('api/get_message_history/<int:other_user_id>/', GetMessageHistoryView.as_view(), name='get-message-history'),
    path('api/send_message/<int:receiver_id>/', SendMessageView.as_view(), name='send-message'),
    path('api/create_tournament/', CreateTournamentView.as_view(), name='create-tournament'),
    path('api/check_tournament/', CheckTournamentView.as_view(), name='check-tournament'),
    path('api/delete_tournament/', DeleteTournamentView.as_view(), name='delete-tournament'),
    path('api/block_user/<int:user_id>/', BlockUserView.as_view(), name='block-user'),
    path('api/remove_blocked/<int:blocked_id>/', RemoveBlockedUserView.as_view(), name='remove-blocked'),
    path('api/get_blocked/', GetBlockedUserView.as_view(), name='get-blocked'),
    path('api/get_elo/', GetEloView.as_view(), name='get-elo'),
    path('api/update_elo/', UpdateEloView.as_view(), name='update-elo'),
    path('api/player_stats/<int:user_id>', PlayerStatsView.as_view(), name='player-stats'),
    path('api/post_match/', PostMatchView.as_view(), name='post-match'),

]