import AbstractView from "./AbstractView.js";

export default class Settings extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        //this.setInfo().then(r => console.log('Settings Info loaded'))
    }

    async getHtml() {
        const profileSection = await this.profileSection();
        const changePasswordSection = this.changePasswordSection();
        const bioSection = this.bioSection();

        return `
        <div class="container mt-3 centered">
            <div class="card overflow-hidden mx-auto bg-dark text-light" style="max-width: 800px;">
                <div class="card-header text-center">
                    <h2>Settings</h2>
                </div>
                <div class="row no-gutters row-bordered row-border-light">
                    <div class="col-md-3 pt-0">
                        <div class="list-group list-group-flush account-settings-links">
                            <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#account-general">General</a>
                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-change-password">Change password</a>
                            <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#account-info">Info</a>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="tab-content" style="height: 500px; overflow-y: auto;">
                            ${profileSection}
                            ${changePasswordSection}
                            ${bioSection}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    async profileSection() {
        const profilePicUrl = await this.getProfilePicUrl();
        const userName = await this.getUsername();
        return `
        <div class="tab-pane fade active show" id="account-general">
            <div class="card-body media align-items-center">
                <img id="profilePic" src="${profilePicUrl}" alt="Photo de profil" class="img-fluid rounded-circle" style="width: 150px; height: 150px;"> 
                <div class="media-body ml-4">
                    <label class="btn btn-outline-primary">
                        Upload new photo
                        <input type="file" class="account-settings-fileinput">
                    </label> &nbsp;
                </div>
            </div>
            <hr class="border-light m-0">
            <div class="card-body">
                <div class="form-group">
                    <span id="username"></span>
                </div>
                 <div class="form-group">
                    <label class="form-label">Username</label>
                    <input id="Username" type="text" class="form-control mb-1" value="">
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input id="email" type="text" class="form-control mb-1" value="">
                </div>
            </div>
            <button type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save changes</button>&nbsp;
        </div>
        `;
    }

    changePasswordSection() {
        return `
    <div class="tab-pane fade" id="account-change-password">
        <div class="card-body pb-2">
            <div class="form-group">
                <label class="form-label">Current password</label>
                <input id="currentPasswordInput" type="password" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">New password</label>
                <input id="newPasswordInput" type="password" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">Repeat new password</label>
                <input id="repeatPasswordInput" type="password" class="form-control">
            </div>
            <button id="changePasswordButton" type="button" class="btn btn-primary">Change Password</button>
            <div id="passwordChangeMessage"></div>
        </div>
    </div>
    `;
    }

    bioSection() {
        return `
        <div class="tab-pane fade" id="account-info">
            <div class="card-body pb-2">
                <div class="form-group">
                    <label class="form-label">Bio</label>
                    <textarea class="form-control" rows="5"></textarea>
                </div>
            </div> 
            <button type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save changes</button>&nbsp;
        </div>
        `;
    }

    async setInfo() {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }


    }

    async getProfilePicUrl() {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/get_profile_pic/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.profile_pic_url;
            } else {
                console.log('Failed to get profile pic:', await response.text());
                return null;
            }

        } catch (error) {
            console.log('Error:', error);
            return null;
        }
    }

    async getUsername ()    {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const responseUsername = await fetch(`https://${serverIP}/api/get_username/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (responseUsername.ok) {
                const userData = await responseUsername.json();
                const username = userData.username;
                document.getElementById('username').innerText = 'Username: ' + username;
            } else {
                console.log('Failed to get username:', await responseUsername.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }
}
