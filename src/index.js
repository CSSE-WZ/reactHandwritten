import { render } from '@testing-library/react';
import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  componentWillMount() {
    console.log('child1: componentWillMount');
  }
  // 为什么这里要用static静态方法？
  // 因为以前有很多人在componentWillReceiveProps中调用this.setState()，引起死循环；改用类的静态方法，则静态方法中this指向的是类本身而不是类的实例，无法调用this.setState
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('this', this, 111, this.getDerivedStateFromProps, nextProps);

    return { ...prevState, number: nextProps.number * 2 };
    // return null; // 返回null的话则不改变state
  }
  render() {
    console.log('child2: render');
    return <div>Child:{this.state.number}</div>;
  }

  componentDidMount() {
    console.log('child3: componentDidMount');
  }

  componentWillUnmount() {
    console.log('child6: componentWillUnmount');
  }
}
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

  componentWillUpdate() {
    console.log('6.componentWillUpdate');
  }

  render() {
    console.log('3.render', this.state.number);
    return (
      <div id={'parent'}>
        <p>Counter:{this.state.number}</p>
        <Child number={this.state.number} />
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

/**
 *  旧版生命周期（React15）
 * 1、挂载阶段
 * constructor
 * componentWillMount
 * render
 * componentDidMount
 * 2、更新阶段
 * 状态改变
 * shouldComponentUpdate
 * componentwillUpdate
 * render
 * componentDidUpdate
 * 父组件props改变时，子组件更新
 * componentWillReceiveProps
 * shouldComponentUpdate
 * componentWillUpdate
 * render
 * componentDidUpdate
 * 3、卸载阶段
 * componentWillUnmount
 */

/**
 * 新版生命周期（React16）
 * 1、创建时
 * constructor
 * getDerivedStateFromProps
 * render
 * componentDidMount
 * 2、更新时
 * getDerivedStateFromProps
 * shouldComponentUpdate
 * render
 * getSnapshotBeforeUpdate
 * componentDidUpdate
 * 3、卸载时
 * componentWillUnmount
 */
