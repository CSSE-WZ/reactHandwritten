import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class Counter extends React.Component {
  static defaultProps = { name: 'Hello' };
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log('1.constructor');
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  componentWillMount() {
    console.log('2.componentWillMount');
  }
  // 当属性或者状态发生改变的话，会走此方法来决定，是否要渲染更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('5.shouldComponentUpdate');
    return nextState.number % 2 === 0; // 奇数不更新，偶数更新
  }

  componentWillUpdate() {
    console.log('6.componentWillUpdate');
  }

  render() {
    console.log('3.render');
    return (
      <div>
        <p>{this.props.name}</p>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}> + </button>
      </div>
    );
  }
  componentDidUpdate() {
    console.log('7.componentDidUpdate');
  }
  componentDidMount() {
    console.log('4.componentDidMount');
  }
}

ReactDOM.render(<Counter />, document.getElementById('root'));
