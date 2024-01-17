import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("landing");
    }

    async getHtml() {
        return `
    <div class="background-section">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Transcendence</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/login" data-link>LOGIN</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/signup" data-link>SIGN UP</a>
                </li>
            </ul>
        </div>
        </nav>
    </div>
        `;
    }
}