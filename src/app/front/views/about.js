import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("About");
    }

    async getHtml() {
        return `
        <div class="container mt-3">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            <div class="card-header text-center">
                <h2>About FT_TRANSCENDENCE</h2>
            </div>
            <div class="card-body">
                <p class="card-text">
                    Welcome to the About page of our website! This is the last project of the 42 common core.
                </p>
                <p class="card-text">
                    <strong>Features:</strong>
                    <ul>
                        <li>Classic Pong gameplay</li>
                        <li>Customizable settings</li>
                        <li>Multiplayer mode</li>
                        <li>Global chat and private chat</li>
                        <li>Tournament mode</li>
                        <li>Social space</li>
                    </ul>
                </p>
                <p class="card-text">
                    <strong>About the Team:</strong>
                    <br>
                    We are a team of 3 students from 42 Lausanne.
                    <ul>
                        <li><a href="https://github.com/blaisek" class="btn btn-link" role="button" target="_blank">btchiman</a></li>
                        <li><a href="https://github.com/porgito" class="btn btn-link" role="button" target="_blank">jlaurent</a></li>
                        <li><a href="https://github.com/eturbat4312" class="btn btn-link" role="button" target="_blank">eturbat</a></li>
                    </ul>
                </p>
            </div>
        </div>
    </div>
    
        `;
    }
}