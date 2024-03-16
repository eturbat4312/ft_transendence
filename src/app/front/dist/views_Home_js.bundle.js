"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_Home_js"],{

/***/ "./views/Home.js":
/*!***********************!*\
  !*** ./views/Home.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(params) {\n        super(params);\n        this.setTitle(\"Home\");\n\n        this.handleLogout = this.handleLogout.bind(this);\n    }\n\n    async getHtml() {\n        return `\n        <div class=\"container mt-3 centered\">\n            <div class=\"card bg-dark text-light mx-auto\" style=\"max-width: 800px;\">\n                <button id=\"logout\">Logout</button>\n            </div>\n        </div>\n        `;\n    }\n\n    async initialize() {\n        document.getElementById('logout').addEventListener('click', this.handleLogout);\n    }\n\n    async handleLogout() {\n        try {\n            const urlParams = new URLSearchParams(window.location.search);\n            const response = await fetch('http://localhost:8000/logout/', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify({\n                    // Include any necessary data for the logout request\n                    // For example: user ID, session token, etc.\n                })\n            });\n\n            if (response.ok) {\n                this.redirect('/login');\n            } else {\n                console.error('Logout failed:', response.statusText);\n            }\n        } catch (error) {\n            console.error(error);\n        }\n    }\n});    \n\n//# sourceURL=webpack://transcendence/./views/Home.js?");

/***/ })

}]);