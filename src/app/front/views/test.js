import AbstractView from "./AbstractView.js";
import Ball from '../components/Ball/Ball.js';
import Paddle from "../components/Paddle/Paddle.js";

export default class Game extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
        this.playerScoreElem = null;
        this.player2ScoreElem = null;
        this.websocket = null;
        this.gamesocket = null;
        this.ball = null;
        this.playerPaddle = null;
        this.player2Paddle = null;
        this.isMaster = false;
        this.lastTime = null;
    }

    async getHtml() {
        return `
        <div class="container mt-5">
            <h1 class="text-center mb-4">Pong</h1>
            <div class="d-flex justify-content-center">
                <button id="start-game" class="btn btn-primary btn-lg btn-start">Start Game</button>
            </div>
            <div id="game" class="mt-5">
                <div class="row">
                    <div class="col text-center">
                        <h2>Player 1 Score</h2>
                        <p id="player1-score" class="h4">0</p>
                    </div>
                    <div class="col text-center">
                        <h2>Player 2 Score</h2>
                        <p id="player2-score" class="h4">0</p>
                    </div>
                </div>
                <body>
                    <div class="col-md-6 mx-auto">
                        <div id="player-paddle" class="paddle left"></div>
                        <div id="player2-paddle" class="paddle right"></div>
                        <div id="ball" class="ball"></div>
                    </div>
                </body>
            </div>
        `;
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

    initGameComponents = () => {
        //this.initWebSocket();
 //       console.log("this.ball:", this.ball);
        this.ball = new Ball(document.getElementById("ball"));
//        console.log("this.ball:", this.ball);
        this.playerPaddle = new Paddle(document.getElementById("player-paddle"));
        this.player2Paddle = new Paddle(document.getElementById("player2-paddle"));
        this.playerScoreElem = document.getElementById("player1-score");
        this.player2ScoreElem = document.getElementById("player2-score");
        this.lastTime = null;

        document.addEventListener("mousemove", e => {
            this.sendPaddlePosition(e.y / window.innerHeight * 100);
        });
    };

    startGame = () => {
        this.initGameComponents();
        document.getElementById("start-game").style.display = "none";
        const ballElement = document.getElementById("ball");
        const ball = new Ball(ballElement);

        const playerPaddleElement = document.getElementById("player-paddle");
        const playerPaddle = new Paddle(playerPaddleElement);

        const player2PaddleElement = document.getElementById("player2-paddle");
        const player2Paddle = new Paddle(player2PaddleElement);
        if (!this.ball) {
            console.error("this.ball is not initialized correctly.");
            return;
        }
        let lastTime;
        const update = (time) => {
            if (lastTime != null) {
                const delta = time - lastTime;
                if (this.isMaster) {
                        ball.update(delta, [playerPaddle.rect(), player2Paddle.rect()]);
                    this.sendPaddleAndBallData();
                }
            }
            lastTime = time;
            window.requestAnimationFrame(update);
        };

        if (this.websocket.readyState !== WebSocket.OPEN) {
            console.log("WebSocket is not open, attempting to reconnect...");
            this.initWebSocket();
        }
        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === "update_ball_position") {
                this.updateBallPosition(data.ball_data);
            }
        };

        window.requestAnimationFrame(update);
    };

    update = (time) => {
        if (this.lastTime != null) {
            const delta = time - this.lastTime;
            this.ball.update(delta, [this.playerPaddle.rect(), this.player2Paddle.rect()]);
            this.sendPaddleAndBallData();
        }

        if (this.isLose()) this.handleLose();

        this.lastTime = time;
        window.requestAnimationFrame(this.update.bind(this));
    }

    updateBallPosition = (data) => {
        const { x, y } = data;
        if (this.ball) {
            this.ball.x = x;
            this.ball.y = y;
        }
    };

    sendPaddlePosition = (position) => {
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                action: "move_paddle",
                position: position
            }));
        }
    };

    sendPaddleAndBallData = () => {
        const message = JSON.stringify({
            action: 'update_ball_position',
            ball_data: {
                x: this.ball.x,
                y: this.ball.y
            }
        });
        this.websocket.send(message);
    };

    isLose = () => {
        const rect = this.ball.rect();
        return rect.right >= window.innerWidth || rect.left <= 0;
    };

    handleLose = () => {
        const rect = this.ball.rect();
        if (rect.right >= window.innerWidth) {
            this.playerScoreElem.textContent = parseInt(this.playerScoreElem.textContent) + 1;
        } else {
            this.player2ScoreElem.textContent = parseInt(this.player2ScoreElem.textContent) + 1;
        }
        this.ball.reset();
        this.player2Paddle.reset();
        this.playerPaddle.reset();

        if (this.player2ScoreElem.textContent == 5 || this.playerScoreElem.textContent == 5) {
            this.sendGameState();
        }
    };

    sendGameState = () => {
        const message = JSON.stringify({
            action: 'game_over',
            playerScore: this.playerScoreElem.textContent,
            player2Score: this.player2ScoreElem.textContent
        });
        this.websocket.send(message);
    };

    initGame = async () => {
        const html = await this.getHtml();
        document.querySelector("#app").innerHTML = html;
    };

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
                    self.websocket = new WebSocket('ws://localhost:8000/ws/game');
                    self.websocket.onopen = function() {
                        console.log("Game WebSocket connection established");
                        self.websocket.send(JSON.stringify({ action: "start_game" }));
                        self.startGame();
                    };
                } 
                if (data.action === "ball_master") {
                    if (data.is_master) {
                        self.isMaster = true;
                        console.log("You are the ballMaster!");
                    } else {
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
}

export function addGameEventListeners() {
    const gameView = new Game();
    document.querySelectorAll('.btn-start').forEach(button => {
        button.addEventListener('click', function() {
            gameView.startMatchmaking();
        });
    });
}