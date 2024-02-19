import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
        return `
        <div class="container mt-3">
            <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            </div>
        </div>
        `;
    }
}
