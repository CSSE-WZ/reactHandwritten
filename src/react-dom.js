import { REACT_FORWARD_REF_TYPE, REACT_TEXT, REACT_MEMO } from './constants';
import { addEvent } from './event';

/**
 * 把虚拟DOM转成真实DOM插入容器
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器
 */
function render(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

/**
 * 把虚拟DOM转成真实DOM
 * @param {*} vdom  虚拟DOM
 */
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom; // 真实DOM元素
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    // 如果type.$$typeof属性是REACT_FORWARD_REF_TYPE
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
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
function mountMemoComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type.type(props);
  vdom.prevProps = props; // 记录一下老属性，在更新的时候会用到
  vdom.renderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
/**
 * 挂载类组件
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  let { type, props, ref } = vdom;
  let defaultProps = type.defaultProps || {};
  let classInstance = new type({ ...defaultProps, ...props });

  // 如果类上有contextType属性，则给类的实例添加context属性
  if (type.contextType) {
    classInstance.context = type.contextType._value;
  }

  vdom.classInstance = classInstance; // 往虚拟DOM上挂载类组件实例，用于后续通过实例更新类组件
  classInstance.componentWillMount && classInstance.componentWillMount();
  let renderVdom = classInstance.render();
  // classInstance.componentDidMount && classInstance.componentDidMount(); //在这执行的话不是在dom挂载后执行的

  // 挂载的时候计算出虚拟DOM，然后挂到类的实例上
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  if (ref) {
    ref.current = classInstance; // 让ref.current属性指向类组件的实例
  }
  let dom = createDOM(renderVdom);
  // 暂时把DidMount方法暂存到dom上
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
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
      if (newProps[key]) {
        dom[key] = newProps[key];
      }
    }
  }
}

/**
 * 根据虚拟DOM返回真实DOM
 * @param {*} vdom
 */
export function findDOM(vdom = {}) {
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
 * @param {*} nextDOM 当前DOM节点的下一个真实DOM节点
 */

export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
    // 如果新老虚拟DOM都是null,则返回null
  } else if (oldVdom && !newVdom) {
    let oldDOM = findDOM(oldVdom); // 老的真实DOM
    // 如果老的存在，而新的为null，则说明此时是卸载组件
    oldDOM.parentNode.removeChild(oldDOM); // 删除老的真实DOM
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount(); // 执行组件卸载方法
    }
  } else if (!oldVdom && newVdom) {
    // 如果老的不存在，新的存在，说明此时是初次渲染，创建新的DOM并添加到父DOM容器中
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    // 如果新的老的都存在，但是type(如p div)不一致，也不能复用
    let oldDOM = findDOM(oldVdom);
    let newDOM = createDOM(newVdom);
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);
    if (oldDOM.classInstance && oldDOM.classInstance.componentWillUnmount) {
      oldDOM.classInstance.componentWillUnmount();
    }
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }
  } else {
    // 老的有，新的也有，而且type也相同，需要复用老的节点，进行深度的递归DOM-DIFF
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  // oldVdom.type 类组件 函数组件 文本组件 String（原生组件）
  if (oldVdom.type && oldVdom.type.$$typeof === REACT_MEMO) {
    debugger;
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    // --说明是文本节点的更新
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content;
    }
  } else if (typeof oldVdom.type === 'string') {
    // --说明是原生组件，如p div

    // 让新的虚拟DOM的真实DOM属性 等于 老的虚拟DOM对应的那个真实DOM
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    // 用新的属性，更新老的属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {
      // --说明是一个类组件
      updateClassComponent(oldVdom, newVdom);
    } else {
      // --说明是一个函数组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  // 比较老的属性对象和新的属性对象
  if (type.compare(prevProps, newVdom.props)) {
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    newVdom.prevProps = newVdom.props; // 记录一下老属性，在更新的时候会用到
  } else {
    let parentDOM = findDOM(oldVdom).parentNode;
    let { type, props } = newVdom;
    let renderVdom = type.type(props);
    newVdom.oldRenderVdom = renderVdom;
    newVdom.prevProps = newVdom.props; // 记录一下老属性，在更新的时候会用到
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  }
}

function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  let renderVdom = type(props);
  newVdom.oldRenderVdom = renderVdom;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
}
/**
 * 更新类组件
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance);
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  // 因为这里是由于父组件更新引起的更新，当父组件重新渲染时，给子组件传递新的属性
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdater(newVdom.props);
}

/**
 * 更新儿子们
 * @param {*} parentDOM
 * @param {*} oldVChildren
 * @param {*} newVChildren
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    // 找到当前虚拟DOM节点后面的最近一个虚拟DOM节点，让后续插入当前节点时可以插入到正确的位置（insertBefore）
    let nextVNode = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    let nextNode = findDOM(nextVNode); // 拿到真实DOM
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextNode);
  }
}

// export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
//   let oldDOM = findDOM(oldVdom);
//   let newDOM = createDOM(newVdom);
//   // TODO: 现在还没实现DOM-DIFF
//   parentDOM.replaceChild(newDOM, oldDOM);
// }

const ReactDOM = { render };
export default ReactDOM;
