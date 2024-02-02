import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Landing");
    }

    async getHtml() {
        return `
        <div id="game" class="container-fluid">
        <div class="game-container">
           <div id="center-line"></div>
           <div class="ball"></div>
           <div class="paddle" id="paddle1"></div>
           <div class="paddle" id="paddle2"></div>
           <div id="countdown" class="countdown-display"></div>
           <button class="btn btn-primary btn-start" style="z-index: 1;">Start</button>
           <div id="score">
              <span id="player1-score" class="score">0</span>
              <span id="player2-score" class="score">0</span>
           </div>
           <div id="winner"></div>       
        </div>   
     </div>
        `;
    }
}