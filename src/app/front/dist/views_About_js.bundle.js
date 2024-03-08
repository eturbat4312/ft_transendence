"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_About_js"],{

/***/ "./views/About.js":
/*!************************!*\
  !*** ./views/About.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(params) {\n        super(params);\n        this.setTitle(\"About\");\n    }\n\n    async getHtml() {\n        return `\n        <div class=\"container mt-3 centered\">\n        <div class=\"card bg-dark text-light mx-auto\" style=\"max-width: 800px;\">\n            <div class=\"card-header text-center\">\n                <h2>About FT_TRANSCENDENCE</h2>\n            </div>\n            <div class=\"card-body\">\n                <p class=\"card-text\">\n                    Welcome to the About page of our website! This is the last project of the 42 common core.\n                </p>\n                <p class=\"card-text\">\n                    <strong>Features:</strong>\n                    <ul>\n                        <li>Classic Pong gameplay</li>\n                        <li>Customizable settings</li>\n                        <li>Multiplayer mode</li>\n                        <li>Global chat and private chat</li>\n                        <li>Tournament mode</li>\n                        <li>Social space</li>\n                    </ul>\n                </p>\n                <p class=\"card-text\">\n                    <strong>About the Team:</strong>\n                    <br>\n                    We are a team of 3 students from 42 Lausanne.\n                    <ul>\n                        <li><a href=\"https://github.com/blaisek\" class=\"btn btn-link\" role=\"button\" target=\"_blank\">btchiman</a></li>\n                        <li><a href=\"https://github.com/porgito\" class=\"btn btn-link\" role=\"button\" target=\"_blank\">jlaurent</a></li>\n                        <li><a href=\"https://github.com/eturbat4312\" class=\"btn btn-link\" role=\"button\" target=\"_blank\">eturbat</a></li>\n                    </ul>\n                </p>\n            </div>\n        </div>\n    </div>\n    \n        `;\n    }\n});\n\n\n//# sourceURL=webpack://transcendence/./views/About.js?");

/***/ })

}]);