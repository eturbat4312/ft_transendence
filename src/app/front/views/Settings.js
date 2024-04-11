import AbstractView from "./AbstractView.js";

export default class Settings extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
        setTimeout(() => {
            this.initialize();
        }, 100);
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
        return `
        <div class="tab-pane fade active show" id="account-general">
            <div class="card-body media align-items-center">
                <div class="media-body ml-4">
                    <label class="btn btn-outline-primary">
                        Upload new photo
                        <input type="file" class="account-settings-fileinput">
                    </label>
                    <button id="savePhoto" type="button"  class="btn btn-primary">Save photo</button>&nbsp;
                </div>
            </div>
            <hr class="border-light m-0">
            <div class="card-body">
                 <div class="form-group">
                    <label class="form-label">Username</label>
                    <input id="Username" type="text" class="form-control mb-1" value="">
                    <button id="saveUsername" type="button"  class="btn btn-primary">Save username</button>&nbsp;
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input id="email" type="text" class="form-control mb-1" value="">
                    <button id="saveEmail" type="button"  class="btn btn-primary">Save email</button>&nbsp;
                </div>
            </div>
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
            <button id="saveBio" type="button" style="bottom: 0; left: 0;" class="btn btn-primary">Save Bio</button>&nbsp;
        </div>
        `;
    }

    async initialize() {
        document.getElementById('saveUsername').addEventListener('click', () => this.updateUsername());
        document.getElementById('saveEmail').addEventListener('click', () => this.updateEmail());
        document.getElementById('savePhoto').addEventListener('click', () => this.updateProfilePic());
        document.getElementById('changePasswordButton').addEventListener('click', () => this.changePassword());
        document.getElementById('saveBio').addEventListener('click', () => this.updateBio());
    }

    async updateUsername() {
        const username = document.getElementById('Username').value;
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/update_username/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                console.log('Username updated');
            } else {
                console.log('Failed to update username:', await response.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async updateEmail() {
        const email = document.getElementById('email').value;
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/update_email/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                console.log('Email updated');
            } else {
                console.log('Failed to update email:', await response.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async updateProfilePic() {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        const fileInput = document.querySelector('.account-settings-fileinput');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch(`https://${serverIP}/api/update_profile_pic/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token
                },
                body: formData
            });

            if (response.ok) {
                console.log('Profile picture updated');
            } else {
                console.log('Failed to update profile picture:', await response.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPasswordInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const repeatPassword = document.getElementById('repeatPasswordInput').value;
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        if (newPassword !== repeatPassword) {
            document.getElementById('passwordChangeMessage').innerText = 'Passwords do not match';
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/change_password/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            });

            if (response.ok) {
                document.getElementById('passwordChangeMessage').innerText = 'Password changed';
            } else {
                document.getElementById('passwordChangeMessage').innerText = 'Failed to change password';
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async updateBio() {
        const bio = document.querySelector('.form-control').value;
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/update_bio/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio: bio })
            });

            if (response.ok) {
                console.log('Bio updated');
            } else {
                console.log('Failed to update bio:', await response.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

}
