import AbstractView from "./AbstractView.js";
import bg from '../images/bg.jpg';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Welcome");
    }

    async getHtml() {
        const bgStyle = `background-image: url(${bg});
                        background-size: cover;
                        background-position: center;`;

        return `
            <body style="${bgStyle}">
                <div class="container">
                    <div class="content">
                        <h1>Welcome to Ping Pong Game</h1>
                        <button id="loginBtn">Log in</button>
                        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                    </div>
                </div>
            </body>
        `;
    }

    async initialize() {
        // Call the parent class method to initialize
        super.initialize();

        // Add event listener to the "Log in" button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                // Redirect to the login page
                window.location.href = '/login';
            });
        }
    }
}
