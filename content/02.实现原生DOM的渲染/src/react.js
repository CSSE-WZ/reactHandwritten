import { warpToDOM } from './utils';

/**
 * 返回React元素即虚拟DOM，本质还是一个JS对象
 * @param {*} type 类型
 * @param {*} config 配置对象，即属性对象
 * @param {*} children 第一个儿子
 */
function createElement(type, config, children) {
  let props = { ...config };
  if (arguments.length > 3) {
    // arguments.length > 3表示有多个儿子
    // children 可能是数组，也可能是一个字符串或数字，或者是null/undefined
    // warpToDOM 目的是将字符串或数字类型的儿子转成对象，便于后续DOM-DIFF
    props.children = Array.prototype.slice.call(arguments, 2).map(warpToDOM);
  } else {
    props.children = warpToDOM(children);
  }

  return {
    type,
    props,
  };
}
const React = { createElement };

export default React;
