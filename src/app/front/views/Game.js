import AbstractView from "./AbstractView.js";
import { getWebsocket } from "../src/index.js";
import { getUsername } from "../src/utils.js";
import { fetchUsernameFromId } from "../src/friendModal.js";

export default class Game extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
        this.paddle1 = document.getElementById("paddle1");
        this.paddle2 = document.getElementById("paddle2");
        this.ball = document.querySelector(".ball");
        this.scoreDisplay1 = document.getElementById("player1-score");
        this.scoreDisplay2 = document.getElementById("player2-score");
        this.websocket = null;
        this.tournamentWS = null;
        this.loopTime = 23;
        this.paddle1Y = 170;
        this.paddle2Y = 170;
        this.ballX = 300;
        this.ballY = 200;
        this.ballSpeedX = 6;
        this.ballSpeedY = 5;
        this.ballSpeedIncrease = 0.01;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameActive = true;
        this.isOffline = false;
        this.isMaster = false;
        this.player1 = false;
        this.player2 = false;
        this.opponent = null;
        this.myName = localStorage.getItem("username");
        this.opponentScore = null;
        this.myScore = null;
        this.winner = null;
        this.spectator = false;
        this.tournament = false;
        this.private = false;
        this.playerDisconnected = false;
        this.keysPressed = {
            ArrowUp: false,
            ArrowDown: false,
            w: false,
            s: false,
        };
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        window.addEventListener('popstate', this.handleNavigation);
    }

    async getHtml() {
        return `
        <div id="choose-game" class="container mt-3 centered">
            <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
                <div class="card-header text-center">
                    <h2>Choose the game !</h2>
                    <div id="choose-game-btn" class="btn-group" role="group">
                        <button id="choose-pong" class="btn btn-success">PONG</button>   
                        <button id="choose-tic" class="btn btn-light">Tic-tac-toe</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="game" class="container-fluid centered d-none">
            <div class="game-container">
                <div id="center-line"></div>
                <div class="ball"></div>
                <div class="paddle" id="paddle1"></div>
                <div class="paddle" id="paddle2"></div>
                <div id="countdown" class="countdown-display d-none"></div>
                <div id="start-game" class="btn-group" role="group">
                    <button class="btn btn-secondary btn-start-offline" style="z-index: 1;">Offline</button>   
                    <button class="btn btn-primary btn-start" style="z-index: 1;">Online</button>
                </div>
                <div id="score">
                    <span id="player1-score" class="score">0</span>
                    <div id="player1-name" class="d-none"></div>
                    <span id="player2-score" class="score">0</span>
                    <div id="player2-name" class="d-none"></div>
                </div>
                <div class="end-game-container">
                    <div id="winner"></div>
                    <button id="btn-start-private" class="btn btn-success btn-prv" style="z-index: 1;" disabled>Start Private Game</button>
                    <button class="btn btn-primary btn-reset" style="z-index: 1; display: none;">Reset</button>
                </div>  
            </div>   
        </div>
        <div id="game-tic" class="container-fluid d-none centered">
            <div id="tic-card" class="card bg-dark text-light mx-auto" style="max-width: 800px;">
                <div class="card-header text-center">
                    <h2>TIC-TAC-TOE</h2>
                </div>
                <div class="card-body">
                    <div class="text-center mb-4">
                        <h4 id="tournament-message">Select game mode</h4>
                        <div id="tic-group" class="btn-group" role="group" style="font-family: 'Press Start 2P', cursive;">
                            <button class="btn btn-secondary btn-tic-offline" style="z-index: 1;">Offline</button>   
                            <button class="btn btn-primary btn-tic" style="z-index: 1;">Online</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tic-tac-toe" class="tic-container d-none">
                <div id="board" class="board rounded text-dark">
                    <div class="cell rounded" id="cell-0-0"></div>
                    <div class="cell rounded" id="cell-0-1"></div>
                    <div class="cell rounded" id="cell-0-2"></div>
                    <div class="cell rounded" id="cell-1-0"></div>
                    <div class="cell rounded" id="cell-1-1"></div>
                    <div class="cell rounded" id="cell-1-2"></div>
                    <div class="cell rounded" id="cell-2-0"></div>
                    <div class="cell rounded" id="cell-2-1"></div>
                    <div class="cell rounded" id="cell-2-2"></div>
                </div>
                <div class="end-game-container">
                    <div id="winner-tic"></div>
                    <button class="btn btn-primary btn-reset" style="z-index: 1; display: none;">Reset</button>
                </div>  
            </div>
        </div>
        `;
    }

    handleNavigation = () => {
        document.getElementById("countdown").classList.add("d-none");
        if (this.gameActive) {
            this.gameActive = false;
            this.sendInGameStatus(false);
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        window.removeEventListener('popstate', this.handleNavigation);
    }

    navLinkClickHandler = (event) => {
        document.getElementById("countdown").classList.add("d-none");
        if (this.gameActive) {
            this.gameActive = false;
            this.sendInGameStatus(false);
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    checkIfLeave = () => {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.removeEventListener('click', this.navLinkClickHandler);
            link.addEventListener('click', this.navLinkClickHandler);
        });
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

    printNames = () => {
        if (this.player1) {
            document.getElementById("player1-name").innerText = this.myName;
            document.getElementById("player2-name").innerText = this.opponent;
        } else if (this.player2) {
            document.getElementById("player2-name").innerText = this.myName;
            document.getElementById("player1-name").innerText = this.opponent;
        }
        document.getElementById("player2-name").classList.remove("d-none");
        document.getElementById("player1-name").classList.remove("d-none");
    }

    gameLoop = () => {

        let startTime = new Date().getTime();
        let endTime = new Date().getTime();
        let executionTime = endTime - startTime;
        this.update();
        if (!this.isOffline && this.gameActive) {
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.action === "update_ball_position" && (this.player2 || this.spectator)) {
                    this.updateBallPosition(data.ball_data);
                }
                if (data.action === "update_score") {
                    this.updateScore(data.score_data);
                }
                if (this.player1 || this.spectator) {
                    if (data.action === "update_paddle2_position") {
                        this.updatePaddle2Position(data.paddle_data);
                    }
                }
                if (data.action === "send_username" && data.opponent != this.myName) {
                    this.opponent = data.opponent;
                    this.printNames();
                }
                if (this.player2 || this.spectator) {
                    if (data.action === "update_paddle1_position") {
                        this.updatePaddle1Position(data.paddle_data);
                    }
                }
                if (this.gameActive) {
                    if (data.action === "player_disconnected") {
                        if (!this.tournament) {
                            this.playerDisconnected = true;
                            this.endGame();
                        } else
                            this.tournamentDisconnection(data.username);
                    }
                }
            };
        }
        var self = this;
        if (this.gameActive) {
            if(executionTime < this.loopTime) { 
                setTimeout(function(){ self.gameLoop(); }, this.loopTime - executionTime);
            }else{
                setTimeout(function(){ self.gameLoop(); }, 0);
            }
        }
    }

    sendInGameStatus = (bool) => {
        var websocketC = getWebsocket();
        if (bool)
            websocketC.send(JSON.stringify({ action: "in_game"}));
        else
            websocketC.send(JSON.stringify({ action: "not_in_game"}));
    }

    startGame = () => {
        if (this.isMaster)
            console.log(" START_GAME");
        this.sendInGameStatus(true);
        //this.checkIfLeave();
        this.resetBall();
        this.gameActive = true;
        this.gameLoop();
        this.ball.style.display = "block";
        if (!this.tournament) {
            if (!this.isOffline && !this.private)
                setTimeout(() => { this.websocket.send(JSON.stringify({ action: "send_username" })); }, 100);
            document.getElementById("start-game").style.display = "none";
            document.getElementById("btn-start-private").style.display = "none";
        }
    };

    update = () => {
        if (!this.gameActive) return;
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        this.ballSpeedX += Math.sign(this.ballSpeedX) * this.ballSpeedIncrease;
        this.ballSpeedY += Math.sign(this.ballSpeedY) * this.ballSpeedIncrease;

        if (this.isMaster) {
            this.updateMasterBallPosition();
            this.handleBallCollision();
            if (!this.isOffline) {
                this.sendBallData();
            }
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

        if (this.ballX < 0) {
            this.scorePoint(2);
            this.ballX = 300;
            this.ballY = 200;
            this.ballSpeedX = 0;
            this.ballSpeedY = 0;
        } else if (this.ballX > 600) {
            this.scorePoint(1);
            this.ballX = 300;
            this.ballY = 200;
            this.ballSpeedX = 0;
            this.ballSpeedY = 0;
        }

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
			this.paddle2Y -= 6;
		}
		if (this.keysPressed.ArrowDown) {
			this.paddle2Y += 6;
		}
		if (this.keysPressed.w) {
			this.paddle1Y -= 6;
		}
		if (this.keysPressed.s) {
			this.paddle1Y += 6;
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
        if (this.gameActive && this.websocket) {
            if (this.keysPressed.ArrowUp) {
                this.paddle1Y -= 6;
            }
            if (this.keysPressed.ArrowDown) {
                this.paddle1Y += 6;
            }
            if (this.keysPressed.w) {
                this.paddle1Y -= 6;
            }
            if (this.keysPressed.s) {
                this.paddle1Y += 6;
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
        }
    };

    sendPaddle2Position = () => {
        if (this.gameActive && this.websocket) {
            if (this.keysPressed.ArrowUp) {
                this.paddle2Y -= 6;
            }
            if (this.keysPressed.ArrowDown) {
                this.paddle2Y += 6;
            }
            if (this.keysPressed.w) {
                this.paddle2Y -= 6;
            }
            if (this.keysPressed.s) {
                this.paddle2Y += 6;
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
    }
    };

    sendBallData = () => {
        if (this.gameActive && this.websocket) {
            const message = JSON.stringify({
                action: 'update_ball_position',
                ball_data: {
                    x: this.ballX,
                    y: this.ballY,
                }
            });
            this.websocket.send(message);
        }
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
        document.getElementById("countdown").classList.remove("d-none");
		const counterInterval = setInterval( () => {
            if (!document.getElementById("countdown") || document.getElementById("countdown").classList.contains("d-none")) {
                this.gameActive = false;
                clearInterval(counterInterval);
                return;
            }
            if (counter === 0)
                counter = "";
			document.getElementById("countdown").innerText = counter;
            if (counter != "")
			    counter--;
			if (counter === "") {
				clearInterval(counterInterval);
				document.getElementById("countdown").classList.add("d-none");
				if (Math.random() < 0.5) {
                    this.ballSpeedX = -6;
                } else {
                    this.ballSpeedX = 6;
                }
                if (Math.random() < 0.5) {
                    this.ballSpeedY = -5;
                } else {
                    this.ballSpeedY = 5;
                }
			}
		}, 1000);
    }

    sendTournamentResults() {
        const message = JSON.stringify({ action: "result", winner: this.winner});
        this.tournamentWS.send(message);
    }

    tournamentDisconnection = (disconnectedPlayer) => {
        const username = localStorage.getItem("username");
        const master = document.getElementById("player1").dataset.name;
        const player1Name = document.getElementById("player1-name").dataset.name;
        const player2Name = document.getElementById("player2-name").dataset.name;
        if (disconnectedPlayer === master){
            this.resetGame();
            this.websocket.close();
            return;
        }
        if (disconnectedPlayer != player1Name && disconnectedPlayer != player2Name)
            return;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ball.style.display = "none";
        let message;
        if (disconnectedPlayer === player1Name) {
            this.winner = player2Name;
            message = `${player1Name} leaved the tournament. ${player2Name} won by default !`
        } else if (disconnectedPlayer === player2Name) {
            this.winner = player1Name;
            message = `${player2Name} leaved the tournament. ${player1Name} won by default !`
        }
        document.getElementById("winner").innerText = message;
        this.gameActive = false;
        this.sendInGameStatus(false);
        if (!this.isOffline) {
            this.websocket.close();
        }
        this.websocket = null;
        if (username === this.winner)
                this.sendTournamentResults();
            setTimeout(() => {
                this.resetGame();
            }, 3000);
    }

    postMatchResults = async () => {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }
        try {
            const response = await fetch(`https://${serverIP}/api/post_match/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player_username: this.myName,
                    opponent_username: this.opponent,
                    player_score: this.myScore,
                    opponent_score: this.opponentScore,
                }),
            });
        } catch (error) {
            console.error('An error occurred while posting match results:', error);
        }
    }

    storeScore = () => {
        if (this.player1) {
            this.myScore = this.player1Score;
            this.opponentScore = this.player2Score;
        } else if (this.player2) {
            this.myScore = this.player2Score;
            this.opponentScore = this.player1Score;
        }
    }

    endGame = () => {
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ball.style.display = "none";
        this.storeScore();
        if (this.playerDisconnected) {
            document.getElementById("winner").innerText = "Opponent disconnected...";
        }
        else if (this.player1Score > this.player2Score) {
            let player1Name = "Player 1";
            if (this.tournament) {
                player1Name = document.getElementById("player1-name").dataset.name;
                this.winner = player1Name;
            }
            document.getElementById("winner").innerText = `${player1Name} wins!`;
        }
        else {
            let player2Name = "Player 2";
            if (this.tournament) {
                player2Name = document.getElementById("player2-name").dataset.name;
                this.winner = player2Name;
            }
            document.getElementById("winner").innerText = `${player2Name} wins!`;
        }
       // saveScore(player1Score, player2Score);
        this.gameActive = false;
        if (!this.isOffline) {
            document.getElementById("player2-name").classList.add("d-none");
            document.getElementById("player1-name").classList.add("d-none");
            this.websocket.close();
            if (!this.playerDisconnected && !this.tournament)
                this.postMatchResults();
        }
        this.websocket = null;
        this.sendInGameStatus(false);
        if (!this.tournament) {
            const resetButton = document.querySelector(".btn-reset");
            resetButton.style.display = "block";
            resetButton.addEventListener("click", this.resetGame);
        } else {
            if (this.isMaster)
                this.sendTournamentResults();
            setTimeout(() => {
                this.resetGame();
            }, 3000);
        }
    }

    resetGame = () => {
        this.paddle1Y = 170;
        this.paddle2Y = 170;
        this.ballX = 300;
        this.ballY = 200;
        this.ballSpeedX = 6;
        this.ballSpeedY = 5;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameActive = true;
        this.isOffline = false;
        this.isMaster = false;
        this.player1 = false;
        this.player2 = false;
    
        this.paddle1.style.top = "170px";
        this.paddle2.style.top = "170px";
        this.ball.style.display = "none";
        this.scoreDisplay1.innerText = "0";
        this.scoreDisplay2.innerText = "0";
        document.getElementById("winner").innerText = "";
        document.getElementById("countdown").classList.add("none");
        if (!this.tournament) {
            document.getElementById("start-game").style.display = "block";
            document.getElementById("btn-start-private").style.display = "block";
            document.querySelector(".btn-reset").style.display = "none";
        }
    };

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
        const username = localStorage.getItem("username");
        const serverIP = window.location.hostname;
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            this.websocket = new WebSocket(`wss://${serverIP}/api/ws/matchmaking/`);
            this.websocket.onopen = () => {
                console.log("Matchmaking WebSocket connection established");
                this.websocket.send(JSON.stringify({ action: "join_matchmaking" }));
            };
            const self = this;
            this.checkIfLeave();
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.action === "match_found") {
                    self.websocket.close();
                    const gameId = data.game_id;
                    self.websocket = new WebSocket(`wss://${serverIP}/api/ws/game/`);
                    self.websocket.onopen = function() {
                        if (!self.player1)
                            self.player2 = true;
                        console.log("Game WebSocket connection established");
                        self.websocket.send(JSON.stringify({ action: "start_game", game_id: gameId, username: username }));
                        self.startGame();
                    };
                } 
                if (data.action === "ball_master") {
                    if (data.is_master) {
                        self.isMaster = true;
                        self.player1 = true;
                    } else {
                        self.player2 = true;
                    }
                }
            };
            // const checkPageChange = () => {
            //     if (!document.getElementById("game")) {
            //         console.log("change page");
            //         this.websocket.close();
            //         this.websocket = null;
            //         clearInterval(intervalId);
            //     }
            // }
            //const intervalId = setInterval(checkPageChange, 500);

            this.websocket.onclose = (event) => {
                console.log("Matchmaking WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("WebSocket connection is already open.");
        }
    };

    initOfflineGame = () => {
        if (this.websocket)
            this.websocket.close();
        this.player1 = false;
        this.player2 = false;
        this.isOffline = true;
        this.isMaster = true;
        this.startGame();
    }

    handleClick = () => {
        this.websocket.close();
        const prvBtn = document.getElementById('btn-start-private');
        if (prvBtn) {
            prvBtn.disabled = true;
        }
        inviteButtons.forEach(btn => {
            btn.removeEventListener('click', handleClick);
        });
    }

    async startPrivateGame(userId, opponentUserId, gameId, GM) {
        const serverIP = window.location.hostname;
        this.opponent = await fetchUsernameFromId(opponentUserId);
        if (GM){
            this.isMaster = true;
            this.player1 = true;
        } else {
            this.player2 = true;
        }
        this.private = true;
        this.printNames();
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            this.websocket = new WebSocket(`wss://${serverIP}/api/ws/game/`);
            this.websocket.onopen = () => {
                console.log("Private WebSocket connection established");
                this.websocket.send(JSON.stringify({ action: "private", game_id: gameId }));
            }
            const self = this;
            this.checkIfLeave();
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.action === "start_game")
                    self.startGame();
            }
            const inviteButtons = document.querySelectorAll('.invite-button');
            inviteButtons.forEach(btn => {
                btn.addEventListener('click', this.handleClick);
            });
            // const checkPageChange = () => {
            //     if (!document.getElementById("game")) {
            //         console.log("change page");
            //         this.websocket.close();
            //         this.websocket = null;
            //         clearInterval(intervalId);
            //     }
            // }
            // const intervalId = setInterval(checkPageChange, 1000);

            this.websocket.onclose = (event) => {
                console.log("Private WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("WebSocket connection is already open.");
        }
    }

    initTournament(playing, gameMaster, websocketT) {
        this.tournament = true;
        this.tournamentWS = websocketT;
        if (!playing) {
            this.spectator = true;
            return;
        }
        if (gameMaster) {
            this.isMaster = true;
            this.player1 = true;
        } else {
            this.player2 = true;
        }
        console.log(this.isMaster, this.player1, this.player2);
    }

    startTournament(playing, gameMaster, gameId, websocketT) {
        this.initTournament(playing, gameMaster, websocketT);
        const username = localStorage.getItem("username");
        const serverIP = window.location.hostname;
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            this.websocket = new WebSocket(`wss://${serverIP}/api/ws/game/`);
            this.websocket.onopen = () => {
                console.log("Tournament Game WebSocket connection established");
                this.websocket.send(JSON.stringify({ action: "start_game", game_id: gameId, username: username }));
                this.startGame(); 
            }
            const self = this;
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
            }
            // const checkPageChange = () => {
            //     if (!document.getElementById("tournament-container")) {
            //         console.log("change page");
            //         this.websocket.close();
            //         this.websocket = null;
            //         clearInterval(intervalId);
            //     }
            // }
            //const intervalId = setInterval(checkPageChange, 1000);

            this.websocket.onclose = (event) => {
                console.log("Tournament Game WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("WebSocket connection is already open.");
        }
    }
}

class Tic extends AbstractView {
    constructor(params) {
        super(params);
        this.websocket = null;
        this.isOffline = false;
        this.board = Array(9).fill('');
        this.cells = document.querySelectorAll('.cell');
        this.player1 = false;
        this.player2 = false;
        this.currentOfflinePlayer = 'X';
        this.playerDisconnected = false;
        this.isTurn = false;
        this.player1Name = null;
        this.player2Name = null;
        this.winner = null;
        this.opponent = null;
        this.gameActive = false;
        this.winnerDisplay = document.getElementById('winner-tic');
        this.myName = localStorage.getItem("username");
        this.ELO = null;
    }

    getTicELO = async () => {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
            console.log('Token not found');
            return;
        }
        try {
            const response = await fetch(`https://${serverIP}/api/get_elo/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch elo');
            }
            const data = await response.json();
            return data.elo;
        } catch (error) {
            console.error('Error fetching elo:', error);
            return [];
        }
    }

    startMatchmaking = async () => {
        const serverIP = window.location.hostname;
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            this.ELO = await this.getTicELO();
            if (this.ELO < 33)
                this.websocket = new WebSocket(`wss://${serverIP}/api/ws/matchmakingbronze/`);
            else if (this.ELO < 66)
                this.websocket = new WebSocket(`wss://${serverIP}/api/ws/matchmakingsilver/`);
            else if (this.ELO <= 100)
                this.websocket = new WebSocket(`wss://${serverIP}/api/ws/matchmakinggold/`);
            this.websocket.onopen = () => {
                console.log("Matchmaking WebSocket connection established");
                this.websocket.send(JSON.stringify({ action: "join_matchmaking" }));
            };
            const self = this;
            this.checkIfLeave();
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.action === "match_found") {
                    self.websocket.close();
                    const gameId = data.game_id;
                    self.websocket = new WebSocket(`wss://${serverIP}/api/ws/game2/`);
                    self.websocket.onopen = function() {
                        if (!self.player1) {
                            self.player2 = true;
                            self.player2Name = self.myName;
                        }
                        console.log("Game WebSocket connection established");
                        self.websocket.send(JSON.stringify({ action: "start_game", game_id: gameId, username: self.myName }));
                        self.startGame();
                    };
                } 
                if (data.action === "player") {
                    if (data.player1) {
                        self.player1 = true;
                        self.player1Name = self.myName;
                        self.isTurn = true;
                    }
                }
            };
            // const checkPageChange = () => {
            //     if (!document.getElementById("game")) {
            //         console.log("change page");
            //         this.websocket.close();
            //         this.websocket = null;
            //         clearInterval(intervalId);
            //     }
            // }
            // const intervalId = setInterval(checkPageChange, 500);

            this.websocket.onclose = (event) => {
                console.log("Matchmaking WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("WebSocket connection is already open.");
        }
    }

    updateELO = async (newELO) => {
        if (newELO > 100)
            newELO = 100;
        if (newELO < 0)
            newELO = 0;
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }
        try {
            const response = await fetch(`https://${serverIP}/api/update_elo/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ new_elo: newELO })
            });
        } catch (error) {
            console.error('An error occurred while handling elo update:', error);
        }
    }

    endGame = () => {
        this.websocket.close();
        this.websocket = null;
        this.gameActive = false;
        this.sendInGameStatus(false);
        document.getElementById("winner-tic").innerText = `${this.opponent} left the game. You can leave the page now.`;
    }

    handleNavigation = () => {
        if (this.gameActive) {
            this.gameActive = false;
            this.sendInGameStatus(false);
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        window.removeEventListener('popstate', this.handleNavigation);
    }

    navLinkClickHandler = (event) => {
        if (this.gameActive) {
            this.gameActive = false;
            this.sendInGameStatus(false);
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }


    checkIfLeave = () => {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.removeEventListener('click', this.navLinkClickHandler);
            link.addEventListener('click', this.navLinkClickHandler);
        });
    }

    startGame = () => {
        this.gameActive = true;
        this.sendInGameStatus(true);
        //this.checkIfLeave();
        document.getElementById("tic-card").classList.add("d-none");
        document.getElementById("tic-tac-toe").classList.remove("d-none");
        setTimeout(() => {
            this.websocket.send(JSON.stringify({
                action: "send_username",
                username: this.myName
            }));
        }, 500);
        const self = this;
        this.websocket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (self.gameActive) {
                if (data.action === "player_disconnected") {
                    self.endGame();
                }
            }
            if (data.action === 'update_board') {
                self.updateGameBoard(data);
            } else if (data.action === 'player_move' && self.myName != data.player_id) {
                self.isTurn = true;
                self.websocket.send(JSON.stringify({
                    action: "move",
                    x: data.x,
                    y: data.y,
                    player_id: data.player_id,
                }));
            } else if (data.action === 'player_move' && self.myName === data.player_id) {
                self.isTurn = false;
            } else if (data.action === 'send_username') {
                if (self.player1) {
                    if (data.username != self.myName) {
                        self.player2Name = data.username;
                        self.opponent = data.username;
                    }
                } else if (self.player2) {
                    if (data.username != self.myName) {
                        self.player1Name = data.username;
                        self.opponent = data.username;
                    }
                }
            }

        };
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!this.isOffline && (this.player1 || this.player2) && this.isTurn) {
                    const cellId = cell.getAttribute("id").split("-").slice(1).map(Number);
                    this.websocket.send(JSON.stringify({
                        action: "move",
                        x: cellId[0],
                        y: cellId[1],
                        player_id: this.myName,
                    }));
                    this.websocket.send(JSON.stringify({
                        action: "send_move",
                        x: cellId[0],
                        y: cellId[1],
                        player_id: this.myName,
                    }));
                }
            });
        });
    };

    postTicMatchResults = async (status) => {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }
        try {
            const response = await fetch(`https://${serverIP}/api/tic_post_match/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player_username: this.myName,
                    opponent_username: this.opponent,
                    match_status: status,
                }),
            });
        } catch (error) {
            console.error('An error occurred while posting match results:', error);
        }
    }

    sendInGameStatus = (bool) => {
        var websocketC = getWebsocket();
        if (bool)
            websocketC.send(JSON.stringify({ action: "in_game"}));
        else
            websocketC.send(JSON.stringify({ action: "not_in_game"}));
    }

    updateGameBoard = (data) => {
        const board = data.board;
        const game_over = data.game_over;
        const winner = data.winner;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (board[i][j] === this.player1Name) {
                    cell.textContent = 'X';
                } else if (board[i][j] === this.player2Name) {
                    cell.textContent = 'O';
                } else {
                    cell.textContent = '';
                }
            }
        }
        if (game_over && this.gameActive === true) {
            this.gameActive = false;
            this.sendInGameStatus(false);
            if (winner === "draw") {
                this.updateELO(this.ELO + 0);
                this.postTicMatchResults('draw');
            } else if (winner === this.myName) {
                this.updateELO(this.ELO + 8);
                this.postTicMatchResults('win');
            } else {
                this.updateELO(this.ELO - 6);
                this.postTicMatchResults('loss');
            }
            let message;
            if (winner === "draw")
                message = `It's a draw...`;
            else if (winner)
                message = `${winner} won the game !`;
            document.getElementById("winner-tic").innerText = message;
        }
    }

    handleClick = (cell) => {
        const index = Array.from(this.cells).indexOf(cell);
        if (this.board[index] === '' && !this.winner) {
            this.board[index] = this.currentOfflinePlayer;
            cell.textContent = this.currentOfflinePlayer;
            this.checkWinner();
            this.togglePlayer();
        }
    }

    togglePlayer() {
        this.currentOfflinePlayer = this.currentOfflinePlayer === 'X' ? 'O' : 'X';
    }

    checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] !== '' && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                this.sendInGameStatus(false);
                this.winnerDisplay.textContent = `Player ${this.winner} wins!`;
                this.resetButton.style.display = 'block';
                return;
            }
        }
        if (!this.board.includes('')) {
            this.sendInGameStatus(false);
            this.winnerDisplay.textContent = 'It\'s a draw!';
            this.resetButton.style.display = 'block';
        }
    }

    startOfflineGame = () => {
        this.sendInGameStatus(true);
        document.getElementById("tic-card").classList.add("d-none");
        document.getElementById("tic-tac-toe").classList.remove("d-none");
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleClick(cell));
        });
    }

    initOfflineGame = () => {
        if (this.websocket)
            this.websocket.close();
        this.player1 = false;
        this.player2 = false;
        this.isOffline = true;
        this.startOfflineGame();
    }
}

