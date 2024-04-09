import json, logging, asyncio, secrets
from channels.generic.websocket import AsyncWebsocketConsumer

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class GameConsumer(AsyncWebsocketConsumer):
    username = None
    async def connect(self):
        logging.info("Game WebSocket connection established %s.",self)
        await self.accept()

    async def disconnect(self, close_code):
        logging.info("WebSocket connection closed.")
        await self.channel_layer.group_send(self.game_group_name,{ 'type': 'player_disconnected', 'username': self.username,})
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
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
            self.username = text_data_json['username']
            logging.info(game_id)
            if game_id:
                self.game_group_name = f'game_{game_id}'
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
            else:
                logging.error("No game_id provided. Closing connection.")
                await self.close()
            await self.start_game()

        if action == "private":
            game_id = text_data_json['game_id']
            if game_id:
                self.game_group_name = f'game_{game_id}'
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                groups = self.channel_layer.groups
                num_players = len(groups.get(self.game_group_name, []))
                if num_players == 2:
                    await self.channel_layer.group_send(self.game_group_name, { 'type': 'private_game' })

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

    async def start_game(self):
        await self.send(text_data=json.dumps({"action": "start_game"}))

    async def private_game(self, event):
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

    async def player_disconnected(self, event):
        logging.info("playerDisconnected method")
        await self.send(text_data=json.dumps({
        'action': 'player_disconnected',
        'username': event['username']
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
            await self.channusernameel_layer.group_add(game_group_name, self.channel_name)
        else:
            logging.error("Aucun game_id trouvé dans l'événement match_found.")

class TournamentConsumer(AsyncWebsocketConsumer):
    tournament_users = {}
    username = None
    user_id = None

    async def connect(self):
        if len(self.tournament_users) >= 4:
            await self.accept()
            await self.send(text_data=json.dumps({
                    'action': 'tournament_full',
                }))
            await self.close()
        else:
            await self.accept()
            await self.send(text_data=json.dumps({
                    'action': 'not_full',
                }))
            for existing_user_id, user_info in self.tournament_users.items():
            #  if existing_user_id != self.user_id:
                await self.send(text_data=json.dumps({
                    'action': 'player_list',
                    'username': user_info['username'],
                    'userId': existing_user_id,
                }))

    async def disconnect(self, close_code):
        if self.username:
            print(self.username + f" disconnected et len:{len(self.tournament_users)}")
            if len(self.tournament_users) == 4:
                await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'tournament_not_ready',
                }
            )
            del self.tournament_users[self.user_id]
            await self.channel_layer.group_discard("tournament_users", self.channel_name)
            await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'tournament_leave',
                    'username': self.username,
                }
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'join':
            self.username = text_data_json['username']
            self.user_id = text_data_json['userId']
            await self.channel_layer.group_add("tournament_users", self.channel_name)
            self.tournament_users[self.user_id] = {'username': self.username}
            await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'tournament_join',
                    'username': self.username,
                    'userId': self.user_id,
                }
            )
            if len(self.tournament_users) == 4:
                await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'tournament_ready',
                }
            )
        elif action == 'start_tournament':
                await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'start_tournament',
                }
            )
        elif action == 'game_ready':
                await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'game_ready',
                    'player': text_data_json['player'],
                }
            )
        elif action == 'result':
            await self.channel_layer.group_send(
                "tournament_users",
                {
                    'type': 'result',
                    'winner': text_data_json['winner'],
                }
            )


    async def tournament_join(self, event):
       # if self.username != event["username"]:
            await self.send(text_data=json.dumps({
                "username": event["username"],
                "action": "player_list",
                "userId": event["userId"],
            }))
    
    async def tournament_leave(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "action": "leave",
        }))

    async def tournament_ready(self, event):
        await self.send(text_data=json.dumps({
            "action": "ready",
        }))
    
    async def tournament_not_ready(self, event):
        await self.send(text_data=json.dumps({
            "action": "not_ready",
        }))
    
    async def start_tournament(self, event):
        await self.send(text_data=json.dumps({
            "action": "start_tournament",
        }))

    async def game_ready(self, event):
        await self.send(text_data=json.dumps({
            "action": "game_ready",
            "player": event["player"],
        }))
    
    async def result(self, event):
        await self.send(text_data=json.dumps({
            "action": "result",
            "winner": event["winner"],
        }))

