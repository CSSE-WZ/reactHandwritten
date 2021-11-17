import { REACT_TEXT } from './constants';

/**
 * 不管原来是什么样的元素，都转成对象的形式，方便后续的DOM-DIFF
 * @param {*} element
 * @returns
 */
export function warpToDOM(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return {
      type: REACT_TEXT,
      props: { content: element },
    };
  } else {
    return element;
  }
}

export function shallowEqual(obj1 = {}, obj2 = {}) {
  if (obj1 === obj2) {
    return true;
  }
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }
  let key1 = Object.keys(obj1);
  let key2 = Object.keys(obj2);
  if (key1.length !== key2.length) {
    return false;
  }

  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
