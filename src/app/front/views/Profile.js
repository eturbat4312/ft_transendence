import AbstractView from "./AbstractView.js";

export default class Profile extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
    }


    async getHtml() {
      return `
      <div class="container mt-3 centered">
      <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
          <div class="card-header text-center">
              <h2>Profile</h2>
          </div>
          <div class="card-body">
              <div class="text-center">
                  <img src="https://m.media-amazon.com/images/I/51G2Jr9BjOL._AC_UF1000,1000_QL80_.jpg" alt="Photo de profil" class="img-fluid rounded-circle" style="width: 150px; height: 150px;">
              </div>
  
              <div class="mt-3">
                  <h4 class="mb-0">Name</h4>
                  <p class="mb-2">Qwerty42</p>
              </div>
  
              <div class="mt-3">
                  <h4>Last games</h4>
                  <ul class="list-unstyled">
                      <li>Qwerty42 - Simon29 | 2 - 5</li>
                      <li>Qwerty42 - Mick | 5 - 3 </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
      `;
  }
}