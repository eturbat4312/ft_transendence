"use strict";(self.webpackChunktranscendence=self.webpackChunktranscendence||[]).push([[451],{9451:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});var o=n(5397);class a extends o.default{constructor(e){super(e),this.setTitle("Settings"),setTimeout((()=>{this.initialize()}),100)}async getHtml(){return`\n        <div class="container mt-3 centered">\n            <div class="card overflow-hidden mx-auto bg-dark text-light" style="max-width: 800px;">\n                <div class="card-header text-center">\n                    <h2>Settings</h2>\n                </div>\n                <div class="row no-gutters row-bordered row-border-light">\n                    <div class="col-md-3 pt-0">\n                        <div class="list-group list-group-flush account-settings-links">\n                            <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account-general">General</a>\n                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-change-password">Change password</a>\n                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-info">Info</a>\n                        </div>\n                    </div>\n                    <div class="col-md-9">\n                        <div class="tab-content" style="height: 500px; overflow-y: auto;">\n                            ${await this.profileSection()}\n                            ${this.changePasswordSection()}\n                            ${this.bioSection()}\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        `}async profileSection(){return'\n        <div class="tab-pane fade active show" id="account-general">\n            <div class="card-body media align-items-center">\n                <div class="media-body ml-4">\n                    <label class="btn btn-outline-primary">\n                        Upload new photo\n                        <input type="file" class="account-settings-fileinput">\n                    </label>\n                    <button id="savePhoto" type="button"  class="btn btn-primary">Save photo</button>&nbsp;\n                </div>\n            </div>\n            <hr class="border-light m-0">\n            <div class="card-body">\n                 <div class="form-group">\n                    <label class="form-label">Username</label>\n                    <input id="Username" type="text" class="form-control mb-1" value="">\n                    <button id="saveUsername" type="button"  class="btn btn-primary">Save username</button>&nbsp;\n                </div>\n                <div class="form-group">\n                    <label class="form-label">E-mail</label>\n                    <input id="email" type="text" class="form-control mb-1" value="">\n                    <button id="saveEmail" type="button"  class="btn btn-primary">Save email</button>&nbsp;\n                </div>\n            </div>\n        </div>\n        '}changePasswordSection(){return'\n    <div class="tab-pane fade" id="account-change-password">\n        <div class="card-body pb-2">\n            <div class="form-group">\n                <label class="form-label">Current password</label>\n                <input id="currentPasswordInput" type="password" class="form-control">\n            </div>\n            <div class="form-group">\n                <label class="form-label">New password</label>\n                <input id="newPasswordInput" type="password" class="form-control">\n            </div>\n            <div class="form-group">\n                <label class="form-label">Repeat new password</label>\n                <input id="repeatPasswordInput" type="password" class="form-control">\n            </div>\n            <button id="changePasswordButton" type="button" class="btn btn-primary">Change Password</button>\n            <div id="passwordChangeMessage"></div>\n        </div>\n    </div>\n    '}bioSection(){return'\n        <div class="tab-pane fade" id="account-info">\n            <div class="card-body pb-2">\n                <div class="form-group">\n                    <label class="form-label">Bio</label>\n                    <textarea class="form-control" rows="5"></textarea>\n                </div>\n            </div> \n            <button id="saveBio" type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save Bio</button>&nbsp;\n        </div>\n        '}async initialize(){document.getElementById("saveUsername").addEventListener("click",(()=>this.updateUsername())),document.getElementById("saveEmail").addEventListener("click",(()=>this.updateEmail())),document.getElementById("savePhoto").addEventListener("click",(()=>this.updateProfilePic())),document.getElementById("changePasswordButton").addEventListener("click",(()=>this.changePassword())),document.getElementById("saveBio").addEventListener("click",(()=>this.updateBio()))}async updateUsername(){const e=document.getElementById("Username").value,t=window.location.hostname,n=localStorage.getItem("token");if(n)try{const o=await fetch(`https://${t}/api/update_username/`,{method:"POST",headers:{Authorization:"Token "+n,"Content-Type":"application/json"},body:JSON.stringify({username:e})});o.ok?console.log("Username updated"):console.log("Failed to update username:",await o.text())}catch(e){console.log("Error:",e)}else console.log("Token not found")}async updateEmail(){const e=document.getElementById("email").value,t=window.location.hostname,n=localStorage.getItem("token");if(n)try{const o=await fetch(`https://${t}/api/update_email/`,{method:"POST",headers:{Authorization:"Token "+n,"Content-Type":"application/json"},body:JSON.stringify({email:e})});o.ok?console.log("Email updated"):console.log("Failed to update email:",await o.text())}catch(e){console.log("Error:",e)}else console.log("Token not found")}async updateProfilePic(){const e=window.location.hostname,t=localStorage.getItem("token");if(!t)return void console.log("Token not found");const n=document.querySelector(".account-settings-fileinput"),o=new FormData;o.append("file",n.files[0]);try{const n=await fetch(`https://${e}/api/update_profile_pic/`,{method:"POST",headers:{Authorization:"Token "+t},body:o});n.ok?console.log("Profile picture updated"):console.log("Failed to update profile picture:",await n.text())}catch(e){console.log("Error:",e)}}async changePassword(){const e=document.getElementById("currentPasswordInput").value,t=document.getElementById("newPasswordInput").value,n=document.getElementById("repeatPasswordInput").value,o=window.location.hostname,a=localStorage.getItem("token");if(a)if(t===n)try{(await fetch(`https://${o}/api/change_password/`,{method:"POST",headers:{Authorization:"Token "+a,"Content-Type":"application/json"},body:JSON.stringify({current_password:e,new_password:t})})).ok?document.getElementById("passwordChangeMessage").innerText="Password changed":document.getElementById("passwordChangeMessage").innerText="Failed to change password"}catch(e){console.log("Error:",e)}else document.getElementById("passwordChangeMessage").innerText="Passwords do not match";else console.log("Token not found")}async updateBio(){const e=document.querySelector(".form-control").value,t=window.location.hostname,n=localStorage.getItem("token");if(n)try{const o=await fetch(`https://${t}/api/update_bio/`,{method:"POST",headers:{Authorization:"Token "+n,"Content-Type":"application/json"},body:JSON.stringify({bio:e})});o.ok?console.log("Bio updated"):console.log("Failed to update bio:",await o.text())}catch(e){console.log("Error:",e)}else console.log("Token not found")}}}}]);