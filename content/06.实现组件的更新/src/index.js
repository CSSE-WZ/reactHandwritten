import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class Counter extends React.Component {
  state = { number: 0 };

  handleClick = () => {
    this.setState({ number: this.state.number + 1 }, () => {
      console.log('111', this.state.number); // 0
    });
    console.log('222', this.state.number); // 0
  };

  render() {
    return (
      // <div>
      //   <p>{this.state.number}</p>
      //   <button onClick={this.handleClick}>+</button>
      // </div>
      React.createElement(
        'div',
        null,
        /*#__PURE__*/ React.createElement('p', null, this.state.number),
        /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: this.handleClick,
          },
          '+'
        )
      )
    );
  }
}
let CounterComponent = React.createElement(Counter, null);

ReactDOM.render(CounterComponent, document.getElementById('root'));