class MatchmakingBronzeConsumer(AsyncWebsocketConsumer):
    waiting_players = []

    async def connect(self):
        await self.channel_layer.group_add("matchmaking2", self.channel_name)
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
        await self.channel_layer.group_discard("matchmaking2", self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received: ", data)
        if len(self.channel_layer.groups.get("matchmaking2", [])) == 1:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": True})
        else:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": False})

    async def player(self, event):
        player1 = event["player1"]
        await self.channel_layer.group_add("matchmaking_queue", self.channel_name)
        await self.send(text_data=json.dumps({"action": "player", "player1": player1}))
        if len(self.channel_layer.groups.get("matchmaking_queue", [])) >= 2:
            await self.channel_layer.group_send("matchmaking_queue", {"type": "match_found"})


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

class MatchmakingSilverConsumer(AsyncWebsocketConsumer):
    waiting_players = []

    async def connect(self):
        await self.channel_layer.group_add("matchmaking2", self.channel_name)
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
        await self.channel_layer.group_discard("matchmaking2", self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received: ", data)
        if len(self.channel_layer.groups.get("matchmaking2", [])) == 1:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": True})
        else:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": False})

    async def player(self, event):
        player1 = event["player1"]
        await self.channel_layer.group_add("matchmaking_queue", self.channel_name)
        await self.send(text_data=json.dumps({"action": "player", "player1": player1}))
        if len(self.channel_layer.groups.get("matchmaking_queue", [])) >= 2:
            await self.channel_layer.group_send("matchmaking_queue", {"type": "match_found"})


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

class MatchmakingGoldConsumer(AsyncWebsocketConsumer):
    waiting_players = []

    async def connect(self):
        await self.channel_layer.group_add("matchmaking2", self.channel_name)
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
        await self.channel_layer.group_discard("matchmaking2", self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received: ", data)
        if len(self.channel_layer.groups.get("matchmaking2", [])) == 1:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": True})
        else:
            await self.channel_layer.send(self.channel_name, {"type": "player", "player1": False})

    async def player(self, event):
        player1 = event["player1"]
        await self.channel_layer.group_add("matchmaking_queue", self.channel_name)
        await self.send(text_data=json.dumps({"action": "player", "player1": player1}))
        if len(self.channel_layer.groups.get("matchmaking_queue", [])) >= 2:
            await self.channel_layer.group_send("matchmaking_queue", {"type": "match_found"})


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

class Game2Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        logging.info("Game WebSocket connection established %s.",self)
        await self.accept()

    async def disconnect(self, close_code):
        logging.info("WebSocket connection closed.")
        await self.channel_layer.group_send(self.game_group_name, { 'type': 'player_disconnected'})
        await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']

        if action == 'start_game':
            game_id = text_data_json['game_id']
            username = text_data_json['username']
            if game_id:
                self.game_group_name = f'game_{game_id}'
                await self.channel_layer.group_add(self.game_group_name, self.channel_name)
                await self.init_game()

            else:
                logging.error("No game_id provided. Closing connection.")
                await self.close()

        if action == 'move':
            x = text_data_json['x']
            y = text_data_json['y']
            player_id = text_data_json['player_id']
            await self.make_move(x, y, player_id)
        elif action == 'send_move':
            x = text_data_json['x']
            y = text_data_json['y']
            player_id = text_data_json['player_id']
            await self.channel_layer.group_send(self.game_group_name, { 
                'type': 'player_move',
                'x' : x,
                'y' : y,
                'player_id' : player_id,
            })
        elif action == 'send_username':
            username = text_data_json['username']
            await self.channel_layer.group_send(self.game_group_name, { 
                'type': 'send_username',
                'username' : username,
            })

    async def init_game(self):
        self.game_state = {
            'board': [['' for _ in range(3)] for _ in range(3)],
            'turn': 1,
            'winner': None,
            'game_over': False
        }

    async def make_move(self, x, y, player_id):
        if not self.game_state['game_over'] and self.is_valid_move(x, y):
            self.game_state['board'][x][y] = player_id
            self.game_state['turn'] = 2 if self.game_state['turn'] == 1 else 1
            winner = self.check_winner()
            if winner:
                self.game_state['winner'] = winner
                self.game_state['game_over'] = True
            await self.channel_layer.group_send(self.game_group_name, {
                'type': 'update_board',
                'board': self.game_state['board'],
                'game_over': self.game_state['game_over'],
                'winner': self.game_state['winner']
            })
        else:
            await self.send(text_data=json.dumps({
                'action': 'invalid_move'
            }))

    def is_valid_move(self, x, y):
        return self.game_state['board'][x][y] == ''

    def check_winner(self):
        for row in self.game_state['board']:
            if row[0] == row[1] == row[2] and row[0] != '':
                return row[0]
        
        for col in range(3):
            if self.game_state['board'][0][col] == self.game_state['board'][1][col] == self.game_state['board'][2][col] and self.game_state['board'][0][col] != '':
                return self.game_state['board'][0][col]
        
        if self.game_state['board'][0][0] == self.game_state['board'][1][1] == self.game_state['board'][2][2] and self.game_state['board'][0][0] != '':
            return self.game_state['board'][0][0]
        if self.game_state['board'][0][2] == self.game_state['board'][1][1] == self.game_state['board'][2][0] and self.game_state['board'][0][2] != '':
            return self.game_state['board'][0][2]
        
        if all(cell != '' for row in self.game_state['board'] for cell in row):
            return 'draw'

        return None

    async def update_board(self, event):
        await self.send(text_data=json.dumps({
            'action': 'update_board',
            'board': event['board'],
            'game_over': event['game_over'],
            'winner': event['winner']
        }))
    
    async def player_move(self, event):
        await self.send(text_data=json.dumps({
            'action': 'player_move',
            'x': event['x'],
            'y': event['y'],
            'player_id': event['player_id']
        }))

    async def player_disconnected(self, event):
        logging.info("playerDisconnected method")
        await self.send(text_data=json.dumps({
            'action': 'player_disconnected'
        }))
    
    async def send_username(self, event):
        await self.send(text_data=json.dumps({
            "action": "send_username",
            "username": event['username'],
        }))