export function addGameEventListeners() {
    const choosePong = document.getElementById("choose-pong");
    const chooseTic = document.getElementById("choose-tic");
    let games = 0;
    choosePong.addEventListener('click', () => {
        document.getElementById("choose-game").classList.add("d-none");
        document.getElementById("game").classList.remove("d-none");
        games = 1;
    });
    chooseTic.addEventListener('click', () => {
        document.getElementById("choose-game").classList.add("d-none");
        document.getElementById("game-tic").classList.remove("d-none");
        games = 2;
    });
    const gameView = new Game();
    document.querySelectorAll('.btn-start').forEach(button => {
        button.addEventListener('click', function() {
            if (games === 1)
                gameView.startMatchmaking();
        });
    });
    document.querySelectorAll('.btn-start-offline').forEach(button => {
        button.addEventListener('click', function() {
            if (games === 1)
                gameView.initOfflineGame();
        })
    })
    const ticView = new Tic();
    document.querySelectorAll('.btn-tic').forEach(button => {
        button.addEventListener('click', function() {
            if (games === 2)
                ticView.startMatchmaking();
        });
    });
    document.querySelectorAll('.btn-tic-offline').forEach(button => {
        button.addEventListener('click', function() {
            if (games === 2)
                ticView.initOfflineGame();
        })
    })
}


export function initPrivateGame(userId, opponentUserId) {
    const smallerId = Math.min(userId, opponentUserId);
    const largerId = Math.max(userId, opponentUserId);
    const gameId = `${smallerId}${largerId}`;
    const gameView = new Game();
    let GM;
    if (parseInt(userId) === smallerId) GM = true;
    else GM = false;
    gameView.startPrivateGame(userId, opponentUserId, gameId, GM);
}

export function startTournamentGame(playing, gameMaster, gameId, websocketT) {
    const gameView = new Game();
    if (gameMaster)
        console.log("GAMEMASTER");
    gameView.startTournament(playing, gameMaster, gameId, websocketT);
}