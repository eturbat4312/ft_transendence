import json, logging
from channels.generic.websocket import AsyncWebsocketConsumer

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class ChatConsumer(AsyncWebsocketConsumer):
    clientname =  None
    async def connect(self):
        await self.accept()
        logging.info("Chat WebSocket connection established.")

    async def disconnect(self, close_code):
        logging.info("Chat WebSocket connection closed.")
        if self.clientname:
            await self.channel_layer.group_discard("chat", self.channel_name)
            await self.channel_layer.group_send(
                "chat",
                {
                    'type': 'leftMessage',
                    'name_data': self.clientname
                }
            )
            logging.info(f"User '{self.clientname}' has left the chat.")
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'join_chat':
            self.clientname = text_data_json['clientName']
            await self.channel_layer.group_add("chat", self.channel_name)
            logging.info(f"User '{self.clientname}' connected to chat.")
            await self.channel_layer.group_send(
                "chat",
                {
                    'type': 'joinMessage',
                    'name_data': self.clientname
                }
        )
        elif action == 'client_message':
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

    async def joinMessage(self, event):
        username = event['name_data']
        await self.send(text_data=json.dumps({
            'action': 'join_chat',
            'name_data': username
    }))

    async def leftMessage(self, event):
        username = event['name_data']
        await self.send(text_data=json.dumps({
            'action': 'left_chat',
            'name_data': username
    }))