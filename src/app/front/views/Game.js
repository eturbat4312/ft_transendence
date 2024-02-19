import AbstractView from "./AbstractView.js";

export default class Game extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
        this.paddle1 = document.getElementById("paddle1");
        this.paddle2 = document.getElementById("paddle2");
        this.ball = document.querySelector(".ball");
        this.playButton = document.querySelector(".btn-start");
        this.scoreDisplay1 = document.getElementById("player1-score");
        this.scoreDisplay2 = document.getElementById("player2-score");
        this.gameContainer = document.querySelector(".game-container");
        this.websocket = null;
        this.paddle1Y = 170;
        this.paddle2Y = 170;
        this.ballX = 300;
        this.ballY = 200;
        this.ballSpeedX = 2;
        this.ballSpeedY = 2;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameActive = true;
        this.isOffline = false;
        this.isMaster = false;
        this.player1 = false;
        this.player2 = false;
        this.keysPressed = {
            ArrowUp: false,
            ArrowDown: false,
            w: false,
            s: false,
        };
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    async getHtml() {
        return `
        <div id="game" class="container-fluid">
        <div class="game-container">
           <div id="center-line"></div>
           <div class="ball"></div>
           <div class="paddle" id="paddle1"></div>
           <div class="paddle" id="paddle2"></div>
           <div id="countdown" class="countdown-display"></div>
           <div id="start-game" class="btn-group" role="group">
              <button class="btn btn-secondary btn-start-offline" style="z-index: 1;">Offline</button>   
              <button class="btn btn-primary btn-start" style="z-index: 1;">Online</button>
           </div>
           <div id="score">
              <span id="player1-score" class="score">0</span>
              <span id="player2-score" class="score">0</span>
           </div>
           <div id="winner"></div>       
        </div>   
     </div>
        `;
    }

    updateScore = (data) => {
        const { player1Score, player2Score } = data;
        this.player1Score = player1Score;
        this.player2Score = player2Score;
        if (this.player1Score !== 0)
		    this.scoreDisplay1.innerText = this.player1Score;
        if (this.player2Score !== 0)
		    this.scoreDisplay2.innerText = this.player2Score;
        (this.player1Score === 3 || this.player2Score === 3) ? this.endGame() : this.resetBall();
	}

    updateOfflineScore = () => {
		this.scoreDisplay1.innerText = this.player1Score;
		this.scoreDisplay2.innerText = this.player2Score;
        (this.player1Score === 3 || this.player2Score === 3) ? this.endGame() : this.resetBall();
	}


    initWebSocket = () => {
        this.websocket = new WebSocket('ws://localhost:8000/ws/matchmaking');

        this.websocket.onopen = () => {
            console.log("WebSocket connection established");
            };
        this.websocket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
        };

        this.websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    gameLoop = () => {
        this.update();
        if (!this.isOffline) {
            if (this.websocket.readyState !== WebSocket.OPEN) {
                console.log("WebSocket is not open, attempting to reconnect...");
                this.initWebSocket();
            }
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.action === "update_ball_position") {
                    // je dois implementer le fait que la ball s update par les socket seulement avec le jouer qui neset pas le ballmaster
                    this.updateBallPosition(data.ball_data);
                }
                if (data.action === "update_score") {
                    this.updateScore(data.score_data);
                }
                if (this.player1) {
                    if (data.action === "update_paddle2_position") {
                        this.updatePaddle2Position(data.paddle_data);
                    }
                }
                if (this.player2) {
                    if (data.action === "update_paddle1_position") {
                        this.updatePaddle1Position(data.paddle_data);
                    }
                }
            };
        }
        requestAnimationFrame(this.gameLoop);
    }

    startGame = () => {
        if (!this.player1)
            this.player2 = true;
        this.resetBall();
        this.gameActive = true;
        this.gameLoop();
        this.ball.style.display = "block";
        document.getElementById("start-game").style.display = "none";
    };

    update = () => {
        if (!this.gameActive) return;
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        if (this.isMaster) {
            this.updateMasterBallPosition();
            this.handleBallCollision();
            if (!this.isOffline)
                this.sendBallData();
            if (this.isOffline)
                this.updatePaddlePosition();
        }
        if (this.player1) {
		    this.sendPaddle1Position();
        }
        else if (this.player2) {
            this.sendPaddle2Position();
        }
    }

    handleBallCollision = () => {
        if (this.ballY < 5 || this.ballY > 395) this.ballSpeedY = -this.ballSpeedY;

        if (this.ballX < 0) this.scorePoint(2);
        else if (this.ballX > 600) this.scorePoint(1);

        if (this.isCollisionWithPaddle()) this.ballSpeedX = -this.ballSpeedX;
    }

    isCollisionWithPaddle = () => {
        const paddle1Collision = this.ballX < 25 && this.ballX > 15 && this.ballY > this.paddle1Y && this.ballY < this.paddle1Y + 80;
        const paddle2Collision = this.ballX > 575 && this.ballX < 585 && this.ballY > this.paddle2Y && this.ballY < this.paddle2Y + 80;
        return paddle1Collision || paddle2Collision;
    }

    updateMasterBallPosition = () => {
        this.ball.style.left = this.ballX + "px";
        this.ball.style.top = this.ballY + "px";
    }

    updateBallPosition = (data) => {
        const { x, y } = data;
        if (this.ball) {
            this.ball.style.left = x + "px";
            this.ball.style.top = y + "px";
        }
    }

    updatePaddlePosition = () => {
		if (this.keysPressed.ArrowUp) {
			this.paddle2Y -= 3;
		}
		if (this.keysPressed.ArrowDown) {
			this.paddle2Y += 3;
		}
		if (this.keysPressed.w) {
			this.paddle1Y -= 3;
		}
		if (this.keysPressed.s) {
			this.paddle1Y += 3;
		}
	
		this.paddle1Y = Math.max(2, Math.min(this.paddle1Y, 338));
		this.paddle2Y = Math.max(2, Math.min(this.paddle2Y, 338));
	
		this.paddle1.style.top = this.paddle1Y + "px";
		this.paddle2.style.top = this.paddle2Y + "px";
	}

    updatePaddle1Position = (data) => {
        const { paddle1 } = data;
        this.paddle1Y = paddle1;
        this.paddle1Y = Math.max(2, Math.min(this.paddle1Y, 338));   
        this.paddle1.style.top = this.paddle1Y + "px";
    }
    updatePaddle2Position = (data) => {
        const { paddle2 } = data;
        this.paddle2Y = paddle2;
        this.paddle2Y = Math.max(2, Math.min(this.paddle2Y, 338));   
        this.paddle2.style.top = this.paddle2Y + "px";
    }

    sendPaddle1Position = () => {
        if (this.keysPressed.ArrowUp) {
            this.paddle1Y -= 3;
        }
        if (this.keysPressed.ArrowDown) {
            this.paddle1Y += 3;
        }
        if (this.keysPressed.w) {
            this.paddle1Y -= 3;
        }
        if (this.keysPressed.s) {
            this.paddle1Y += 3;
        }
        const message = JSON.stringify({
            action: 'update_paddle1_position',
            paddle_data: {
                paddle1: this.paddle1Y,
            }
        });
        this.websocket.send(message);
        this.paddle1Y = Math.max(2, Math.min(this.paddle1Y, 338));   
        this.paddle1.style.top = this.paddle1Y + "px";
    };

    sendPaddle2Position = () => {
        if (this.keysPressed.ArrowUp) {
            this.paddle2Y -= 3;
        }
        if (this.keysPressed.ArrowDown) {
            this.paddle2Y += 3;
        }
        if (this.keysPressed.w) {
            this.paddle2Y -= 3;
        }
        if (this.keysPressed.s) {
            this.paddle2Y += 3;
        }
        const message = JSON.stringify({
            action: 'update_paddle2_position',
            paddle_data: {
                paddle2: this.paddle2Y,
            }
        });
        this.websocket.send(message);    
        this.paddle2Y = Math.max(2, Math.min(this.paddle2Y, 338));   
        this.paddle2.style.top = this.paddle2Y + "px";
    };

    sendBallData = () => {
        const message = JSON.stringify({
            action: 'update_ball_position',
            ball_data: {
                x: this.ballX,
                y: this.ballY,
            }
        });
        this.websocket.send(message);
    };

    scorePoint = (player) => {
        (player === 1) ? this.player1Score++ : this.player2Score++;
        if (!this.isOffline)
            this.sendScoreUpdate();
        else 
            this.updateOfflineScore();
    }

    sendScoreUpdate = () => {
        const message = JSON.stringify({
            action: 'update_score',
            score_data: {
                player1Score: this.player1Score,
                player2Score: this.player2Score,
            }
        });
        this.websocket.send(message);
    };

    resetBall = () => {
        this.ballX = 300;
        this.ballY = 200;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ball.style.display = "block";

		let counter = 3;
		const counterInterval = setInterval( () => {
			document.getElementById("countdown").innerText = counter;
			document.getElementById("countdown").style.display = "block";
			counter--;
			if (counter < 0) {
				clearInterval(counterInterval);
				document.getElementById("countdown").style.display = "none";
				this.ballSpeedX = 2;
				this.ballSpeedY = 2;
			}
		}, 1000);
    }

    endGame = () => {
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ball.style.display = "none";
        if (this.player1Score > this.player2Score) {
            document.getElementById("winner").innerText = "Player 1 wins!";
        }
        else {
            document.getElementById("winner").innerText = "Player 2 wins!";
        }
       // saveScore(player1Score, player2Score);
        this.gameActive = false;
    }

    handleKeyDown = (event) => {
        this.handleKeyPress(event.key, true);
    }

    handleKeyUp = (event) => {
        this.handleKeyPress(event.key, false);
    }

    handleKeyPress = (key, isPressed) => {
        switch (key) {
            case "ArrowUp":
                this.keysPressed.ArrowUp = isPressed;
                break;
            case "ArrowDown":
                this.keysPressed.ArrowDown = isPressed;
                break;
            case "w":
                this.keysPressed.w = isPressed;
                break;
            case "s":
                this.keysPressed.s = isPressed;
                break;
        }
    }

    startMatchmaking = () => {
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            this.websocket = new WebSocket('ws://localhost:8000/ws/matchmaking');
            this.websocket.onopen = () => {
                console.log("Matchmaking WebSocket connection established");
                this.websocket.send(JSON.stringify({ action: "join_matchmaking" }));
            };
            const self = this;
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.action === "match_found") {
                    console.log("match found");
                    self.websocket.close();
                    const gameId = data.game_id;
                    console.log("gameId = ", gameId);
                    self.websocket = new WebSocket('ws://localhost:8000/ws/game');
                    self.websocket.onopen = function() {
                        console.log("Game WebSocket connection established");
                        self.websocket.send(JSON.stringify({ action: "start_game", game_id: gameId }));
                        self.startGame();
                    };
                } 
                if (data.action === "ball_master") {
                    if (data.is_master) {
                        self.isMaster = true;
                        self.player1 = true;
                        console.log("You are the ballMaster!");
                    } else {
                        self.player2 = true;
                        console.log("You are not the ballMaster.");
                    }
                }
            };
            this.websocket.onclose = (event) => {
                console.log("Matchmaking WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("WebSocket connection is already open.");
            this.websocket.send(JSON.stringify({ action: "join_matchmaking" }));
        }
    };

    initOfflineGame = () => {
        this.isOffline = true;
        this.isMaster = true;
        this.startGame();
    }
}

export function addGameEventListeners() {
    const gameView = new Game();
    document.querySelectorAll('.btn-start').forEach(button => {
        button.addEventListener('click', function() {
            gameView.startMatchmaking();
        });
    });
    document.querySelectorAll('.btn-start-offline').forEach(button => {
        button.addEventListener('click', function() {
            gameView.initOfflineGame();
        })
    })
}