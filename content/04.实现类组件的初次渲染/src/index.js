import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

/**
 *
 * 组件分为内置原生组件和自定义组件
 * 内置组件：p h1 span type字符串
 * 自定义组件：类型是一个函数；而类组件的父类Component的原型上有一个属性isReactComponent={}
 *           自定义组件的名称必须是大写字母开头，返回值有且只有一个根元素
 */

class ClassComponent extends React.Component {
  render() {
    //  JSX需要经过babel转换后才能渲染
    // return (
    //   <h1 setyle={{ color: 'red' }} className='title'>
    //     <span>hello </span> {this.props.name}
    //   </h1>
    // );
    return React.createElement(
      'h1',
      {
        className: 'title',
        style: { color: 'red' },
      },
      React.createElement('span', null, 'hello'),
      this.props.name
    );
  }
}

ReactDOM.render(
  <ClassComponent name='title' />,
  document.getElementById('root')
);
