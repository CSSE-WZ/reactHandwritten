// 表示这是一个文本类型的元素，在源码里没有这样一个类型
// 对字符串 数字做特殊处理，方便后面的DOM-DIFF处理
export const REACT_TEXT = Symbol('REACT_TEXT');

export const REACT_FORWARD_REF_TYPE = Symbol('React_forward_ref');
export const REACT_PROVIDER = Symbol('react.provider');
export const REACT_CONTEXT = Symbol('react.context');
export const REACT_MEMO = Symbol('React.memo');
