import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { createScrollContainer, withScrollApi } from '../src/main';

const renderItem = (item) => (
  <div
    style={{
      height: 40,
    }}
  >
    item: {item}
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
    scroll.addEventListener('onend', () => {
      console.log('at the end');
    });
  }

  run() {
    setTimeout(() => {
      const items = new Array(3).fill(undefined);
      this.setState({
        items: [...items, ...this.state.items],
      }, () => {
        this.run();
      });
    }, 1000);
  }

  render() {
    const items = this.state.items.map((a, i) => i);
    items.reverse();
    return (
      <div style={{ minHeight: '100%' }}>
        {items.map(renderItem)}
      </div>
    );
  }
});

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
