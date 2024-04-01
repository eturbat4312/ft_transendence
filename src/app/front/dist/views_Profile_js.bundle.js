"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktranscendence"] = self["webpackChunktranscendence"] || []).push([["views_Profile_js"],{

/***/ "./views/Profile.js":
/*!**************************!*\
  !*** ./views/Profile.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Profile)\n/* harmony export */ });\n/* harmony import */ var _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView.js */ \"./views/AbstractView.js\");\n\n\nclass Profile extends _AbstractView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(params) {\n        super(params);\n        this.setTitle(\"Profile\");\n    }\n\n\n    async getHtml() {\n      return `\n      <div class=\"container mt-3 centered\">\n      <div class=\"card bg-dark text-light mx-auto\" style=\"max-width: 800px;\">\n          <div class=\"card-header text-center\">\n              <h2>Profile</h2>\n          </div>\n          <div class=\"card-body\">\n              <div class=\"text-center\">\n                  <img src=\"https://m.media-amazon.com/images/I/51G2Jr9BjOL._AC_UF1000,1000_QL80_.jpg\" alt=\"Photo de profil\" class=\"img-fluid rounded-circle\" style=\"width: 150px; height: 150px;\">\n              </div>\n  \n              <div class=\"mt-3\">\n                  <h4 class=\"mb-0\">Name</h4>\n                  <p class=\"mb-2\">Qwerty42</p>\n              </div>\n  \n              <div class=\"mt-3\">\n                  <h4>Last games</h4>\n                  <ul class=\"list-unstyled\">\n                      <li>Qwerty42 - Simon29 | 2 - 5</li>\n                      <li>Qwerty42 - Mick | 5 - 3 </li>\n                  </ul>\n              </div>\n          </div>\n      </div>\n  </div>\n      `;\n  }\n}\n\n//# sourceURL=webpack://transcendence/./views/Profile.js?");

/***/ })

}]);