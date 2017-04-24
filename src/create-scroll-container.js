import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ScrollApi from './scroll-api.js';
import windowApi from './window-api.js';

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
    this.api = new ScrollApi();
    this.scrollToStart = this.scrollToStart.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.handleAtEnd = this.handleAtEnd.bind(this);
  }

  getChildContext() {
    return {
      scroll: this.api.getPublicApi({
        scrollToStart: this.scrollToStart,
        scrollToEnd: this.scrollToEnd,
        parent: this.context.scroll || windowApi,
      }),
    };
  }

  componentDidMount() {
    this.api.setDomElement(ReactDOM.findDOMNode(this));
    if (reverse) {
      const node = this.api.getScrollContainer();
      this.scrollToStart();
      this.observer = new global.MutationObserver(() => {
        const distanceToEnd = this.api.getDistanceToBottom();
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
    this.api.addEventListener('scroll', this.handleAtEnd);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.api.disconnectDom();
    this.observer.disconnect();
  }

  scrollToStart() {
    if (reverse) {
      this.api.scrollToBottom();
    } else {
      this.api.scrollToTop();
    }
  }

  scrollToEnd() {
    if (reverse) {
      this.api.scrollToTop();
    } else {
      this.api.scrollToBottom();
    }
  }

  getDistanceToEnd() {
    if (reverse) {
      return this.api.getDistanceToTop();
    } else {
      return this.api.getDistanceToBottom();
    }
  }

  getDistanceToStart() {
    if (reverse) {
      return this.api.getDistanceToBottom();
    } else {
      return this.api.getDistanceToTop();
    }
  }

  handleAtEnd() {
    const { endTriggerDistance } = this.props;
    const distanceToEnd = this.getDistanceToEnd();
    this.distanceToEnd = this.api.getDistanceToBottom();
    if (!this.atTheEnd) {
      if (distanceToEnd <= endTriggerDistance) {
        this.api.triggerEvent('onend', {});
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
