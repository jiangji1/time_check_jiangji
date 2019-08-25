"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _time = _interopRequireDefault(require("./time.vue"));

_time["default"].install = function (Vue) {
  return Vue.component(_time["default"].name, _time["default"]);
};

var _default = _time["default"];
exports["default"] = _default;