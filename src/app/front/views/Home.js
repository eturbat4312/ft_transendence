import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
        return `
        <div class="container mt-3 centered">
            <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
                <button id="token">TOKEN</button>
                <div id="username"></div>
            </div>
        </div>
        `;
    }

     async initialize() {
         document.getElementById('token').addEventListener('click', this.tokentest);
     }

    async tokentest() {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            console.log('Token not found');
            return;
        }
    
        try {
            const response = await fetch('http://' + serverIP + ':8000/api/get_username/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                const username = data.username;
                console.log('Username:', username);
                document.getElementById('username').innerText = 'Username: ' + username;
            } else {
                console.log('Failed to get username:', await response.text());
            }
    
        } catch (error) {
            console.log('Error:', error);
        }
    }
}