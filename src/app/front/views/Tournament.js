import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "./Game.js";

export default class Tournament extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
        this.websocketT = null;
        this.tournamentMaster = null;
        this.playing = false;
        this.ready1 = false;
        this.ready2 = false;
        this.players = {
            player1: false,
            player2: false,
            player3: false,
            player4: false
        };
    }

    async getHtml() {
        return `
        <div id="tournament-container" class="container mt-3 centered">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            <div class="card-header text-center">
                <h2>Tournament</h2>
                <button id="delete-tournament" class="btn btn-danger">DELETE</button>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h4>Choose Tournament Type</h4>
                    <div id="btn-group" class="container" aria-label="Tournament Type">
                        <button id="start-tournament" type="button" class="btn btn-primary btn-4players">Start 4 Players Tournament</button>
                    </div>
                    <div id="player-queue" class="queue-container d-none">
                        <h2>Tournament Queue</h2>
                        <div id="player1" class="player-slot"></div>
                        <div id="player2" class="player-slot"></div>
                        <div id="player3" class="player-slot"></div>
                        <div id="player4" class="player-slot"></div>
                    </div>
                    <div id="spinner-container" class="text-primary d-none" role="status">
                        <button id="queue-btn" class="btn btn-primary" type="button" disabled>
                            <span id="queue-spinner"class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span id="queue-btn-text" role="status">Waiting for players...</span>
                        </button>
                    </div>
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
           <div id="countdown" class="countdown-display" style="display: none;"></div>
           <div id="score">
              <span id="player1-score" class="score">0</span>
              <div id="player1-name" class="d-none"></div>
              <span id="player2-score" class="score">0</span>
              <div id="player2-name" class="d-none"></div>
            </div>
            <button id="ready-player-one" class="btn btn-secondary d-none">Ready</button>
            <button id="ready-player-two" class="btn btn-secondary d-none">Ready</button>
           <div class="end-game-container">
                <div id="winner"></div>
            </div>  
        </div>   
     </div>
        `;
    }

    assignPlayer(i) {
        i++;
        let playerKey = "player" + i;
        this.players[playerKey] = true;
        if (i < 4) {
            i++;
            playerKey = "player" + i;
            this.players[playerKey] = false;
        }
    }

    addPlayerToHTML(playerName, playerId) {
        const username = localStorage.getItem("username");
        const playerSlot = document.querySelectorAll(".player-slot");
        for (let i = 0; i < playerSlot.length; i++) {
            if (!playerSlot[i].textContent) {
                playerSlot[i].textContent = playerName;
                playerSlot[i].dataset.name = playerName;
                playerSlot[i].dataset.id = playerId;
                if (playerName === username)
                    this.assignPlayer(i);
                break;
            }
        }
    }

    removeDisconnectedPlayer(playerName) {
        const playerElements = document.querySelectorAll(".player-slot");
        const username = localStorage.getItem("username");
        let playerIndex = -1;
        
        for (let i = 0; i < playerElements.length; i++) {
            if (playerElements[i].textContent === playerName) {
                playerIndex = i;
                break;
            }
        }
    
        if (playerIndex !== -1) {
            playerElements[playerIndex].textContent = null;
            playerElements[playerIndex].dataset.name = null;
            playerElements[playerIndex].dataset.id = null;
            for (let i = playerIndex + 1; i < playerElements.length; i++) {
                playerElements[i - 1].textContent = playerElements[i].textContent;
                playerElements[i - 1].dataset.name = playerElements[i].dataset.name;
                playerElements[i - 1].dataset.id = playerElements[i].dataset.id;
                if (playerElements[i - 1].dataset.name === username)
                    this.assignPlayer(i - 1);
            }
            const lastIndex = playerElements.length - 1;
            playerElements[lastIndex].textContent = null;
            playerElements[lastIndex].dataset.name = null;
            playerElements[lastIndex].dataset.id = null;
        }
    }

    initTournament(bool) {
        if (bool) {
            const joinBtn = document.getElementById("join-tournament");
            joinBtn.remove();
        }
        const startTournamentBtn = document.getElementById("start-tournament");
        const playerQueue = document.getElementById("player-queue");
        const spinnerContainer = document.getElementById("spinner-container");
        startTournamentBtn.classList.add("d-none");
        spinnerContainer.classList.remove("d-none");
        playerQueue.classList.remove("d-none");
        if (!bool) {
            this.tournamentMaster = true;
            this.enterTournament();
        }
    }

    sendStartMessage() {
        const message = JSON.stringify({ action: "start_tournament"});
        this.websocketT.send(message);
    }

    sendReadyMessage(player) {
        let message = null;
        console.log('player: ' + player);
        if (player === 1)
            message = JSON.stringify({ action: "game_ready", player: "1"});
        else if (player === 2)
            message = JSON.stringify({ action: "game_ready", player: "2"});
        console.log(message);
        this.websocketT.send(message);
    }

    initFirstGame() {
        if (this.players['player1']) {
            this.playing = true;
            const ready1 = document.getElementById("ready-player-one");
            ready1.classList.remove("d-none");
            ready1.addEventListener('click', () => { 
                ready1.disabled = true;
                this.sendReadyMessage(1);
            });
        } else if (this.players['player2']) {
            this.playing = true;
            const ready2 = document.getElementById("ready-player-two");
            ready2.classList.remove("d-none");
            ready2.addEventListener('click', () => { 
                ready2.disabled = true;
                this.sendReadyMessage(2);
            });
        }
    }

    startTournament() {
        const tournamentContainer = document.getElementById("tournament-container");
        tournamentContainer.classList.add("d-none");
        const gameContainer = document.getElementById("game");
        gameContainer.classList.remove("d-none");
        const player1Name = document.getElementById("player1").dataset.name;
        const player2Name = document.getElementById("player2").dataset.name;
        const player1Display = document.getElementById("player1-name");
        const player2Display = document.getElementById("player2-name");
        player1Display.textContent = player1Name;
        player2Display.textContent = player2Name;
        player1Display.classList.remove("d-none");
        player2Display.classList.remove("d-none");
        this.initFirstGame();
    }

    readyTournament() {
        const button = document.getElementById("queue-btn");
        button.classList.add("btn-success");
        const spinner = document.getElementById("queue-spinner");
        spinner.classList.remove('spinner-border');
        spinner.classList.remove('spinner-border-sm');
        const btnText = document.getElementById("queue-btn-text");
        btnText.textContent = 'Start the tournament';
        if (this.tournamentMaster) {
            button.disabled = false;
            button.addEventListener('click', () => { this.sendStartMessage(); });
        }
    }

    getGameId() {
        const player1Id = document.getElementById("player1").dataset.id;
        const player2Id = document.getElementById("player2").dataset.id;
        const smallerId = Math.min(player1Id, player2Id);
        const largerId = Math.max(player1Id, player2Id);
        const gameId = `${smallerId}${largerId}`;
        console.log("getGameId: " + gameId);
        return (gameId);
    }

    gameReady(playerData) {
        console.log("game is ready to start");
        if (playerData === "1")
            this.ready1 = true;
        if (playerData === "2")
            this.ready2 = true;
        if (this.ready1 && this.ready2 && this.players["player1"])
            startTournamentGame(this.playing, true, this.getGameId());
        else if (this.ready1 && this.ready2 && !this.players["player1"])
            startTournamentGame(this.playing, false, this.getGameId());
    }

    enterTournament() {
        const serverIP = window.location.hostname;
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");
        if (this.websocketT === null) {
            this.websocketT = new WebSocket(`wss://${serverIP}/api/ws/tournament/`);
            this.websocketT.onopen = () => {
                console.log("Tournament WebSocket connection established");
                this.websocketT.send(JSON.stringify({ action: 'join', username: username, userId: userId }));
            };
            const self = this;
            this.websocketT.onmessage = function(event) {
                const data = JSON.parse(event.data);

                if (data.action === "tournament_full") {
                    self.websocketT.close();
                    self.websocketT = null;
                    alert("TOURNAMENT IS FULL!");
                }
                if (data.action === "not_full") {
                    self.initTournament(true);
                }
                if (data.action === "player_list") {
                    setTimeout(() => {
                        self.addPlayerToHTML(data.username, data.userId);
                    }, 50);
                    
                }
                if (data.action === "leave") {
                    console.log(data.username, " disconnected from tournament !");
                    self.removeDisconnectedPlayer(data.username);
                }
                if (data.action === "ready") {
                    self.readyTournament();
                }
                if (data.action === "start_tournament") {
                    self.startTournament();
                }
                if (data.action === "game_ready") {
                    self.gameReady(data.player);
                }
            };
            const checkPageChange = () => {
                if (!document.getElementById("tournament-container")) {
                    console.log("change page");
                    this.websocketT.close();
                    this.websocketT = null;
                    clearInterval(intervalId);
                }
            }
            const intervalId = setInterval(checkPageChange, 1000);

            this.websocketT.onclose = (event) => {
                console.log("Tournament WebSocket connection closed", event);
                clearInterval(intervalId); 
            };
            this.websocketT.onerror = (error) => {
                console.error("WebSocket error:", error);
                clearInterval(intervalId);
            };
        } else {
            console.log("WebSocket connection is already open.");
        }
    }
}

