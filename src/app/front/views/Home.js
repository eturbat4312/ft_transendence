import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");

        this.handleLogout = this.handleLogout.bind(this);
    }

    async getHtml() {
        return `
        <div class="container mt-3 centered">
            <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
                <button id="logout">Logout</button>
            </div>
        </div>
        `;
    }

    async initialize() {
        document.getElementById('logout').addEventListener('click', this.handleLogout);
    }

    async handleLogout() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const response = await fetch('http://localhost:8000/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Include any necessary data for the logout request
                    // For example: user ID, session token, etc.
                })
            });

            if (response.ok) {
                this.redirect('/login');
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }
}    