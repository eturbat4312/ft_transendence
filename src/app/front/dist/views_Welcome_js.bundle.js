"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_Welcome_js"],{

/***/ "./views/Welcome.js":
/*!**************************!*\
  !*** ./views/Welcome.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(params) {\n        super(params);\n        this.setTitle(\"Welcome\");\n    }\n\n    async getHtml() {\n        return `\n<div class=\"container\">\n    <div class=\"row justify-content-center\">\n        <div class=\"col-md-6 centered\">\n            <div class=\"card my-5 bg-dark\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-column align-items-center\">\n                        <p class=\"text-light fs-3 game-font\">Welcome to</p>\n                        <p class=\"pong-logo\" href=\"#\">PONG</p>\n                        <a href=\"/login\" class=\"btn btn-primary mb-3 btn-lg-width nav__link\" style=\"font-family: 'Press Start 2P', cursive;\" data-link>Login</a>     \n                        <a href=\"/signup\" class=\"btn btn-outline-primary btn-lg-width nav__link\" style=\"font-family: 'Press Start 2P', cursive;\" data-link>Register</a>\n                    </div> \n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n        `;\n    }\n});\n\n\n//# sourceURL=webpack://transcendence/./views/Welcome.js?");

/***/ })

}]);