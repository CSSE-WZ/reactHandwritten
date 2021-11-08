import { compareTwoVdom, findDOM } from './react-dom';

export let updateQueue = {
  isBatchingUpdate: false, // 通过此变量来控制是否批量更新
  updaters: [],
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};

function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 是否更新，默认true
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false; // 如果shouldComponentUpdate方法存在且返回false，则不更新
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  // 其实不管要不要更新，属性和方法否要更新为最新的
  if (nextProps) {
    classInstance.props = nextProps; // 修改实例属性
  }
  if (classInstance.constructor.getDerivedStateFromProps) {
    let nextState = classInstance.constructor.getDerivedStateFromProps(
      nextProps,
      classInstance.state
    );
    if (nextState) {
      classInstance.state = nextState; // 修改实例状态
    }
  } else {
    classInstance.state = nextState; // 修改实例状态
  }

  if (willUpdate) {
    classInstance.forceUpdate(); // 然后调用类组件实例的updateComponent进行更新
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; // 保存将要更新的队列
    this.callbacks = []; // 保存将要执行的回调函数
  }

  addState(partialState, callback) {
    this.pendingStates.push(partialState);

    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }

    this.emitUpdater(); //触发更新逻辑
  }

  // 状态和属性的变化，都会执行此方法，让组件刷新
  emitUpdater(nextProps) {
    this.nextProps = nextProps; // 可能会传过来一个新的属性对象：用于后续的DOM-DIFF

    // 如果当前处于批量更新模式，那么就把此updater实例添加到updateQueue.updaters中去
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent(); // 让组件更新
    }
  }

  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }

  // 根据老状态和pendingStates这个更新队列，计算新状态并返回
  getState() {
    let { classInstance, pendingStates, callbacks } = this;
    let { state } = classInstance; // 先获取老的原始的组件状态
    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0; // 清空等待更新的队列

    callbacks.forEach(callback => callback());
    callbacks.length = 0; // 清空回调函数队列

    return state; // 返回新的状态
  }
}

export class Component {
  static isReactComponent = {}; //自定义简化实现

  constructor(props) {
    this.props = props;
    this.state = {};
    // 每一个类组件的实例有一个updater更新器，参数就是类的实例
    this.updater = new Updater(this);
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }

  /**
   * 组件式更新
   * 1、获取老的虚拟DOM
   * 2、根据最新的属性和状态计算新的虚拟DOM
   * 3、然后进行比较，查找差异，把这些差异同步到真实DOM上
   */
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom; // 老的虚拟DOM
    let newRenderVdom = this.render(); // 新的虚拟DOM

    // 根据老的虚拟DOM查到老的真实DOM
    let oldDOM = findDOM(oldRenderVdom);
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom); // 比较差异，把更新同步到真实DOM
    this.oldRenderVdom = newRenderVdom;

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}

// Component.prototype.isReactComponent = {};  //源码实现:isReactComponent用于后续判断组件类型是函数组件还是类组件
