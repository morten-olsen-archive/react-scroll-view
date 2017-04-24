'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _windowApi = require('./window-api.js');

var _windowApi2 = _interopRequireDefault(_windowApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var domEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];

var scrollContainer = function scrollContainer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === undefined ? false : _ref$reverse;

  return function (WrappedComponent) {
    return function (_Component) {
      _inherits(Scrollable, _Component);

      _createClass(Scrollable, null, [{
        key: 'childContextTypes',
        get: function get() {
          return {
            scroll: _propTypes2.default.object
          };
        }
      }, {
        key: 'propTypes',
        get: function get() {
          return {
            endTriggerDistance: _propTypes2.default.number
          };
        }
      }, {
        key: 'defaultProps',
        get: function get() {
          return {
            endTriggerDistance: 0
          };
        }
      }]);

      function Scrollable() {
        _classCallCheck(this, Scrollable);

        var _this = _possibleConstructorReturn(this, (Scrollable.__proto__ || Object.getPrototypeOf(Scrollable)).call(this));

        _this.listeners = {};
        _this.isUnmounted = false;
        _this.onDomEvent = _this.onDomEvent.bind(_this);
        _this.handleAtEnd = _this.handleAtEnd.bind(_this);
        _this.addEventListener = _this.addEventListener.bind(_this);
        _this.removeEventListener = _this.removeEventListener.bind(_this);
        _this.scrollTo = _this.scrollTo.bind(_this);
        _this.getScrollContainer = _this.getScrollContainer.bind(_this);
        return _this;
      }

      _createClass(Scrollable, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return {
            scroll: {
              addEventListener: this.addEventListener,
              removeEventListener: this.removeEventListener,
              scrollTo: this.scrollTo,
              getScrollContainer: this.getScrollContainer,
              parent: this.context.scroll || _windowApi2.default,
              reverse: reverse
            }
          };
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          if (reverse) {
            var node = this.getScrollContainer();
            this.scrollTo(node.scrollHeight);
            this.observer = new global.MutationObserver(function () {
              var distanceToEnd = _this2.getDistanceToBottom();
              var diff = distanceToEnd - _this2.distanceToEnd;
              node.scrollTop += diff;
              _this2.distanceToEnd = distanceToEnd;
            });
            var config = {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            };
            this.observer.observe(node, config);
          }
          this.addEventListener('scroll', this.handleAtEnd);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this3 = this;

          this.isUnmounted = true;
          var container = _reactDom2.default.findDOMNode(this);
          if (container) {
            Object.keys(this.listeners).forEach(function (event) {
              if (domEvents.includes(event)) {
                container.removeEventListener(event, _this3.onDomEvent);
              }
            });
          }
          this.observer.disconnect();
        }
      }, {
        key: 'onDomEvent',
        value: function onDomEvent(event) {
          var _this4 = this;

          this.getListeners(event.type).forEach(function (listener) {
            _this4.sendEvent(listener, event);
          });
        }
      }, {
        key: 'addEventListener',
        value: function addEventListener(event, callback) {
          if (this.isUnmounted) return;
          if (domEvents.includes(event)) {
            var container = _reactDom2.default.findDOMNode(this);
            container.addEventListener(event, this.onDomEvent);
          }
          this.getListeners(event).push(callback);
        }
      }, {
        key: 'removeEventListener',
        value: function removeEventListener(event, callback) {
          if (this.isUnmounted) return;
          var index = this.getListeners(event).indexOf(callback);
          if (~index) {
            this.getListeners(event).splice(index, 1);
          }
        }
      }, {
        key: 'getScrollContainer',
        value: function getScrollContainer() {
          if (!this.isUnmounted) {
            return _reactDom2.default.findDOMNode(this);
          } else {
            return _react2.default.createElement('div', null);
          }
        }
      }, {
        key: 'sendEvent',
        value: function sendEvent(listener, evt) {
          listener(evt);
        }
      }, {
        key: 'getListeners',
        value: function getListeners(name) {
          if (!this.listeners[name]) {
            this.listeners[name] = [];
          }
          return this.listeners[name];
        }
      }, {
        key: 'scrollTo',
        value: function scrollTo(x) {
          var container = _reactDom2.default.findDOMNode(this);
          container.scrollTop = x;
        }
      }, {
        key: 'triggerEvent',
        value: function triggerEvent(event, evt) {
          var _this5 = this;

          this.getListeners(event).forEach(function (listener) {
            _this5.sendEvent(listener, evt);
          });
        }
      }, {
        key: 'getDistanceToBottom',
        value: function getDistanceToBottom() {
          var node = this.getScrollContainer();
          var currentLocation = node.scrollTop + node.offsetHeight;
          var actualEnd = node.scrollHeight;
          return actualEnd - currentLocation;
        }
      }, {
        key: 'getDistanceToTop',
        value: function getDistanceToTop() {
          var node = this.getScrollContainer();
          return node.scrollTop;
        }
      }, {
        key: 'getDistanceToEnd',
        value: function getDistanceToEnd() {
          if (reverse) {
            return this.getDistanceToTop();
          } else {
            return this.getDistanceToBottom();
          }
        }
      }, {
        key: 'handleAtEnd',
        value: function handleAtEnd() {
          var endTriggerDistance = this.props.endTriggerDistance;

          var distanceToEnd = this.getDistanceToEnd();
          this.distanceToEnd = this.getDistanceToBottom();
          if (!this.atTheEnd) {
            if (distanceToEnd <= endTriggerDistance) {
              this.triggerEvent('onend', {});
              this.atTheEnd = true;
            }
          } else if (distanceToEnd > endTriggerDistance) {
            this.atTheEnd = false;
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, this.props);
        }
      }]);

      return Scrollable;
    }(_react.Component);
  };
};

exports.default = scrollContainer;