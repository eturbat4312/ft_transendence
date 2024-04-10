const getProfilePicUrl = async () => {
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
};


const getNav = async () => {
    const profilePicUrl = await getProfilePicUrl();
    const profilePic = profilePicUrl ? `<img src="${profilePicUrl}" alt="Profile pic" class="rounded-circle" style="width: 30px; height: 30px;">` : 'PP';
        return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="z-index: 3;">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse d-lg-flex" id="navbarSupportedContent" style="z-index: 1;">
                    <a class="navbar-brand col-lg-3 me-0 pong-title" href="#">PXNG</a>
                    <ul class="navbar-nav col-lg-6 justify-content-lg-center">
                        <li class="nav-item">
                            <a href="/home" class="nav__link nav-link active" data-link>Home</a>
                        </li>
                        <li class="nav-item">
                            <a href="/game" class="nav__link nav-link active" data-link>Game</a>
                        </li>
                        <li class="nav-item">
                            <a href="/tournament" id="tournament" class="nav__link nav-link active" data-link>Tournament</a>
                        </li>
                        <li class="nav-item">
                            <a href="/about" class="nav__link nav-link active" data-link>About</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav col-lg-3 justify-content-lg-end">
                        <li class="nav-item dropdown">
                            <a class="dropdown-toggle nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                             ${profilePic}
                            </a>
                            <ul class="dropdown-menu" style>
                            <li><a href="/home" class="nav__link dropdown-item" data-link>View my Profile </a></li>
                            <li><a href="/settings" class="nav__link dropdown-item" data-link>Settings</a></li>
                            <li><a href="#" id="logout" class="dropdown-item" data-link>Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>    
    </nav>
        `;
};

const getSocial = async () => {
    return `
    <div class="modal fade" id="friendModal" tabindex="-1" aria-labelledby="friendModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="friendModalLabel">Friend</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="friendModalBody">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="playerModal" tabindex="-1" aria-labelledby="playerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="playerModalLabel">Player</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="playerModalBody">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="player-bar" class="player-bar bg-dark">
        <h2>Social</h2>
            <div id="player-list-container" class="container">
                <p>Friends</p>
                <ul id="friend-list" class="player-list"></ul>
                <p>Players</p>
                <ul id="player-list" class="player-list"></ul>
            </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#friendRequestsModal">
            Friends Requests
        </button>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#blockedModal">
            Blocked list
        </button>
    </div>
    <div class="modal fade" id="friendRequestsModal" tabindex="-1" aria-labelledby="friendRequestsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="friendRequestsModalLabel">Friends Requests</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="friendRequestsModalBody">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="blockedModal" tabindex="-1" aria-labelledby="blockedModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="blockedModalLabel">Blocked list</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="blockedModalBody">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
};

const getChat = async () => {
    return `
    <div class="offcanvas offcanvas-start bg-dark text-light" data-bs-backdrop="false" id="offcanvasChat" style="top: 56px; z-index: 0;">
        <button class="btn btn-dark offcanvas-btn mt-2 position-absolute btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasChat">
            <span><i class="fa-solid fa-chevron-right"></i></span><span><i class="fa-solid fa-chevron-left"></i></span>
        </button>
        <button id="start-chat" class="btn btn-success btn-chat-connect btn-lg">Join Chat</button>
        <div class="chat-container" style="z-index: 1; display: none;">
            <div class="chat-box">
                <div id="messages" class="chat-messages">
                </div>
            </div>
            <div class="input-group mb-3" style="position: absolute; bottom: 0; left: 0; width: calc(100% - 20px);">
                <input type="text" class="form-control" id="messageInput" placeholder="Type your message...">
                <button class="btn btn-primary btn-chat-send" type="button" id="sendMessageBtn">Send</button>
            </div>
        </div>
    </div>
    `;
};

const handleLogout = async () => {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`https://${serverIP}/api/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('userId');
                window.location.href = '/';
            } else {
                console.log('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    } else {
        console.log('No token found');
    }
}

export { getNav, getSocial, getChat, handleLogout };