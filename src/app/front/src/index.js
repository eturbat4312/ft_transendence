

import Dashboard from "../views/dashboard.js";
import landing from "../views/landing.js";
import login from "../views/login.js";
import signup from "../views/signup.js";
import NotFound from "../views/NotFound.js";
import about from "../views/about.js";
import game from "../views/game.js";
import '../theme/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap';
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

(function (history) {
    const pushState = history.pushState;
    history.pushState = function (state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
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
        { path: "/", view: landing },
        { path: "/login", view: login },
        { path: "/signup", view: signup },
        { path: "/dashboard", view: Dashboard },
        { path: "/about", view: about },
        { path: "/game", view: game }
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


    document.querySelector("#app").innerHTML = await view.getHtml();
    if (view.initialize) {
        view.initialize();
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    router();
});