// 表示这是一个文本类型的元素，在源码里没有这样一个类型
// 对字符串 数字做特殊处理，方便后面的DOM-DIFF处理
export const REACT_TEXT = Symbol('REACT_TEXT');
