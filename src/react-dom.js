import { React_TEXT } from './constants';
import { addEvent } from './event';

/**
 * 把虚拟DOM转成真实DOM插入容器
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

/**
 * 把虚拟DOM转成真实DOM
 * @param {*} vdom  虚拟DOM
 */
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom; // 真实DOM元素
  if (type === React_TEXT) {
    dom = document.createTextNode(props.content); // 文本元素，字符串或数字
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      // 说明这是一个React类组件
      return mountClassComponent(vdom);
    }
    // 说明这是一个React函数组件的React元素
    return mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type); // 原生DOM类型
  }
  if (props) {
    updateProps(dom, {}, props); // 根据虚拟DOM中属性更新真实DOM属性
    if (typeof props.children === 'object' && props.children.type) {
      // 如果是对象，说明只有一个儿子
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      // 如果是数组，说明有多个儿子
      reconcileChildren(props.children, dom);
    }
  }
  // 让虚拟DOM的dom属性指向它的真实DOM
  vdom.dom = dom;
  if (ref) {
    ref.current = dom; // 让ref.current属性指向真实的DOM实例
  }
  return dom;
}

/**
 * 挂载类组件
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  let { type, props } = vdom;
  let classInstance = new type(props);
  let renderVdom = classInstance.render();
  // 挂载的时候计算出虚拟DOM，然后挂到类的实例上
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
/**
 * 挂载函数组件元素
 * @param {*} vdom
 * @returns
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    render(childrenVdom[i], parentDOM);
  }
}
/**
 *
 * @param {*} dom
 * @param {*} oldProps 旧属性
 * @param {*} newProps 新属性
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === 'children') {
      continue; // 后面会单独处理children属性，所以此处跳过
    }
    if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith('on')) {
      // 如：onClick;绑定事件
      // dom[key.toLocaleLowerCase()] = newProps[key];
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

/**
 * 根据虚拟DOM返回真实DOM
 * @param {*} vdom
 */
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === 'function') {
    dom = findDOM(vdom.oldRenderVdom);
  } else {
    dom = vdom.dom;
  }
  return dom;
}

/**
 * 比较新旧虚拟DOM，找到差异，更新到真实DOM上
 * @param {*} parentDOM 老的真实DOM的父元素：oldDOM.parentNode
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  let newDOM = createDOM(newVdom);
  // TODO: 现在还没实现DOM-DIFF
  parentDOM.replaceChild(newDOM, oldDOM);
}

const ReactDOM = { render };
export default ReactDOM;
