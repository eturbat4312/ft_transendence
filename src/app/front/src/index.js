import Tournament from "../views/Tournament.js";
import Landing from "../views/Landing.js";
import Login from "../views/Login.js";
import Signup from "../views/Signup.js";
import NotFound from "../views/NotFound.js";
import About from "../views/About.js";
import Profile from "../views/Profile.js";
import Settings from "../views/Settings.js";
import Game from "../views/Game.js";
import { getNav, getSocial, getChat } from '../views/utils.js';
import '../theme/base.css'
import '../theme/game.css'
import '../theme/index.css'
import '../theme/style.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

(function(history){
    const pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        return pushState.apply(history, arguments);
    };
})(window.history);

window.addEventListener('pushstate', () => {
    router();
});

const navigateTo = url => {
    history.pushState(null, null, url);
};


const router = async () => {
    const routes = [
        { path: "/", view: Landing },
        { path: "/login", view: Login },
        { path: "/signup", view: Signup },
        { path: "/game", view: Game},
        { path: "/tournament", view: Tournament },
        { path: "/about", view: About},
        { path: "/profile", view: Profile},
        { path: "/settings", view: Settings},
        
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    //console.log(potentialMatches);
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: { path: location.pathname, view: NotFound },
            result: [location.pathname]
        };
    }

    //console.log(match);
    //console.log(location.pathname);
    const view = new match.route.view(getParams(match));
    const currentPath = location.pathname;

    const navHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getNav(currentPath);
    document.querySelector("#nav").innerHTML = navHTML;

    const chatHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getChat(currentPath);
    document.querySelector("#chat").innerHTML = chatHTML;

    const socialHTML = (currentPath === "/login" || currentPath === "/signup") ? '' : await getSocial(currentPath);
    document.querySelector("#social").innerHTML = socialHTML;

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.onpopstate = router;

document.addEventListener("DOMContentLoaded", () => {
    router();
});