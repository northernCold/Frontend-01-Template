/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./carousel.view":
/*!***********************!*\
  !*** ./carousel.view ***!
  \***********************/
/*! exports provided: Carousel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Carousel\", function() { return Carousel; });\n/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement */ \"./createElement.js\");\n\n    \n\n    class Carousel {\n      render () {\n        return Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(\"div\", {\"type\":\"startTag\",\"tagName\":\"div\"}, \"\\r\\n    \",Object(_createElement__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(\"img\", {\"type\":\"startTag\",\"tagName\":\"img\",\"src\":\"11\",\"alt\":\"\",\"isSelfClosing\":true}, ),\"\\r\\n    {{message}}\\r\\n  \")\n      }\n\n      setAttribute(name, value) {\n        this[name] = value;\n      }\n      mountTo(parent) {\n        this.render().mountTo(parent);\n      }\n    }\n  \n\n//# sourceURL=webpack:///./carousel.view?");

/***/ }),

/***/ "./createElement.js":
/*!**************************!*\
  !*** ./createElement.js ***!
  \**************************/
/*! exports provided: createElement, Wrapper, Text */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Wrapper\", function() { return Wrapper; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Text\", function() { return Text; });\n// 创建顺序 先子后父\r\nfunction createElement(Cls, attributes, ...children) {\r\n  let o;\r\n  if (typeof Cls === \"string\") {\r\n    o = new Wrapper(Cls)\r\n  } else {\r\n    o = new Cls;\r\n  }\r\n  for (let name in attributes) {\r\n    o.setAttribute(name, attributes[name]);\r\n  }\r\n  \r\n\r\n  let visit = (children) => {\r\n    for (let child of children) {\r\n      if (typeof child === \"object\" && child instanceof Array) {\r\n        visit(child);\r\n        continue;\r\n      }\r\n      if (typeof child === \"string\") {\r\n        child = new Text(child);\r\n      }\r\n      o.appendChild(child)\r\n    }\r\n  }\r\n\r\n  visit(children)\r\n  console.log(o)\r\n  return o;\r\n\r\n}\r\n\r\n\r\nclass Wrapper {\r\n  constructor(tagName) {\r\n    this.children = [];\r\n    this.root = document.createElement(tagName);\r\n  }\r\n\r\n  setAttribute(name, value) {\r\n    this.root.setAttribute(name, value);\r\n  }\r\n\r\n  mountTo(parent) {\r\n    parent.appendChild(this.root);\r\n    for (let child of this.children) {\r\n      child.mountTo(this.root);\r\n    }\r\n  }\r\n\r\n  get style() {\r\n    return this.root.style\r\n  }\r\n\r\n  addEventListener() {\r\n    this.root.addEventListener(...arguments)\r\n  }\r\n\r\n  appendChild(child) {\r\n    this.children.push(child)\r\n  }\r\n}\r\n\r\nclass Text {\r\n  constructor(text) {\r\n    this.children = [];\r\n    this.root = document.createTextNode(text);\r\n  }\r\n\r\n  mountTo(parent) {\r\n    parent.appendChild(this.root);\r\n  }\r\n}\n\n//# sourceURL=webpack:///./createElement.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _carousel_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./carousel.view */ \"./carousel.view\");\n\r\n\r\n\r\n// new Carousel();\r\n// component.mountTo(document.body)\r\nnew _carousel_view__WEBPACK_IMPORTED_MODULE_0__[\"Carousel\"]().render().mountTo(document.body)\r\n\n\n//# sourceURL=webpack:///./main.js?");

/***/ })

/******/ });