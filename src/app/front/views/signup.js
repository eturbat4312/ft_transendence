import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("signup");
    }

    async getHtml() {
        return `
            <h1>signup</h1>
            <p>You are viewing the signup page</p>
        `;
    }
}