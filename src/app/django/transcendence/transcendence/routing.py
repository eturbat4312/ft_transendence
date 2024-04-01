from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import game.routing as game_routing
import chat.routing as chat_routing
import connect.routing as connect_routing


application = ProtocolTypeRouter(
    {
        "websocket": AuthMiddlewareStack(
            URLRouter(
                [
                    game_routing.websocket_urlpatterns,
                    chat_routing.websocket_urlpatterns,
                    connect_routing.websocket_urlpatterns,
                ]
            )
        )
    }
)
