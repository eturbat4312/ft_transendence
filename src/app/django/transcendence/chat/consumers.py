import json, logging
from channels.generic.websocket import AsyncWebsocketConsumer

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("chat", self.channel_name)
        logging.info("Chat WebSocket connection established.")
        await self.accept()

    async def disconnect(self, close_code):
        logging.info("Chat WebSocket connection closed.")
        await self.channel_layer.group_discard("chat", self.channel_name)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'client_message':
            await self.channel_layer.group_send(
                "chat",
                {
                    'type': 'transmitMessage',
                    'message_data': text_data_json['message_data']
                }
            )

    async def transmitMessage(self, event):
        message_data = event['message_data']
        await self.send(text_data=json.dumps({
            'action': 'print_message',
            'message_data': message_data
    }))