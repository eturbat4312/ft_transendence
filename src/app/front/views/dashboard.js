import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("dashboard");
    }

    async getHtml() {
        return `
            <h1>dashboard</h1>
            <p>You are viewing the dashboard page</p>
        `;
    }
}