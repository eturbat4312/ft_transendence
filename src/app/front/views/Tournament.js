import AbstractView from "./AbstractView.js";

export default class Tournament extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
        this.websocketT = null;
        this.websocketG = null;
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
        this.players = 0;
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
        `;
    }

    addPlayerToHTML(playerName, playerId) {
        const playerSlot = document.querySelectorAll(".player-slot");
        for (let i = 0; i < playerSlot.length; i++) {
            if (!playerSlot[i].textContent) {
                playerSlot[i].textContent = playerName;
                playerSlot[i].dataset.name = playerName;
                playerSlot[i].dataset.id = playerId;
                break;
            }
        }
    }

    removeDisconnectedPlayer(playerName) {
        const playerElementToRemove = document.querySelector(`.player-slot[data-name="${playerName}"]`);
        if (playerElementToRemove) {
            playerElementToRemove.textContent = null;
            playerElementToRemove.dataset.name = null;
            playerElementToRemove.dataset.id = null;
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
            this.player1 = true;
            this.enterTournament();
        }
    }

    readyTournament() {
        const button = document.getElementById("queue-btn");
        if (this.player1)
            button.disabled = false;
        button.classList.add("btn-success");
        const spinner = document.getElementById("queue-spinner");
        spinner.classList.remove('spinner-border');
        spinner.classList.remove('spinner-border-sm');
        const btnText = document.getElementById("queue-btn-text");
        btnText.textContent = 'Start the tournament';
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