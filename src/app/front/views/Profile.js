import AbstractView from "./AbstractView.js";

export default class Profile extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
    }

    async getHtml() {
        return `
  <div class="container mt-3 centered">
    <div class="row" style="max-width: calc(100% - 200px);">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img id="profilePic" src="" alt="Profile pic" class="rounded-circle img-fluid" style="width: 150px;">
            <p class="text-muted mb-1">Player</p>
          </div>
        </div>
        <div class="card mb-4 mb-lg-0">
          <div class="card-body">
            <p class="mb-4">
                Pong Games Played: <span id="pong-gamesPlayed"></span>
            </p>
            <p class="mb-4">
                Pong Games Won: <span id="pong-gamesWon"></span>
            </p>
            <p class="mb-4">
                Pong Games Lost: <span id="pong-gamesLost"></span>
            </p>
            <hr>
            <p class="mb-4">
                TTT Games Played: <span id="tic-gamesPlayed"></span>
            </p>
            <p class="mb-4">
                TTT Games Won: <span id="tic-gamesWon"></span>
            </p>
            <p class="mb-4">
                TTT Tie Games: <span id="tic-gamesDraw"></span>
            </p>
            <p class="mb-4">
                TTT Games Lost: <span id="tic-gamesLost"></span>
            </p>
            <p class="mb-4">
                TTT Rank: <span id="tic-elo"></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Username</p>
              </div>
              <div class="col-sm-9">
                <p id="profile-username" class="text-muted mb-0"></p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <p id="profile-email" class="text-muted mb-0">test@example.com</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Bio</p>
              </div>
              <div class="col-sm-9">
                <p id="profile-bio" class="text-muted mb-0">bio</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-4 mb-md-0">
              <div class="card-body">
                <p class="mb-4">PONG HISTORY</p>
                <ul id="pong-history" class="list-group">
                
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card mb-4 mb-md-0">
              <div class="card-body">
                <p class="mb-4">TIC-TAC-TOE HISTORY</p>
                <ul id="tic-history" class="list-group">
                
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        `;
    }
}
