import { Component, PureComponent } from './Component';
import {
  REACT_CONTEXT,
  REACT_FORWARD_REF_TYPE,
  REACT_MEMO,
  REACT_PROVIDER,
} from './constants';
import { shallowEqual, warpToDOM } from './utils';
import { useState, useMemo, useCallback, useReducer, useEffect } from './react-dom'
/**
 * 返回React元素即虚拟DOM，本质还是一个JS对象
 * @param {*} type 类型
 * @param {*} config 配置对象，即属性对象
 * @param {*} children 第一个儿子
 */
function createElement (type, config, children) {
  let ref; // 用来获取虚拟DOM实例的
  let key; // 用来区分同一个父亲的不同的儿子
  if (config) {
    delete config.__source;
    delete config.__self;
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
    if (typeof children !== 'undefined') {
      props.children = warpToDOM(children);
    }
  }

  return {
    type,
    props,
    ref,
    key,
  };
}
/**
 * 根据一个老的元素，克隆出一个新的元素
 * @param {*} oldElement 老元素
 * @param {*} newProps 新属性
 * @param {*} children 新的儿子们
 * @return {*} newElement 返回新元素
 */
function cloneElement (oldElement, newProps, children) {
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(warpToDOM);
  } else {
    children = warpToDOM(children);
  }
  let props = { ...oldElement.props, ...newProps, children };
  return { ...oldElement, props };
}

function createRef () {
  return { current: null };
}

// function forwardRef(FunctionComponent) {
//   return class extends Component {
//     render() {
//       return FunctionComponent(this.props, this.props.ref);
//     }
//   };
// }

function forwardRef (render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render, // 原来的那个函数组件
  };
}

// function createContext() {
//   let context = { Provider, Consumer };
//   function Provider({ value, children }) {
//     context._value = value;
//     return children;
//   }
//   function Consumer({ children }) {
//     return children(context._value);
//   }
//   return context;
// }

function createContext () {
  let context = { $$typeof: REACT_CONTEXT };
  context.Provider = { $$typeof: REACT_PROVIDER, _context: context };
  context.Consumer = { $$typeof: REACT_CONTEXT, _context: context };
  return context;
}

function memo (type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type, // 真正的函数组件
    compare,
  };
}

function useContext (context) {
  return context._currentValue
}
const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  memo,
  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  useEffect
};

export default React;
