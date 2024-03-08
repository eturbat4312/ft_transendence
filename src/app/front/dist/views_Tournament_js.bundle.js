"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_Tournament_js"],{

/***/ "./views/Tournament.js":
/*!*****************************!*\
  !*** ./views/Tournament.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\r\n    constructor(params) {\r\n        super(params);\r\n        this.setTitle(\"Tournament\");\r\n    }\r\n\r\n    async getHtml() {\r\n        return `\r\n        <div class=\"container mt-3 centered\">\r\n        <div class=\"card bg-dark text-light mx-auto\" style=\"max-width: 800px;\">\r\n            <div class=\"card-header text-center\">\r\n                <h2>Tournament</h2>\r\n            </div>\r\n            <div class=\"card-body\">\r\n                <div class=\"text-center mb-4\">\r\n                    <h4>Choose Tournament Type</h4>\r\n                    <div class=\"btn-group\" role=\"group\" aria-label=\"Tournament Type\">\r\n                    <button type=\"button\" class=\"btn btn-primary btn-4players\">4 Players Tournament</button>\r\n                    <button type=\"button\" class=\"btn btn-primary btn-8players\">8 Players Tournament</button>\r\n                </div>\r\n                </div>\r\n                <div class=\"text-center mt-3\">\r\n                    <button type=\"button\" class=\"btn btn-success btn-matchmaking\" id=\"joinMatchmakingBtn\" disabled>Join Matchmaking</button>\r\n                </div>\r\n                <div id=\"tournamentInfo\" class=\"text-center\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n        `;\r\n    }\r\n});\n\n//# sourceURL=webpack://transcendence/./views/Tournament.js?");

/***/ })

}]);