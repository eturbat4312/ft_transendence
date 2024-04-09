"use strict";(self.webpackChunktranscendence=self.webpackChunktranscendence||[]).push([[451],{451:(n,t,e)=>{e.r(t),e.d(t,{default:()=>s});var a=e(397);class s extends a.default{constructor(n){super(n),this.setTitle("Settings")}async getHtml(){return`\n        <div class="container mt-3 centered">\n            <div class="card overflow-hidden mx-auto bg-dark text-light" style="max-width: 800px;">\n                <div class="card-header text-center">\n                    <h2>Settings</h2>\n                </div>\n                <div class="row no-gutters row-bordered row-border-light">\n                    <div class="col-md-3 pt-0">\n                        <div class="list-group list-group-flush account-settings-links">\n                            <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account-general">General</a>\n                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-change-password">Change password</a>\n                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-info">Info</a>\n                        </div>\n                    </div>\n                    <div class="col-md-9">\n                        <div class="tab-content" style="height: 500px; overflow-y: auto;">\n                            ${await this.profileSection()}\n                            ${this.changePasswordSection()}\n                            ${this.bioSection()}\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        `}async profileSection(){const n=await this.getProfilePicUrl();return await this.getUsername(),`\n        <div class="tab-pane fade active show" id="account-general">\n            <div class="card-body media align-items-center">\n                <img id="profilePic" src="${n}" alt="Photo de profil" class="img-fluid rounded-circle" style="width: 150px; height: 150px;"> \n                <div class="media-body ml-4">\n                    <label class="btn btn-outline-primary">\n                        Upload new photo\n                        <input type="file" class="account-settings-fileinput">\n                    </label> &nbsp;\n                </div>\n            </div>\n            <hr class="border-light m-0">\n            <div class="card-body">\n                <div class="form-group">\n                    <span id="username"></span>\n                </div>\n                 <div class="form-group">\n                    <label class="form-label">Nickname</label>\n                    <input id="Nickname" type="text" class="form-control mb-1" value="">\n                </div>\n                <div class="form-group">\n                    <label class="form-label">E-mail</label>\n                    <input id="email" type="text" class="form-control mb-1" value="">\n                </div>\n            </div>\n            <button type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save changes</button>&nbsp;\n        </div>\n        `}changePasswordSection(){return'\n    <div class="tab-pane fade" id="account-change-password">\n        <div class="card-body pb-2">\n            <div class="form-group">\n                <label class="form-label">Current password</label>\n                <input id="currentPasswordInput" type="password" class="form-control">\n            </div>\n            <div class="form-group">\n                <label class="form-label">New password</label>\n                <input id="newPasswordInput" type="password" class="form-control">\n            </div>\n            <div class="form-group">\n                <label class="form-label">Repeat new password</label>\n                <input id="repeatPasswordInput" type="password" class="form-control">\n            </div>\n            <button id="changePasswordButton" type="button" class="btn btn-primary">Change Password</button>\n            <div id="passwordChangeMessage"></div>\n        </div>\n    </div>\n    '}bioSection(){return'\n        <div class="tab-pane fade" id="account-info">\n            <div class="card-body pb-2">\n                <div class="form-group">\n                    <label class="form-label">Bio</label>\n                    <textarea class="form-control" rows="5"></textarea>\n                </div>\n            </div> \n            <button type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save changes</button>&nbsp;\n        </div>\n        '}async setInfo(){window.location.hostname,localStorage.getItem("token")||console.log("Token not found")}async getProfilePicUrl(){const n=window.location.hostname,t=localStorage.getItem("token");if(t)try{const e=await fetch(`https://${n}/api/get_profile_pic/`,{method:"GET",headers:{Authorization:"Token "+t}});return e.ok?(await e.json()).profile_pic_url:(console.log("Failed to get profile pic:",await e.text()),null)}catch(n){return console.log("Error:",n),null}else console.log("Token not found")}async getUsername(){const n=window.location.hostname,t=localStorage.getItem("token");if(t)try{const e=await fetch(`https://${n}/api/get_username/`,{method:"GET",headers:{Authorization:"Token "+t}});if(e.ok){const n=(await e.json()).username;document.getElementById("username").innerText="Username: "+n}else console.log("Failed to get username:",await e.text())}catch(n){console.log("Error:",n)}else console.log("Token not found")}}}}]);