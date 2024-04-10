import { getNav, getSocial, getChat, handleLogout } from '../views/utils.js';
import { eventDelete, addTournamentEventListeners, tournamentCreated, checkTournamentExists } from '../views/Tournament.js';
import { addGameEventListeners, initPrivateGame } from '../views/Game.js';
import { addChatEventListeners } from './utils.js';
import { updateConnectedPlayer, removeDisconnectedPlayer, showToast, showGameInvitationNotification, updateFriendRequestsModal, getFriends, updateBlockedModal, addToPlayersPlaying, removeFromPlayersPlaying, checkPlaying } from './friendModal.js';
import '../theme/base.css'
import '../theme/game.css'
import '../theme/index.css'
import '../theme/style.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

var websocket = null;

const routes = [
    { path: "/", view: "Welcome" },
    { path: "/home", view: "Home" },
    { path: "/profile", view: "Profile" },
    { path: "/login", view: "Login" },
    { path: "/signup", view: "Signup" },
    { path: "/game", view: "Game" },
    { path: "/tournament", view: "Tournament" },
    { path: "/about", view: "About" },
    { path: "/settings", view: "Settings" },
    { path: "/already-connected", view: "AlreadyConnected"}
];

const isAuthenticated = async () => {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`https://${serverIP}/api/verify_token/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

const viewsNotRequiringAuthentication = ['Welcome', 'Login', 'Signup'];

const viewRequiresAuthentication = (view) => {
    return !viewsNotRequiringAuthentication.includes(view);
};

const loadView = async (path) => {
    const { view } = routes.find(route => route.path === path) || {};
    const requiresAuthentication = viewRequiresAuthentication(view);
    const auth = await isAuthenticated();
    if (requiresAuthentication && !auth) {
        navigate('/');
        return;
    }
    if (!requiresAuthentication && auth) {
        navigate('/home');
        return;
    }
    if (view) {
        import(`../views/${view}.js`).then(module => {
            const View = module.default;
            const viewInstance = new View();
            viewInstance.getHtml().then(html => {
                document.querySelector('#app').innerHTML = html;
                viewInstance.initialize();
                if (path === '/game') {
                    addGameEventListeners();
                }
                if (path === '/tournament') {
                    eventDelete();
                }
                if (!requiresAuthentication) {
                    addNavEventListeners();
                }
            });
        }).catch(error => {
            console.error('Error loading view:', error);
            document.querySelector('#app').innerHTML = 'Error loading view';
        });
    } else {
        import(`../views/NotFound.js`).then(module => {
            const View = module.default;
            const viewInstance = new View();
            viewInstance.getHtml().then(html => {
                document.querySelector('#app').innerHTML = html;
                viewInstance.initialize();
            });
        }).catch(error => {
            console.error('Error loading view:', error);
            document.querySelector('#app').innerHTML = 'Error loading view';
        });
    }
};

const loadComponents = async () => {
    const currentPath = location.pathname;
    const auth =  await isAuthenticated();

    if (currentPath === "/already-connected")
        return;
    if (auth) {
        const navHTML = await getNav(currentPath);
        document.querySelector("#nav").innerHTML = navHTML;

        const chatHTML = await getChat(currentPath);
        document.querySelector("#chat").innerHTML = chatHTML;

        const socialHTML = await getSocial(currentPath);
        document.querySelector("#social").innerHTML = socialHTML;
    }
    addNavEventListeners();
};

const navLinkClickHandler = (event) => {
    console.log("page:", event.currentTarget.getAttribute('href'));
    event.preventDefault();
    const path = event.currentTarget.getAttribute('href');
    navigate(path);
};

export const addNavEventListeners = () => {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.removeEventListener('click', navLinkClickHandler);
        link.addEventListener('click', navLinkClickHandler);
    });
    const logout = document.getElementById('logout');
    if (logout) {
        logout.addEventListener('click', (event) => {
            handleLogout();
        })
    }
};

const navigate = (path) => {
    history.pushState({}, "", path);
    loadView(path);
};

window.addEventListener('popstate', () => {
    loadView(location.pathname);
});

export function getWebsocket() {
    return (websocket);
}

function setInGameStatus(friendId) {
    const statusIcon = document.getElementById(friendId);
    if (statusIcon) {
        statusIcon.classList.remove("online");
        statusIcon.classList.add("in-game");
    }
}

const checkIfConnected = async () => {
    const auth = await isAuthenticated();
    if (!auth)
        return;
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    console.log("my userId: ", userId);
    const serverIP = window.location.hostname;
    websocket = new WebSocket(`wss://${serverIP}/api/ws/connect/`);
    websocket.onopen = () => {
        console.log("Connect WebSocket connection established");
        const message = JSON.stringify({ action: 'connect', username: username, userId: userId });
        websocket.send(message);
    }
    updateFriendRequestsModal(websocket);
    getFriends(websocket);
    updateBlockedModal();
    websocket.onclose = function(event) {
        console.log('Connect WebSocket closed');
    }
    websocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.action === 'error') {
            window.location = "/already-connected";
            websocket.close();
        }
        if (data.action === "connected") {
            updateConnectedPlayer(data.username, data.userId, true, websocket);
            checkPlaying(userId, websocket);
            //console.log("username: ", data.username, " userid: ", data.userId);
            // const message = JSON.stringify({ action: 'connected_player', username: username });
            // websocket.send(message);
        }
        if (data.action === "disconnected") {
            removeDisconnectedPlayer(data.username);
            removeFromPlayersPlaying(data.user_id);
            getFriends(websocket);
        }
        if (data.action === "friend_request" && data.to_user_id === userId) {
            showToast(data.username + " sent you a friend request !", websocket, data.username);
        }
        if (data.action === "update_friends" && data.to_user_id === userId) {
            getFriends(websocket);
        }
        if (data.action === "invite_play" && data.to_user_id === userId) {
            showGameInvitationNotification(data.user_id, websocket);
        }
        if (data.action === "invite_play" && data.user_id === userId) {
            showToast(data.to_user_id + " has received your invitation", websocket);
        }
        if (data.action === "ping" && data.to_user === username) {
            websocket.send(JSON.stringify({ action: "pong", to_user: data.username }));
        }
        if (data.action === "pong" && data.to_user === username) {
            updateConnectedPlayer(data.username, data.user_id, true, websocket);
        }
        if (data.action === "in_game") {
            addToPlayersPlaying(data.user_id);
           // setInGameStatus(`friend-${data.user_id}`);
            getFriends(websocket);
        }
        if (data.action === "not_in_game") {
            removeFromPlayersPlaying(data.user_id);
           // setInGameStatus(`friend-${data.user_id}`);
            getFriends(websocket);
        }
        if (data.action === "accept_invite" && data.user_id === userId) {
            const prvBtn = document.getElementById('btn-start-private');
            prvBtn.disabled = false;
            console.log("test");
            prvBtn.addEventListener('click', () => { initPrivateGame(userId, data.inv_user_id) });
        }
        if (data.action === "refuse_invite" && data.user_id === userId) {
            console.log("refuse");
        }
        if (data.action === "start_tournament" && username != data.username) {
            showToast(data.username + " started a tournament ! Go on tournament page if you want to join", websocket, data.username);
            if (document.getElementById("start-tournament")) {
                tournamentCreated(data.username);
            }
            const tournament = document.getElementById("tournament");
            tournament.addEventListener('click', () => {
                setTimeout(() => {
                    console.log("happen after tournament button in nav");
                    tournamentCreated(data.username);
                }, 100);
            });
        }
    }
    const isTournament = await checkTournamentExists();
    if (isTournament && location.pathname === "/tournament") {
        tournamentCreated(isTournament);
    }// else if (isTournament && location.pathname != "/tournament") {
    //     const tournament = document.getElementById("tournament");
    //     tournament.addEventListener('click', () => {
    //         setTimeout(() => {
    //             tournamentCreated(isTournament);
    //         }, 100);
    //     });
    // }
    if (document.getElementById("start-tournament"))
        addTournamentEventListeners(websocket);
    const tournament = document.getElementById("tournament");
    tournament.addEventListener('click', () => {
        setTimeout(() => {
            if (isTournament)
                tournamentCreated(isTournament)
            else addTournamentEventListeners(websocket);
        }, 100);
    });
    websocket.onerror = function(event) {
        console.error('Erreur WebSocket:', event);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    await loadView(location.pathname);
    addChatEventListeners();
    if (location.pathname != "/already-connected")
        checkIfConnected();
});