import React, { Component } from 'react';
import PropTypes from 'prop-types';
import windowApi from './window-api.js';

const scrollable = WrappedComponent => class ScrollableComponet extends Component {
  static get contextTypes() {
    return {
      scroll: PropTypes.object,
    };
  }

  render() {
    return <WrappedComponent {...this.props} scroll={this.context.scroll || windowApi} />;
  }
};

export default scrollable;
