import AbstractView from "./AbstractView.js";

export default class Profile extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
    }

    async getHtml() {
        return `
        <div id="profile-container" class="container mt-3 centered">
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
        <div class="card-header text-center">
            <h2>Profile</h2>
        </div>
        <div class="card-body">
            <img id="profilePic" src="" class="img-fluid rounded-circle" alt="Profile pic">
            <p class="card-text">
               <span id="profile-username"></span>
            </p>
            <p class="card-text">
              <span id="profile-email"></span>
            </p>
            <p class="card-text"> 
               <span id="profile-bio"></span>
            </p>
        </div>
    </div>
    <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
        <div class="card-header text-center">
            <h2>Statistics</h2>
        </div>
        <div class="card-body">
            <p class="card-text">
                Games Played: <span id="gamesPlayed"></span>
            </p>
            <p class="card-text">
                Games Won: <span id="gamesWon"></span>
            </p>
            <p class="card-text">
                Games Lost: <span id="gamesLost"></span>
            </p>
        </div>
    </div>
    <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
        <div class="card-header text-center">
            <h2>Match History</h2>
        </div>
        <div class="card-body">
            <ul class="list-group">
                
            </ul>
        </div>
    </div>             
    </div>
        `;
    }
}
