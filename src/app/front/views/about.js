import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("about");
    }

    async getHtml() {
        return `
            <h1>about</h1>
            <p>You are viewing about page</p>
        `;
    }
}