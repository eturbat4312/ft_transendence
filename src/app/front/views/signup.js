import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("signup");
    }

    async initialize() {
        // Get HTML
        const html = await this.getHtml();

        // Render HTML 
        document.getElementById("app").innerHTML = html;

        const form = document.getElementById("signup-form");
        if (form) {
            // Add submit listener
            form.addEventListener('submit', (event) => this.registerUser(event));
            console.log("initialized!!!");
        } else {
            console.error("Form element not found");
        }
    }

    async getHtml() {

        return `
            <div class="background-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center mt-5">Sign Up</h2>
                            <div class="card my-5">
                                <div class="card-body">
                                    <form id="signup-form">
                                        <div class="form-group">
                                            <label for="username">Username</label>
                                            <input type="text" class="form-control" name="username" placeholder="Enter username">
                                        </div>
                                        <div class="form-group">
                                            <label for="email">Email address</label>
                                            <input type="email" class="form-control" name="email" aria-describedby="emailHelp" placeholder="Enter email">
                                        </div>
                                        <div class="form-group">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" name="password" placeholder="Password">
                                        </div>
                                        <div class="form-group">
                                            <label for="confirmPassword">Confirm Password</label>
                                            <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm Password">
                                        </div>
                                        <button type="submit" class="btn btn-primary">Sign Up</button>
                                        <p class="mt-3">
                                            Already have an account? <a href="/login" data-link>Login here</a>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    async registerUser(event) {

        const form = event.target;
        console.log('Form Element:', form);

        // Log input values  
        const inputs = form.elements;

        for (let input of inputs) {
            console.log(input.name, ':', input.value);
        }
        const formData = new FormData(form);
        event.preventDefault();

        console.log("submit");



        const searchParams = new URLSearchParams(formData);
        console.log(searchParams.get("username"));



        try {
            // console.log("try");
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                body: searchParams,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.ok) {
                console.log('Registration successful!');
                this.redirect('/login');
            } else {
                console.log('Registration failed!');
                console.log(response.statusText);
            }

        } catch (error) {
            console.log(error);
        }
    }
}

// Create an instance of SignUpView
// document.addEventListener('DOMContentLoaded', () => {
//     const signUpView = new SignUpView();
//     signUpView.initialize();
// });
