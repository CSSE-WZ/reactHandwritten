import { Component } from './Component';
import { REACT_FORWARD_REF_TYPE } from './constants';
import { warpToDOM } from './utils';

/**
 *
 * @param {*} type 类型
 * @param {*} config 配置对象，即属性对象
 * @param {*} children 第一个儿子
 */
function createElement(type, config, children) {
  let ref; // 用来获取虚拟DOM实例的
  let key; // 用来区分同一个父亲的不同的儿子
  if (config) {
    delete config.__source;
    delete config.self;
    ref = config.ref;
    // delete config.ref;
    key = config.key;
    delete config.key;
  }
  let props = { ...config }; // porps里没有key和ref
  if (arguments.length > 3) {
    // arguments.length > 3表示有多个儿子
    // children 可能是数组，也可能是一个字符串或数字，或者是null/undefined
    props.children = Array.prototype.slice.call(arguments, 2).map(warpToDOM);
  } else {
    // 注意：此处children可能为0、null、undefined等情况
    props.children = warpToDOM(children);
  }

  return {
    type,
    props,
    ref,
    key,
  };
}

function createRef() {
  return { current: null };
}

// function forwardRef(FunctionComponent) {
//   return class extends Component {
//     render() {
//       return FunctionComponent(this.props, this.props.ref);
//     }
//   };
// }

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render, // 原来的那个函数组件
  };
}

const React = { createElement, Component, createRef, forwardRef };

export default React;
