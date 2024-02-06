import AbstractView from "./AbstractView.js";
import Ball from '../components/Ball/Ball.js';
import Paddle from "../components/Paddle/Paddle.js";

export default class Game extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
    }

    async getHtml() {
        return `
        <div class="container mt-5">
            <h1 class="text-center mb-4">Pong</h1>
            <div class="d-flex justify-content-center">
                <button id="start-game" class="btn btn-primary btn-lg">Start Game</button>
            </div>
            <div id="game" class="mt-5" style="display: none;">
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
        this.websocket = new WebSocket('ws://localhost:8000/ws/game');

        this.websocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message from server:", data);
            if (data.action === "move_paddle") {
                this.player2Paddle.position = data.position;
            }
        };

        this.websocket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
        };

        this.websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };


    initGameComponents = () => {
        this.ball = new Ball(document.getElementById("ball"));
        this.playerPaddle = new Paddle(document.getElementById("player-paddle"));
        this.player2Paddle = new Paddle(document.getElementById("player2-paddle"));
        this.playerScoreElem = document.getElementById("player1-score");
        this.player2ScoreElem = document.getElementById("player2-score");
        this.lastTime = null;

        document.addEventListener("mousemove", e => {
            this.sendPaddlePosition(e.y / window.innerHeight * 100);
        });

    }
    setupGameStart = () => {
        const startGameButton = document.getElementById("start-game");
        if (startGameButton) {
            console.log("Start game button found.");
            startGameButton.addEventListener("click", this.startGame); // Pas besoin d'utiliser une fonction fléchée ici car `this.startGame` est déjà une fonction fléchée.
            console.log("Start game button event listener added.");
        } else {
            console.error("Start game button not found.");
        }
    };


    startGame = () => {
        document.getElementById("game").style.display = "block";
        this.initWebSocket();
        this.initGameComponents();

        const ballElement = document.getElementById("ball");
        const ball = new Ball(ballElement);

        const playerPaddleElement = document.getElementById("player-paddle");
        const playerPaddle = new Paddle(playerPaddleElement);

        const player2PaddleElement = document.getElementById("player2-paddle");
        const player2Paddle = new Paddle(player2PaddleElement);

        let lastTime;
        const update = (time) => {
            if (lastTime != null) {
                const delta = time - lastTime;
                ball.update(delta, [playerPaddle.rect(), player2Paddle.rect()]);
            }
            lastTime = time;
            window.requestAnimationFrame(update);
        };

        window.requestAnimationFrame(update);
    }

    sendPaddlePosition = (position) => {
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                action: "move_paddle",
                position: position
            }));
        }
    }

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

    sendPaddleAndBallData = () => {
        const message = JSON.stringify({
            action: 'update_game_state',
            paddle_data: {
                playerPaddlePosition: this.playerPaddle.position,
                player2PaddlePosition: this.player2Paddle.position
            },
            ball_data: {
                x: this.ball.x,
                y: this.ball.y
            }
        });
        this.websocket.send(message);
    }


    isLose = () => {
        const rect = this.ball.rect();
        return rect.right >= window.innerWidth || rect.left <= 0;
    }

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

        if(this.player2ScoreElem.textContent == 5 || this.playerScoreElem.textContent == 5)
        {
            this.sendGameState();
        }
    }

    sendGameState = () => {
        const message = JSON.stringify({
            action: 'game_over',
            playerScore: this.playerScoreElem.textContent,
            player2Score: this.player2ScoreElem.textContent
        });
        this.websocket.send(message);
    }

}

document.addEventListener("DOMContentLoaded", async () => {
    const gameView = new Game();
    await gameView.getHtml().then(html => {
        document.querySelector("#app").innerHTML = html;
        gameView.setupGameStart();
    });
});

