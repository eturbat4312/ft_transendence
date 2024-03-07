from channels.generic.websocket import AsyncWebsocketConsumer
import json, logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ConnectConsumer(AsyncWebsocketConsumer):
    connected_users = set()
    
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if self.username:
            self.connected_users.remove(self.username)
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'user_disconnected',
                    'username': self.username,
                }
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'connect':
            self.username = text_data_json['username']
            self.connected_users.add(self.username)
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'user_connected',
                    'username': self.username,
                }
            )
            for user in self.connected_users:
                if user != self.username:
                    await self.send(text_data=json.dumps({
                        'action': 'connected',
                        'username': user,
                    }))

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "connected",
        }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "disconnected",
        }))