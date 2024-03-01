import { getNav, getSocial, getChat, handleLogout } from '../views/utils.js';
import { addTournamentEventListeners } from './script.js';
import { addGameEventListeners } from '../views/Game.js';
import { addChatEventListeners } from './utils.js';
import { getSocialState } from './friendModal.js';
import '../theme/base.css'
import '../theme/game.css'
import '../theme/index.css'
import '../theme/style.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const routes = [
    { path: "/", view: "Welcome" },
    { path: "/home", view: "Home" },
    { path: "/login", view: "Login" },
    { path: "/signup", view: "Signup" },
    { path: "/game", view: "Game" },
    { path: "/tournament", view: "Tournament" },
    { path: "/about", view: "About" },
    { path: "/profile", view: "Profile" },
    { path: "/settings", view: "Settings" }
];

const isAuthenticated = async () => {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('http://' + serverIP + ':8000/api/verify-token/', {
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
                if (path === '/tournament') {
                    addTournamentEventListeners();
                }
                if (path === '/game') {
                    addGameEventListeners();
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

    if (auth) {
        const navHTML = await getNav(currentPath);
        document.querySelector("#nav").innerHTML = navHTML;

        const chatHTML = await getChat(currentPath);
        document.querySelector("#chat").innerHTML = chatHTML;

        const socialHTML = await getSocial(currentPath);
        document.querySelector("#social").innerHTML = socialHTML;
        getSocialState();
    }
    addNavEventListeners();
};

const addNavEventListeners = () => {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            console.log("page:", link.getAttribute('href'));
            event.preventDefault();
            const path = link.getAttribute('href');
            navigate(path);
        });
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

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    await loadView(location.pathname);
    addChatEventListeners();
});