# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_group_name = 'game_room'
        # Rejoindre le groupe
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'move_paddle':
            await self.move_player(text_data_json)

    # Vous pouvez ajouter des méthodes dans GameConsumer ou créer des classes séparées
    async def move_player(self, data):
        position = data['position']
        message = {'action': 'update_position', 'position': position}

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'game_message',
                'message': message
            }
        )

    async def game_message(self, event):
        message = event['message']

        # Envoie le message à WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
