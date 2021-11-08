import { REACT_TEXT } from './constants';

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
  let { type, props } = vdom;
  let dom; // 真实DOM元素
  if (type === REACT_TEXT) {
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
  // vdom.dom = dom;

  return dom;
}

/**
 * 挂载类组件
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  let { type, props } = vdom;
  let classInstance = new type(props); // 类组件的实例
  let renderVdom = classInstance.render(); // 调用实例的render方法生成虚拟DOM
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
    } else {
      dom[key] = newProps[key];
    }
  }
}

const ReactDOM = { render };
export default ReactDOM;
