import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createScrollContainer, withScrollApi } from '../src/main';

const renderItem = (item, index) => (
  <div
    style={{
      height: 40,
    }}
  >
    {index}
  </div>
);

const ScrollElm = withScrollApi(class ScrollElement extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
    };
  }

  componentWillMount() {
    const { scroll } = this.props;
    this.run();
  }

  run() {
    setTimeout(() => {
      const items = new Array(3).fill(undefined);
      this.setState({
        items: [...this.state.items, ...items]
      }, () => {
        this.run();
      });
    }, 1000);
  }

  render() {
    return (
      <div style={{ minHeight: '100%' }}>
        {this.state.items.map(renderItem)}
      </div>
    );
  }
})

const Wrapper = createScrollContainer({ reverse: true })(({ children }) => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      top: 40,
      right: 0,
      bottom: 0,
      overflowY: 'scroll',
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch',
    }}
  >
    {children}
  </div>
));

ReactDOM.render(
  <Wrapper>
    <ScrollElm />
  </Wrapper>,
  global.document.getElementById('root'),
);
