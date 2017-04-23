import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import windowApi from './window-api.js';

const domEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];

const scrollContainer = ({
  reverse = false,
} = {}) => WrappedComponent => class Scrollable extends Component {
  static get childContextTypes() {
    return {
      scroll: PropTypes.object,
    };
  }

  static get propTypes() {
    return {
      endTriggerDistance: PropTypes.number,
    };
  }

  static get defaultProps() {
    return {
      endTriggerDistance: 0,
    };
  }

  constructor() {
    super();
    this.listeners = {};
    this.isUnmounted = false;
    this.onDomEvent = this.onDomEvent.bind(this);
    this.handleAtEnd = this.handleAtEnd.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.getScrollContainer = this.getScrollContainer.bind(this);
  }

  getChildContext() {
    return {
      scroll: {
        addEventListener: this.addEventListener,
        removeEventListener: this.removeEventListener,
        scrollTo: this.scrollTo,
        getScrollContainer: this.getScrollContainer,
        parent: this.context.scroll || windowApi,
        reverse,
      },
    };
  }

  componentDidMount() {
    if (reverse) {
      const node = this.getScrollContainer();
      this.scrollTo(node.scrollHeight);
      this.observer = new global.MutationObserver(() => {
        const distanceToEnd = this.getDistanceToBottom();
        const diff = distanceToEnd - this.distanceToEnd;
        node.scrollTop += diff;
        this.distanceToEnd = distanceToEnd;
      });
      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      };
      this.observer.observe(node, config);
    }
    this.addEventListener('scroll', this.handleAtEnd);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    const container = ReactDOM.findDOMNode(this);
    if (container) {
      Object.keys(this.listeners).forEach((event) => {
        if (domEvents.includes(event)) {
          container.removeEventListener(event, this.onDomEvent);
        }
      });
    }
    this.observer.disconnect();
  }

  onDomEvent(event) {
    this.getListeners(event.type).forEach((listener) => {
      this.sendEvent(listener, event);
    });
  }

  addEventListener(event, callback) {
    if (this.isUnmounted) return;
    if (domEvents.includes(event)) {
      const container = ReactDOM.findDOMNode(this);
      container.addEventListener(event, this.onDomEvent);
    }
    this.getListeners(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.isUnmounted) return;
    const index = this.getListeners(event).indexOf(callback);
    if (~index) {
      this.getListeners(event).splice(index, 1);
    }
  }

  getScrollContainer() {
    if (!this.isUnmounted) {
      return ReactDOM.findDOMNode(this);
    } else {
      return <div />;
    }
  }

  sendEvent(listener, evt) {
    listener(evt);
  }

  getListeners(name) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    return this.listeners[name];
  }

  scrollTo(x) {
    const container = ReactDOM.findDOMNode(this);
    container.scrollTop = x;
  }

  triggerEvent(event, evt) {
    this.getListeners(event).forEach((listener) => {
      this.sendEvent(listener, evt);
    });
  }

  getDistanceToBottom() {
    const node = this.getScrollContainer();
    const currentLocation = node.scrollTop + node.offsetHeight;
    const actualEnd = node.scrollHeight;
    return actualEnd - currentLocation;
  }

  getDistanceToTop() {
    const node = this.getScrollContainer();
    return node.scrollTop;
  }

  getDistanceToEnd() {
    if (reverse) {
      return this.getDistanceToTop();
    } else {
      return this.getDistanceToBottom();
    }
  }

  handleAtEnd() {
    const { endTriggerDistance } = this.props;
    const distanceToEnd = this.getDistanceToEnd();
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

  render() {
    return <WrappedComponent {...this.props} />;
  }
};

export default scrollContainer;
