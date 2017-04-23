import React, { Component } from 'react';
import PropTypes from 'prop-types';
import errorApi from './window-api.js';

const scrollable = WrappedComponent => class ScrollableComponet extends Component {
  static get contextTypes() {
    return {
      scroll: PropTypes.object,
    };
  }

  render() {
    return <WrappedComponent {...this.props} scroll={this.context.scroll || errorApi} />;
  }
};

export default scrollable;
