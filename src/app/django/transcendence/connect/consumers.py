from channels.generic.websocket import AsyncWebsocketConsumer
import json, logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ConnectConsumer(AsyncWebsocketConsumer):
    username = None
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if self.username:
            await self.channel_layer.group_discard("connected_users", self.channel_name)
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'disconnected',
                    'username': self.username
                }
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'connect':
            self.username = text_data_json['username']
            await self.channel_layer.group_add("connected_users", self.channel_name)
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'connected',
                    'username': self.username
                }
        )

    async def connected(self, event):
        if self.username != event["username"]:
            await self.send(text_data=json.dumps({
                "username": event["username"],
                "action": "connected",
            }))

    async def disconnected(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "disconnected",
        }))
