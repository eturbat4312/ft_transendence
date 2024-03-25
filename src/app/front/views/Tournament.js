import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
        this.tournamentStarted = false;
        this.playersJoined = 0;
        this.maxPlayers = 4;
    }

    async getHtml() {
        return `
        <div class="container mt-3 centered">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            <div class="card-header text-center">
                <h2>Tournament</h2>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h4>Choose Tournament Type</h4>
                    <div id="btn-group" class="btn-group" role="group" aria-label="Tournament Type">
                        <button id="start-tournament" type="button" class="btn btn-primary btn-4players">Start 4 Players Tournament</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }
}

async function startTournament(websocket) {
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

export function addTournamentEventListeners(websocket) {
    const startBtn = document.getElementById("start-tournament");
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startTournament(websocket);
        });
    }
}

export function tournamentCreated(username) {
    document.getElementById("start-tournament").remove();
    const joinTournamentBtn = document.createElement("button");
    joinTournamentBtn.classList.add("btn", "btn-primary", "button-font");
    joinTournamentBtn.textContent = "Join " + username + "'s Tournament";
    joinTournamentBtn.id = "join-tournament";
    const btnContainer = document.getElementById("btn-group");
    btnContainer.appendChild(joinTournamentBtn);
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