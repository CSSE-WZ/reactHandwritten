import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.numberA = React.createRef(); // {current: null}
    this.numberB = React.createRef(); // {current: null}
    this.result = React.createRef(); // {current: null}
  }

  handleClick = () => {
    let numberA = this.numberA.current.value;
    let numberB = this.numberB.current.value;
    this.result.current.value = parseFloat(numberA) + parseFloat(numberB);
  };

  render() {
    return (
      <div>
        <input ref={this.numberA} />
        <input ref={this.numberB} />
        <button onClick={this.handleClick}> + </button>
        <input ref={this.result} />
      </div>
    );
  }
}

ReactDOM.render(<Sum />, document.getElementById('root'));
