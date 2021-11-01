import { Component } from './Component';
import { warpToDOM } from './utils';

/**
 *
 * @param {*} type 类型
 * @param {*} config 配置对象，即属性对象
 * @param {*} children 第一个儿子
 */
function createElement(type, config, children) {
  if (config) {
    delete config.__source;
    delete config.self;
  }
  let props = { ...config };
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
  };
}
const React = { createElement, Component };

export default React;
