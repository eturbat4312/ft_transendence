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
        elif action == 'friend_request':
            to_user_id = text_data_json['toUserId']
            if to_user_id in self.connected_users:
                await self.channel_layer.group_send(
                    "connected_users",
                    {
                        'type': 'friend_request',
                        'username': self.username,
                        'to_user_id': to_user_id,
                    }
                )
        elif action == 'update_friends':
            to_user_id = text_data_json['toUserId']
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'update_friends',
                    'username': self.username,
                    'to_user_id': to_user_id,
                }
            )
        elif action == 'invite_play':
            to_user_id = text_data_json['toUserId']
            user_id = text_data_json['userId']
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'invite_play',
                    'user_id': user_id,
                    'to_user_id': to_user_id,
                }
            )
        elif action == 'accept_invite':
            user_id = text_data_json['userId']
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'accept_invite',
                    'inv_user_id': self.user_id,
                    'user_id': user_id,
                }
            )
        elif action == 'refuse_invite':
            user_id = text_data_json['userId']
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'refuse_invite',
                    'username': self.username,
                    'user_id': user_id,
                }
            )
        elif action == "start_tournament":
            await self.channel_layer.group_send(
                "connected_users",
                {
                    'type': 'start_tournament',
                    'username': self.username,
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
    
    async def friend_request(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "to_user_id": event["to_user_id"],
            "action": "friend_request",
        }))

    async def update_friends(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "to_user_id": event["to_user_id"],
            "action": "update_friends",
        }))
    
    async def invite_play(self, event):
        await self.send(text_data=json.dumps({
            "user_id": event["user_id"],
            "to_user_id": event["to_user_id"],
            "action": "invite_play",
        }))

    async def accept_invite(self, event):
        await self.send(text_data=json.dumps({
            "inv_user_id": event["inv_user_id"],
            "user_id": event["user_id"],
            "action": "accept_invite",
        }))
    
    async def refuse_invite(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "user_id": event["user_id"],
            "action": "refuse_invite",
        }))

    async def start_tournament(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "start_tournament",
        }))