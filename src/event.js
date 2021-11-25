import { updateQueue } from './Component';

/**
 * 实现事件委托，把所有的事件都绑定到document上
 * @param {*} dom
 * @param {*} eventType
 * @param {*} handler
 */
export function addEvent (dom, eventType, handler) {
  // let store = (dom.store = dom.store || {}); // 是一个对象，存放当前DOM上对应的事件处理函数
  let store;
  if (dom.store) {
    store = dom.store;
  } else {
    dom.store = {};
    store = dom.store;
  }

  // store.onclick = handleClick
  store[eventType] = handler;
  if (!document[eventType]) {
    // 如果有多个元素都绑定相同类型事件，只绑定一次
    document[eventType] = dispatchEvent;
    // document.addEventListener(eventType, dispatchEvent); //上面也可以这样写
  }
}

function dispatchEvent (event) {
  let { target, type } = event;
  let eventType = `on${type}`; // onclick
  updateQueue.isBatchingUpdate = true; // 切换到批量更新模式
  let syntheticEvent = createSyntheticEvent(event); // 基于当前的事件对象，创建一个新的合成事件对象

  // 模拟事件冒泡的过程
  while (target) {
    let { store } = target; // 此处store 即为addEvent方法中的dom.store
    let handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent);
    target = target.parentNode;
  }

  updateQueue.isBatchingUpdate = false; // 切换到非批量更新模式
  updateQueue.batchUpdate(); // 批量更新
}

// 在源码里，此处做了一些浏览器兼容性适配
function createSyntheticEvent (event) {
  let syntheticEvent = {};
  for (let key in event) {
    syntheticEvent[key] = event[key];
  }
  return syntheticEvent;
}
