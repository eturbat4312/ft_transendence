import { fetchUsernameFromId } from "../src/friendModal.js";
import AbstractView from "./AbstractView.js";
import { startTournamentGame } from "./Game.js";
import { getWebsocket } from "../src/index.js";
import { navigate } from "../src/index.js";

export default class Tournament extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
        this.websocketT = null;
        this.tournamentMaster = null;
        this.playing = false;
        this.ready1 = false;
        this.ready2 = false;
        this.round = 1;
        this.started = false;
        this.demiwinner = false;
        this.round1winner = null;
        this.round2winner = null;
        this.players = {
            player1: false,
            player2: false,
            player3: false,
            player4: false
        };
        this.disconnected = [];
    }

    async getHtml() {
        return `
        <div id="tournament-container" class="container mt-3 centered" style="max-width: calc(100% - 200px);">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px">
            <div class="card-header text-center">
                <h2>Tournament</h2>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h4 id="tournament-message">Choose Tournament Type</h4>
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
    <div id="gameT" class="container-fluid centered d-none">
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

    removeDisconnectedQueue(playerName) {
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

    handleFirstRound(player1Name, player2Name, player1, player2) {
        if (this.round != 1)
            return;
        if (player2 || player1) {
            document.getElementById("ready-player-one").classList.add("d-none");
            document.getElementById("ready-player-two").classList.add("d-none");
            if (this.checkInterval)
                clearInterval(this.checkInterval);
        }
        console.log("handleFirstRound");
        let message;
        let winner;
        if (player1 && player2) {
            winner = "No one";
            message = `${player1Name} and ${player2Name} leaved the tournament.`;
        } else if (player1 && !player2) {
            winner = player2Name;
            message = `${player1Name} leaved the tournament. ${player2Name} won by default !`;
        } else if (!player1 && player2){
            winner = player1Name;
            message = `${player2Name} leaved the tournament. ${player1Name} won by default !`
        }
        document.getElementById("winner").innerText = message;
        setTimeout(() => {
            this.printResults(winner);
        }, 3000);
    }

    handleSecoundRound(player1Name, player2Name, player1, player2) {
        if (this.round != 2)
            return;
        if (player2 || player1) {
            document.getElementById("ready-player-one").classList.add("d-none");
            document.getElementById("ready-player-two").classList.add("d-none");
            if (this.checkInterval)
                clearInterval(this.checkInterval);
        }
        console.log("handleSecoundRound");
        let message;
        let winner;
        if (player1 && player2) {
            winner = "No one";
            message = `${player1Name} and ${player2Name} leaved the tournament.`;
        } else if (player1 && !player2) {
            winner = player2Name;
            message = `${player1Name} leaved the tournament. ${player2Name} won by default !`;
        } else if (!player1 && player2){
            winner = player1Name;
            message = `${player2Name} leaved the tournament. ${player1Name} won by default !`
        }
        document.getElementById("winner").innerText = message;
        setTimeout(() => {
            this.printResults(winner);
        }, 3000);
    }

    handleFinal(player1Name, player2Name, player1, player2) {
        if (this.round != 3)
            return;
        if (player2 || player1) {
            document.getElementById("ready-player-one").classList.add("d-none");
            document.getElementById("ready-player-two").classList.add("d-none");
            if (this.checkInterval)
                clearInterval(this.checkInterval);
        }
        let message;
        let winner;
        if (player1 && player2) {
            winner = "No one";
            message = `${player1Name} and ${player2Name} leaved the tournament. There is no winner...`;
        } else if (player2Name === "No one") {
            winner = player1Name;
            message = `There is no player except ${player1Name}, he won the tournament by default !`;
        } else if (player1 && !player2) {
            winner = player2Name;
            message = `${player1Name} leaved the tournament. ${player2Name} won the tournament by default !`;
        } else if (!player1 && player2){
            winner = player1Name;
            message = `${player2Name} leaved the tournament. ${player1Name} won the tournament by default !`
        }
        document.getElementById("winner").innerText = message;
        setTimeout(() => {
            this.finishTournament(winner);
        }, 3000);
    }

    playerDisconnected(playerName) {
        this.disconnected.push(playerName);
    }

    checkIfDisconnected(player1Name, player2Name) {
        let player1 = false;
        let player2 = false;

        for (let i = 0; i < this.disconnected.length; i++) {
            if (player1Name === this.disconnected[i] || player1Name === "No one")
                player1 = true;
            if (player2Name === this.disconnected[i] || player2Name === "No one")
                player2 = true;
        }
        if (!player1 && !player2)
            return (false);
        let master = document.getElementById("player1").dataset.name;
        if (player1 && player1Name === master)
            return;
        this.handleFirstRound(player1Name, player2Name, player1, player2);
        this.handleSecoundRound(player1Name, player2Name, player1, player2);
        this.handleFinal(player1Name, player2Name, player1, player2);
        if (player1 || player2)
            return (true);
    }

    sendDeletedMessage() {
        if (this.tournamentMaster) {
            deleteTournament();
            var tmpWebsocket = getWebsocket();
            tmpWebsocket.send(JSON.stringify({ "action": "delete_tournament"}));
        }
    }

    navLinkClickHandler = (event) => {
        if (this.websocketT) {
            this.websocketT.close();
            this.websocketT = null;
        }
        if (this.tournamentMaster)
            this.sendDeletedMessage()
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.removeEventListener('click', this.navLinkClickHandler);
        });
    }

    checkIfLeave = () => {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.removeEventListener('click', this.navLinkClickHandler);
            link.addEventListener('click', this.navLinkClickHandler);
        });
    }

    initTournament(bool) {
        if (bool) {
            const joinBtn = document.getElementById("join-tournament");
            if (joinBtn)
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
            window.addEventListener('beforeunload', this.sendDeletedMessage.bind(this));
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
        this.websocketT.send(message);
    }

    initFirstGame() {
        let player1Name = document.getElementById("player1").dataset.name;
        let player2Name = document.getElementById("player2").dataset.name;
        this.checkInterval = setInterval(() => {
            this.checkIfDisconnected(player1Name, player2Name);
        }, 1000);
        const ready1 = document.getElementById("ready-player-one");
        ready1.addEventListener('click', () => { 
            ready1.disabled = true;
            this.sendReadyMessage(1);
        });
        const ready2 = document.getElementById("ready-player-two");
        ready2.addEventListener('click', () => { 
            ready2.disabled = true;
            this.sendReadyMessage(2);
        });
        if (this.players['player1']) {
            this.playing = true;
            ready1.disabled = false;
            ready1.classList.remove("d-none");
        } else if (this.players['player2']) {
            this.playing = true;
            ready2.disabled = false;
            ready2.classList.remove("d-none");
        }
    }

    initSecondGame() {
        let player1Name = document.getElementById("player3").dataset.name;
        let player2Name = document.getElementById("player4").dataset.name;
        this.checkInterval = setInterval(() => {
            this.checkIfDisconnected(player1Name, player2Name);
        }, 1000);
        if (this.players['player3']) {
            this.playing = true;
            const ready1 = document.getElementById("ready-player-one");
            ready1.disabled = false;
            ready1.classList.remove("d-none");
        } else if (this.players['player4']) {
            this.playing = true;
            const ready2 = document.getElementById("ready-player-two");
            ready2.disabled = false;
            ready2.classList.remove("d-none");
        }
    }

    initFinal() {
        this.checkInterval = setInterval(() => {
            this.checkIfDisconnected(this.round1winner, this.round2winner);
        }, 1000);
        if (this.demiwinner && (this.players['player1'] || this.players['player2'])) {
            this.playing = true;
            const ready1 = document.getElementById("ready-player-one");
            ready1.disabled = false;
            ready1.classList.remove("d-none");
            // ready1.addEventListener('click', () => { 
            //     console.log(" number of click");
            //     ready1.disabled = true;
            //     this.sendReadyMessage(1);
            // });
        } else if (this.demiwinner && (this.players['player3'] || this.players['player4'])) {
            this.playing = true;
            const ready2 = document.getElementById("ready-player-two");
            ready2.disabled = false;
            ready2.classList.remove("d-none");
            // ready2.addEventListener('click', () => { 
            //     console.log(" number of click");
            //     ready2.disabled = true;
            //     this.sendReadyMessage(2);
            // });
        }
    }

    startTournament() {
        const tournamentContainer = document.getElementById("tournament-container");
        tournamentContainer.classList.add("d-none");
        const gameContainer = document.getElementById("gameT");
        gameContainer.classList.remove("d-none");
        if (this.round === 1) {
            const player1Name = document.getElementById("player1").dataset.name;
            const player2Name = document.getElementById("player2").dataset.name;
            if (this.checkIfDisconnected(player1Name, player2Name))
                return;
            const player1Display = document.getElementById("player1-name");
            const player2Display = document.getElementById("player2-name");
            player1Display.textContent = player1Name;
            player2Display.textContent = player2Name;
            player1Display.dataset.name = player1Name;
            player2Display.dataset.name = player2Name;
            player1Display.classList.remove("d-none");
            player2Display.classList.remove("d-none");
            this.initFirstGame();
        } else if (this.round === 2) {
            const player1Name = document.getElementById("player3").dataset.name;
            const player2Name = document.getElementById("player4").dataset.name;
            if (this.checkIfDisconnected(player1Name, player2Name))
                return;
            const player1Display = document.getElementById("player1-name");
            const player2Display = document.getElementById("player2-name");
            player1Display.textContent = player1Name;
            player2Display.textContent = player2Name;
            player1Display.dataset.name = player1Name;
            player2Display.dataset.name = player2Name;
            this.initSecondGame();
        } else if (this.round === 3) {
            const player1Display = document.getElementById("player1-name");
            const player2Display = document.getElementById("player2-name");
            if (this.checkIfDisconnected(this.round1winner, this.round2winner))
                return;
            player1Display.textContent = this.round1winner;
            player2Display.textContent = this.round2winner;
            player1Display.dataset.name = this.round1winner;
            player2Display.dataset.name = this.round2winner;
            this.initFinal();
        }
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
            button.removeEventListener('click', () => { this.sendStartMessage(); });
            button.addEventListener('click', () => { this.sendStartMessage(); });
        }
    }

    getGameId() {
        const player1Id = document.getElementById("player1").dataset.id;
        const player2Id = document.getElementById("player2").dataset.id;
        const smallerId = Math.min(player1Id, player2Id);
        const largerId = Math.max(player1Id, player2Id);
        const gameId = `${smallerId}${largerId}`;
        return (gameId);
    }

    gameReady(playerData) {
        console.log("game is ready to start");
        if (playerData === "1")
            this.ready1 = true;
        if (playerData === "2")
            this.ready2 = true;
        if (this.ready1 && this.ready2) {
            clearInterval(this.checkInterval);
            document.getElementById("ready-player-one").classList.add("d-none");
            document.getElementById("ready-player-two").classList.add("d-none");
        }
        if (this.round === 1) {
            if (this.ready1 && this.ready2 && this.players["player1"])
                startTournamentGame(this.playing, true, this.getGameId(), this.websocketT);
            else if (this.ready1 && this.ready2 && !this.players["player1"])
                startTournamentGame(this.playing, false, this.getGameId(), this.websocketT);
        } else if (this.round === 2){
            if (this.ready1 && this.ready2 && this.players["player3"])
                startTournamentGame(this.playing, true, this.getGameId(), this.websocketT);
            else if (this.ready1 && this.ready2 && !this.players["player3"])
                startTournamentGame(this.playing, false, this.getGameId(), this.websocketT);
        } else if (this.round === 3){
            if (this.ready1 && this.ready2 && this.demiwinner && (this.players["player1"] || this.players["player2"]))
                startTournamentGame(this.playing, true, this.getGameId(), this.websocketT);
            else if (this.ready1 && this.ready2)
                startTournamentGame(this.playing, false, this.getGameId(), this.websocketT);
        }
    }

    strikeNames(winner) {
        if (this.round === 2) {
            const player1 = document.getElementById("player1");
            const player2 = document.getElementById("player2");
            if (player1.dataset.name === winner)
                player2.classList.add("strike");
            else
                player1.classList.add("strike");
        } else if (this.round === 3) {
            const player3 = document.getElementById("player3");
            const player4 = document.getElementById("player4");
            if (player3.dataset.name === winner)
                player4.classList.add("strike");
            else
                player3.classList.add("strike");
        }
    }

    finishTournament(winner) {
        if (this.tournamentMaster) {
            deleteTournament();
            const navLinks = document.querySelectorAll('.nav__link');
            navLinks.forEach(link => {
            link.removeEventListener('click', this.navLinkClickHandler);
            });
        }
        document.getElementById("gameT").classList.add("d-none");
        document.getElementById("player-queue").classList.add("d-none");
        document.getElementById("spinner-container").classList.add("d-none");
        const tournamentMessage = document.getElementById("tournament-message");
        tournamentMessage.textContent = `${winner} is the tournament great winner !`;
        document.getElementById("tournament-container").classList.remove("d-none");
        this.resetTournament();
        this.websocketT.close();
        this.websocketT = null;
        setTimeout(() => {
            navigate("/tournament");
            alert("Tournament is finished");
        }, 100);
    }

    printResults(winner) {
        if (this.round === 3) {
            this.finishTournament(winner);
            return;
        }
        if (localStorage.getItem("username") === winner)
            this.demiwinner = true;
        this.playing = false;
        this.ready1 = false;
        this.ready2 = false;
        this.round++;
        document.getElementById("winner").innerText = "";
        document.getElementById("gameT").classList.add("d-none");
        document.getElementById("tournament-container").classList.remove("d-none");
        this.strikeNames(winner);
        const btnText = document.getElementById("queue-btn-text");
        const tournamentMessage = document.getElementById("tournament-message");
        if (this.round === 2) {
            this.round1winner = winner;
            btnText.textContent = 'Start the second game';
            tournamentMessage.textContent = `${winner} won the first round !`;
        } else if (this.round === 3) {
            this.round2winner = winner;
            btnText.textContent = 'Start the FINAL !';
            tournamentMessage.textContent = `${winner} won the second round !`;
        }
    }

    masterLeave() {
        document.getElementById("gameT").classList.add("d-none");
        document.getElementById("player-queue").classList.add("d-none");
        document.getElementById("spinner-container").classList.add("d-none");
        const tournamentMessage = document.getElementById("tournament-message");
        tournamentMessage.textContent = `Tournament creator leaved the tournament... Tournament is cancelled.\nReload or leave the page.`;
        document.getElementById("tournament-container").classList.remove("d-none");
        this.resetTournament();
        this.websocketT.close();
        this.websocketT = null;
        setTimeout(() => {
            navigate("/tournament");
            alert("Tournament is finished");
        }, 100);
    }

    resetTournament() {
        const playerSlot = document.querySelectorAll(".player-slot");
        for (let i = 0; i < playerSlot.length; i++) {
            if (playerSlot[i].textContent) {
                playerSlot[i].textContent = null;
                playerSlot[i].dataset.name = null;
                playerSlot[i].dataset.id = null;
            }
        }
    }

    enterTournament() {
        const serverIP = window.location.hostname;
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");
        this.checkIfLeave();
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
                    alert("Tournament is full!");
                }
                if (data.action === "tournament_started" && self.started === false) {
                    self.websocketT.close();
                    self.websocketT = null;
                    navigate("/tournament");
                    setTimeout(() => {
                        alert("Tournament already started!");
                    }, 50);
                }
                if (data.action === "not_full") {
                    self.initTournament(true);
                }
                if (data.action === "player_list") {
                    if (self.started) {
                        if (self.tournamentMaster)
                            self.websocketT.send(JSON.stringify({ "action": "tournament_started"}));
                    } else {
                        setTimeout(() => {
                            self.addPlayerToHTML(data.username, data.userId);
                        }, 50);
                    }
                }
                if (data.action === "leave") {
                    if (!self.started)
                        self.removeDisconnectedQueue(data.username);
                    else
                        self.playerDisconnected(data.username);
                }
                if (data.action === "ready") {
                    self.readyTournament();
                }
                if (data.action === "not_ready") {
                    if (self.tournamentMaster && !self.started) {
                        const button = document.getElementById("queue-btn");
                        button.disabled = true;
                        button.removeEventListener('click', () => { self.sendStartMessage(); });
                    }
                }
                if (data.action === "start_tournament") {
                    self.started = true;
                    self.startTournament();
                }
                if (data.action === "game_ready") {
                    console.log("game_ready websocket");
                    self.gameReady(data.player);
                }
                if (data.action === "result") {
                    setTimeout(() => {
                        self.printResults(data.winner);
                    }, 3000);
                }
                if (data.action === "master_leave") {
                    deleteTournament();
                    self.masterLeave();
                }
            };
            this.websocketT.onclose = (event) => {
                console.log("Tournament WebSocket connection closed", event);
            };
            this.websocketT.onerror = (error) => {
                console.error("WebSocket error:", error);
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

export async function eventDelete() {
    const creatorId = await checkTournamentExists();
    if (creatorId) {
        tournamentCreated(creatorId);
    } else {
        addTournamentEventListeners(getWebsocket())
    }
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
}

export function tournamentDeleted() {
    document.getElementById("join-tournament").remove();
    document.getElementById("start-tournament").classList.remove("d-none");
}

export function tournamentCreated(username) {
    if (document.getElementById("join-tournament"))
        document.getElementById("join-tournament").remove();
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
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
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