async function createTournament(websocket) {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/create_tournament/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Tournament created successfully with ID:', result.tournament_id);
            const message = JSON.stringify({ action: "start_tournament" });
            websocket.send(message);
        } else {
            console.error('Failed to create tournament:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while creating tournament:', error);
    }
}

export function eventDelete() {
    const deleteBtn = document.getElementById("delete-tournament");
    deleteBtn.addEventListener('click', () => { deleteTournament(); });
}

async function deleteTournament() {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/delete_tournament/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Tournament deleted successfully');
        } else {
            console.error('no tournament to delete');
        }
    } catch (error) {
        console.error('An error occurred while deleting tournament:', error);
    }
}

export function addTournamentEventListeners(websocket) {
    const startBtn = document.getElementById("start-tournament");
    const tournament = new Tournament();
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            createTournament(websocket);
            tournament.initTournament(false);
        });
    }
    const deleteBtn = document.getElementById("delete-tournament");
    deleteBtn.addEventListener('click', () => { deleteTournament(); });
}

export function tournamentCreated(username) {
    document.getElementById("start-tournament").classList.add("d-none");
    const joinTournamentBtn = document.createElement("button");
    joinTournamentBtn.classList.add("btn", "btn-primary", "button-font");
    joinTournamentBtn.textContent = "Join " + username + "'s Tournament";
    joinTournamentBtn.id = "join-tournament";
    const btnContainer = document.getElementById("btn-group");
    btnContainer.appendChild(joinTournamentBtn);

    const tournament = new Tournament();
    joinTournamentBtn.addEventListener('click', () => { 
        tournament.enterTournament(); 
    });
}

export async function checkTournamentExists() {
    const serverIP = window.location.hostname;
    try {
        const response = await fetch(`https://${serverIP}/api/check_tournament/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.tournament_exists) {
                const creatorId = data.creator_id;
                return (creatorId);
            } else {
                return (null);
            }
        } else {
            console.error('Failed to check tournament existence:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while checking tournament existence:', error);
    }
}