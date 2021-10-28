import React from 'react';
import ReactDOM from 'react-dom'; //React 的DOM渲染库

/**
 *
 * 组件分为内置原生组件和自定义组件
 * 内置组件：p h1 span type字符串
 * 自定义组件：类型是一个函数；而类组件的父类Component的原型上有一个属性isReactComponent={}
 *           自定义组件的名称必须是大些字母开头，返回值有且只有一个根元素
 */

/**
 * 类组件的数据来源有两个地方：父组件传过来的属性props 和 自己内部的状态state
 * 属性和状态发生变化后组件都会更新，视图都会渲染
 * 定义状态的方法只有两个，一个是在构造函数中；一个是直接state={},使用类的属性
 */

/**
 * state的更新可能是异步的:出于性能的考虑React可能会把多个setState合并成同一个调用
 * 如何判断它是同步的还是异步的，是不是批量更新？
 * 一个原则：凡是React能管控到的地方，就是批量的、异步的，如：事件处理函数、函数声明周期；
 *         不能管控到的地方就是同步的、非批量的，如：setInterval、setTimeout、Promise、原生DOM事件
 *
 * 注意！！！setState”同步异步“和JS中的同步异步没有关系，它的本质是批量执行！
 */

/**
 * React事件命名采用小驼峰（camelCase）: onClick onMousemove，原生事件则是小写：onclick
 * 原生事件里传函数的名字字符，而在react中传入一个函数的引用地址，即真实的函数定义
 */
class Counter extends React.Component {
  state = { number: 0 };

  // 类的属性---这样的写法让函数里的this永远指向组件的实例
  // 在事件处理函数里，setState的调用会批量进行，setState并不会立即修改this.state，而是等到事件处理函数结束后在进行更新
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    console.log('111', this.state.number); // 0

    this.setState({ number: this.state.number + 1 });
    console.log('222', this.state.number); // 0

    //
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log('222', this.state.number); // 2
      this.setState({ number: this.state.number + 1 });
      console.log('222', this.state.number); // 3
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById('root'));
