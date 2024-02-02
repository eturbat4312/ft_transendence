import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("About");
    }

    async getHtml() {
        return `
        <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h1 class="text-center">About FT_TRANSCENDENCE</h1>
                <p>
                    Welcome to the About page of our website! This is the last project of the 42 common core.
                </p>
                <p>
                    <strong>Features:</strong>
                    <ul>
                        <li>Classic Pong gameplay</li>
                        <li>Responsive design for various screen sizes</li>
                        <li>Customizable settings</li>
                        <li>Multiplayer mode</li>
                        <li>Global chat and private chat</li>
                        <li>Tournament mode</li>
                        <li>Social space</li>
                    </ul>
                </p>
                <p>
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