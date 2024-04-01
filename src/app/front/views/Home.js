import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
        this.initialize().then(r => console.log('Home Info loaded'));
    }

    async getHtml() {
        return `
        <div class="card bg-dark text-light mx-auto" style="max-width: 800px;">
            <div class="card-header text-center">
                <h2>Profile</h2>
            </div>
            <div class="card-body">
                <img id="profilePic" src="" class="img-fluid rounded-circle" alt="Profile pic">
                <p class="card-text">
                   <span id="username"></span>
                </p>
                 <p class="card-text">
                   <span id="nickname"></span>
                </p>
                <p class="card-text">
                  <span id="email"></span>
                </p>
                <p class="card-text"> 
                   <span id="bio"></span>
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
`;
    }

    async initialize() {
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

        try {
            const responseNickname = await fetch(`https://${serverIP}/api/get_nickname/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (responseNickname.ok) {
                const userData = await responseNickname.json();
                const username = userData.username;
                document.getElementById('nickname').innerText = 'Nickname: ' + username;
            } else {
                console.log('Failed to get Nickname:', await responseNickname.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }

        try {
            const responseEmail = await fetch(`https://${serverIP}/api/get_email/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (responseEmail.ok) {
                const userData = await responseEmail.json();
                const email = userData.email;
                document.getElementById('email').innerText = 'Email: ' + email;
            } else {
                console.log('Failed to get email:', await responseEmail.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
        try {
            const responseBio = await fetch(`https://${serverIP}/api/get_bio/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (responseBio.ok) {
                const userData = await responseBio.json();
                const bio = userData.bio;
                document.getElementById('bio').innerText = 'Bio: ' + bio;
            } else {
                console.log('Failed to get bio:', await responseBio.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }

        try {
            const responseStats = await fetch(`https://${serverIP}/api/get_statistics/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (responseStats.ok) {
                const stats = await responseStats.json();
                document.getElementById('gamesPlayed').innerText = stats.gamesPlayed;
                document.getElementById('gamesWon').innerText = stats.gamesWon;
                document.getElementById('gamesLost').innerText = stats.gamesLost;
            } else {
                console.log('Failed to get statistics:', await responseStats.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
        await this.getProfilePic()
        await this.getMatchHistory()
    }

    async getProfilePic() {
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
                document.getElementById('profilePic').src = data.profile_pic_url;
            } else {
                console.log('Failed to get profile pic:', await response.text());
            }

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async getMatchHistory() {
        const serverIP = window.location.hostname;
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found');
            return;
        }

        try {
            const response = await fetch(`https://${serverIP}/api/get_match_history/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });

            if (response.ok) {
                const matchHistory = await response.json();
                const matchListElement = document.querySelector('.card-body ul.list-group');
                matchHistory.forEach(match => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item bg-secondary text-light';
                    listItem.innerHTML = `Played against <strong>${match.opponent}</strong> - Result: <strong>${match.result}</strong>`;
                    matchListElement.appendChild(listItem);
                });
            } else {
                console.log('Failed to get match history:', await response.text());
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
}
