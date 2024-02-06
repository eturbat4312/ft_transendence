import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
    }

    async getHtml() {
        return `
        <div class="container mt-3">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            <div class="card-header text-center">
                <h2>Tournament</h2>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h4>Choose Tournament Type</h4>
                    <div class="btn-group" role="group" aria-label="Tournament Type">
                    <button type="button" class="btn btn-primary btn-4players">4 Players Tournament</button>
                    <button type="button" class="btn btn-primary btn-8players">8 Players Tournament</button>
                </div>
                </div>
                <div class="text-center mt-3">
                    <button type="button" class="btn btn-success btn-matchmaking" id="joinMatchmakingBtn" disabled>Join Matchmaking</button>
                </div>
                <div id="tournamentInfo" class="text-center">
                </div>
            </div>
        </div>
    </div>
        `;
    }
}