import json, logging, asyncio, secrets
from channels.generic.websocket import AsyncWebsocketConsumer

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logging.info("Game WebSocket connection established.")
        await self.accept()

    async def disconnect(self, close_code):
        logging.info("WebSocket connection closed.")
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        #print("Received: ", data)
        action = text_data_json['action']

        if action == 'update_ball_position':
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'update_ball_position',
                    'ball_data': text_data_json['ball_data']
                }
            )
        if action == 'start_game':
            game_id = text_data_json['game_id']
            logging.info(game_id)
            if game_id:
                self.game_group_name = f'game_{game_id}'
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
            else:
                logging.error("No game_id provided. Closing connection.")
                await self.close()
            await self.startGame()
        if action == "update_score":
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'update_score',
                    'score_data': text_data_json['score_data']
                }
            )
        if action == "update_paddle1_position":
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'update_paddle1_position',
                    'paddle_data': text_data_json['paddle_data']
                }
            )
        if action == "update_paddle2_position":
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'update_paddle2_position',
                    'paddle_data': text_data_json['paddle_data']
                }
            )

    async def startGame(self):
        await self.send(text_data=json.dumps({"action": "start_game"}))


    async def update_score(self, event):
        score_data = event['score_data']
        await self.send(text_data=json.dumps({
            'action': 'update_score',
            'score_data': score_data
    }))

    async def update_ball_position(self, event):
        ball_data = event['ball_data']
        await self.send(text_data=json.dumps({
            'action': 'update_ball_position',
            'ball_data': ball_data
    }))

    async def update_paddle1_position(self, event):
        paddle_data = event['paddle_data']
        await self.send(text_data=json.dumps({
            'action': 'update_paddle1_position',
            'paddle_data': paddle_data
    }))

    async def update_paddle2_position(self, event):
        paddle_data = event['paddle_data']
        await self.send(text_data=json.dumps({
            'action': 'update_paddle2_position',
            'paddle_data': paddle_data
    }))

    async def game_message(self, event):
        message = event['message']

        # Envoie le message à WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

class MatchmakingConsumer(AsyncWebsocketConsumer):
    ball_master = None
    waiting_players = []

    async def connect(self):
        await self.channel_layer.group_add("matchmaking", self.channel_name)
        await self.accept()
        self.waiting_players.append(self.channel_name)
        if len(self.waiting_players) >= 2:
            player1_channel = self.waiting_players.pop(0)
            player2_channel = self.waiting_players.pop(0)
            game_id = self.generate_game_id()
            game_group_name = f"game_{game_id}"
            await self.channel_layer.group_add(game_group_name, player1_channel)
            await self.channel_layer.group_add(game_group_name, player2_channel)
            await self.channel_layer.group_send(game_group_name, {"type": "match_found", "game_id": game_id})

    async def disconnect(self, close_code):
        if self.channel_name in self.waiting_players:
            self.waiting_players.remove(self.channel_name)
        await self.channel_layer.group_discard("matchmaking", self.channel_name)

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     print("Received: ", data)
    #     if MatchmakingConsumer.ball_master is None:
    #         MatchmakingConsumer.ball_master = self.channel_name
    #         await self.channel_layer.send(self.channel_name, {"type": "join_matchmaking", "is_master": True})
    #     else:
    #         await self.channel_layer.send(self.channel_name, {"type": "join_matchmaking", "is_master": False})
    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received: ", data)
        if len(self.channel_layer.groups.get("matchmaking", [])) == 1:
            await self.channel_layer.send(self.channel_name, {"type": "ball_master", "is_master": True})
        else:
            await self.channel_layer.send(self.channel_name, {"type": "ball_master", "is_master": False})

    async def ball_master(self, event):
        is_master = event["is_master"]
        await self.channel_layer.group_add("matchmaking_queue", self.channel_name)
        await self.send(text_data=json.dumps({"action": "ball_master", "is_master": is_master}))
        if len(self.channel_layer.groups.get("matchmaking_queue", [])) >= 2:
            await self.channel_layer.group_send("matchmaking_queue", {"type": "match_found"})
    # async def join_matchmaking(self, event):
    #     await self.channel_layer.group_add("matchmaking_queue", self.channel_name)
    #     await self.send(text_data=json.dumps({"action": "ball_master", "is_master": event["is_master"]}))
    #     if len(self.channel_layer.groups.get("matchmaking_queue", [])) >= 2:
    #         await self.channel_layer.group_send("matchmaking_queue", {"type": "match_found"})


    @classmethod
    def generate_game_id(cls):
        return secrets.token_urlsafe(8)

    async def match_found(self, event):
        game_id = event.get("game_id")
        if game_id:
            game_group_name = f"game_{game_id}"
            await self.send(text_data=json.dumps({"action": "match_found", "game_id": game_id}))
            await self.channel_layer.group_discard("matchmaking_queue", self.channel_name)
            await self.channel_layer.group_add(game_group_name, self.channel_name)
        else:
            logging.error("Aucun game_id trouvé dans l'événement match_found.")