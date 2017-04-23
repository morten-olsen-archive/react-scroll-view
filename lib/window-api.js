"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WindowApi = function () {
  function WindowApi() {
    _classCallCheck(this, WindowApi);
  }

  _createClass(WindowApi, [{
    key: "getScrollContainer",
    value: function getScrollContainer() {
      return global;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(name, fn) {
      global.window.addEventListener(name, fn);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(name, fn) {
      global.window.removeEventListener(name, fn);
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(x, y) {
      global.window.scrollTop = y;
      global.window.scrollLeft = x;
    }
  }]);

  return WindowApi;
}();

exports.default = new WindowApi();