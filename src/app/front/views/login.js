import AbstractView from "./AbstractView.js";



export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("login");
    }



    async getHtml() {
        return `
        <div class="background-section">
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
                                don't have an account? <a href="/signup" data-link>Sign Up here</a>
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
    async initialize() {


        // Render HTML
        document.getElementById("app").innerHTML = await this.getHtml();

        // Get login form
        const form = document.getElementById("login-form");
        console.log("initialized!!!");

        // Add submit handler
        form.addEventListener('submit', this.loginUser);

    }

    async loginUser(event) {

        event.preventDefault();
        console.log(this);

        const form = event.target;
        // console.log('Form Element:', form);

        // Log input values
        const inputs = form.elements;

        // for (let input of inputs) {
        //     console.log(input.name, ':', input.value);
        // }
        const formData = new FormData(form);
        // console.log(formData.get("username"));

        const searchParams = new URLSearchParams(formData);

        const redirect = (path) => {
            window.location = path;
        };


        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                body: searchParams,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.ok) {
                console.log('Login successful!');
                redirect('/dashboard');
            } else {
                console.log('Login failed!');
                console.log(response.statusText);
            }

        } catch (error) {
            console.log(error);
        }

    }

}

// document.addEventListener('DOMContentLoaded', () => {
//     const loginView = new LoginView();
//     loginView.initialize();
// });

