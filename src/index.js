import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// class SubCounter extends React.PureComponent {
//   render() {
//     console.log('SubCounter---');
//     return <div>SubCounter: {this.props.count}</div>;
//   }
// }
function SubCounter(props) {
  console.log('SubCounter---');

  return <div>SubCounter: {props.count}</div>;
}

let MomoSubCounter = React.memo(SubCounter);

class Counter extends React.Component {
  state = { number: 0 };
  inputRef = React.createRef();

  handleClick = () => {
    let mount = Number(this.inputRef.current.value);

    // this.setState(this.state);
    this.setState({ number: this.state.number + mount });
  };

  render() {
    console.log('Counter---');

    return (
      <div>
        <p>Counter: {this.state.number}</p>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}> + </button>
        <MomoSubCounter count={this.state.number} />
      </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById('root'));
