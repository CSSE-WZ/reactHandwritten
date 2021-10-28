export class Component {
  static isReactComponent = {}; //自定义简化实现
  constructor(props) {
    this.props = props;
  }
}

// Component.prototype.isReactComponent = {};  //源码实现:isReactComponent用于后续判断组件类型是函数组件还是类组件
