from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from . import consumers

websocket_urlpatterns = [
    path("api/ws/game/", consumers.GameConsumer.as_asgi()),
    path("api/ws/matchmaking/", consumers.MatchmakingConsumer.as_asgi()),
    path("api/ws/tournament/", consumers.TournamentConsumer.as_asgi()),
    path("api/ws/matchmaking2/", consumers.Matchmaking2Consumer.as_asgi()),
    path("api/ws/game2/", consumers.Game2Consumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
