from channels.generic.websocket import AsyncWebsocketConsumer
import json, logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ConnectConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("connected_users", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        logging.info(data['username'])
        if 'username' in data:
            username = data['username']
            print(f"Received username: {username}")

        else:
            print("Message does not contain username.")

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
