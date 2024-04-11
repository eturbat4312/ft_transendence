// views/NotFound.js
import AbstractView from "./AbstractView.js";

export default class NotFound extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("404 - Page not found");
    }

    async getHtml() {
        return `
            <h1>404</h1>
            <p>Page not found. test</p>
        `;
    }
}
