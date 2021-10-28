import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

/**
 *
 * React.createElement
 * 参数1 标签的类型 h1 div span
 * 参数2 属性的JS对象
 * 参数3 往后的都是儿子们
 * 返回值 是React元素=虚拟DOM，也是一个对象
 */

function FunctionComponent(props) {
  return React.createElement(
    'h1',
    {
      className: 'title',
      style: { color: 'red' },
    },
    React.createElement('span', null, 'hello'),
    props.name
  );
}

let element = <FunctionComponent name='world' />;

console.log('111', element, JSON.stringify(element, null, 2));

//ReactDOM 才是最核心干活的，他在浏览器执行的时候，可以把React元素，也就是虚拟DOM转换成真实DOM
ReactDOM.render(element, document.getElementById('root'));
