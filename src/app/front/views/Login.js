import AbstractView from "./AbstractView.js";
import { getUsername, getUserId } from "../src/utils.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
        setTimeout(() => {
            this.initialize();
        }, 100);
    }

    async getHtml() {
        return `
        <div class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <h2 class="text-center mt-5">Login</h2>
                <div class="card my-5">
                    <div class="card-body">
                        <form id="login-form">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="username" class="form-control" name="username" aria-describedby="emailHelp" placeholder="Enter username">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" name="password" placeholder="Password">
                            </div>
                            <button type="submit" class="btn btn-primary">Login</button>
                            <p class="mt-3">
                                don't have an account? <a href="/signup" class="nav__link" data-link>Sign Up here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }
    
    async initialize() {

        const form = document.getElementById("login-form");

        form.addEventListener('submit', this.loginUser);

    }

    async loginUser(event) {

        const serverIP = window.location.hostname;

        event.preventDefault();


        const form = event.target;

        const formData = new FormData(form);

        try {
            const response = await fetch(`https://${serverIP}/api/login/`, {
                method: 'POST',
                body: formData
            });
            console.log("NTM: ", response);
            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                await getUsername();
                await getUserId();
                console.log('Login successful! Token:', token);
                window.location.href = '/home';
            } else {
                console.log('Login failed!');
                console.log(response.statusText);
				alert('Login failed!');
            }

        } catch (error) {
            console.log(error);
        }

    }

}
