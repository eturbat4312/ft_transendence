import { getNav, getSocial, getChat } from '../views/utils.js';
import { addTournamentEventListeners } from './script.js';
import { addGameEventListeners } from '../views/Game.js';
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

const loadView = async (path) => {
    const { view } = routes.find(route => route.path === path) || {};
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
            });
        }).catch(error => {
            console.error('Error loading view:', error);
            document.querySelector('#app').innerHTML = 'Error loading view';
        });
    } else {
        document.querySelector('#app').innerHTML = 'Page not found';
    }
};

const loadComponents = async () => {
    const currentPath = location.pathname;
    if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
        const navHTML = await getNav(currentPath);
        document.querySelector("#nav").innerHTML = navHTML;

        const chatHTML = await getChat(currentPath);
        document.querySelector("#chat").innerHTML = chatHTML;

        const socialHTML = await getSocial(currentPath);
        document.querySelector("#social").innerHTML = socialHTML;
    }
};

const addNavEventListeners = () => {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            console.log("lggg:", link.getAttribute('href'));
            event.preventDefault();
            const path = link.getAttribute('href');
            navigate(path);
        });
    });
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
    addNavEventListeners();
    loadView(location.pathname);
});

// const checkIfLoggedIn = async () => {
//     try {
//         const response = await fetch('???', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': '???',
//                 'Authorization': '???'
//             },
//         });
        
//         if (response.ok) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         console.error('AUTH ERROR :', error);
//         return false;
//     }
// };
