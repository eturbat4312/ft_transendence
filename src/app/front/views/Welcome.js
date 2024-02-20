import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Welcome");
    }

    async getHtml() {
        return `
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 centered">
            <div class="card my-5 bg-dark">
                <div class="card-body">
                    <div class="d-flex flex-column align-items-center">
                        <p class="text-light fs-3 game-font">Welcome to</p>
                        <p class="pong-logo" href="#">PONG</p>
                        <a href="/login" class="btn btn-primary mb-3 btn-lg-width nav__link" style="font-family: 'Press Start 2P', cursive;" data-link>Login</a>     
                        <a href="/signup" class="btn btn-outline-primary btn-lg-width nav__link" style="font-family: 'Press Start 2P', cursive;" data-link>Register</a>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
}
