from channels.generic.websocket import AsyncWebsocketConsumer
import json, logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ConnectConsumer(AsyncWebsocketConsumer):
    connected_users = {}
    username = None
    user_id = None

    async def connect(self):
        await self.accept()
        for existing_user_id, user_info in self.connected_users.items():
            if existing_user_id != self.user_id:
                await self.send(text_data=json.dumps({
                    'action': 'connected',
                    'username': user_info['username'],
                    'userId': existing_user_id,
                }))

    async def disconnect(self, close_code):
        if self.username:
            del self.connected_users[self.user_id]
            await self.channel_layer.group_discard("connected_users", self.channel_name)
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
            self.user_id = text_data_json['userId']
            if self.user_id in self.connected_users:
                logging.debug(f"User {self.username} is already connected. Closing the new connection.")
                await self.send_error("You are already connected from another window or browser.")
                self.username = None
                self.user_id = None
                await self.close()
            else:
                await self.channel_layer.group_add("connected_users", self.channel_name)
                self.connected_users[self.user_id] = {'username': self.username}
                await self.channel_layer.group_send(
                    "connected_users",
                    {
                        'type': 'user_connected',
                        'username': self.username,
                        'userId': self.user_id,
                    }
                )

    async def user_connected(self, event):
        if self.username != event["username"]:
            await self.send(text_data=json.dumps({
                "username": event["username"],
                "action": "connected",
                "userId": event["userId"],
            }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "disconnected",
        }))

    async def send_error(self, message):
        await self.send(text_data=json.dumps({
            "action": "error",
            "message": message,
        }))