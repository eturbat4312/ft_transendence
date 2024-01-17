import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("login");
    }

    async getHtml() {
        return `
            <h1>login</h1>
            <p>You are viewing the login page</p>
        `;
    }
}