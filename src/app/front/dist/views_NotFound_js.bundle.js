"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_NotFound_js"],{

/***/ "./views/NotFound.js":
/*!***************************!*\
  !*** ./views/NotFound.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ NotFound)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n// views/NotFound.js\n\n\nclass NotFound extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(params) {\n        super(params);\n        this.setTitle(\"404 - Page not found\");\n    }\n\n    async getHtml() {\n        return `\n            <h1>404</h1>\n            <p>Page not found.</p>\n        `;\n    }\n}\n\n\n//# sourceURL=webpack://transcendence/./views/NotFound.js?");

/***/ })

}]);