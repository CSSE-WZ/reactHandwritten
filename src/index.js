import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// 高阶组件就是一个函数，传给它一个组件，返回一个新组件
// 高阶组件的作用其实就是为了组件之间的代码复用
// 两大用途：属性代理 反向继承
// const NewComponent = higherOrderComponent(OldComponent)

// 基于反向继承：拦截生命周期、state、渲染过程

// 这是一个第三方组件库，现在想要修改此组件
class AntDesignButton extends React.Component {
  state = { name: 'zhangsan' };
  componentWillMount() {
    console.log('AntDesignButton componentWillMount');
  }
  componentDidMount() {
    console.log('AntDesignButton componentDidMount');
  }
  render() {
    console.log('AntDesignButton render');
    return <button name={this.state.name}>{this.props.title}</button>;
  }
}
const warpper = OldComponent => {
  return class extends OldComponent {
    // state = { number: 0 };
    constructor(props) {
      super(props);
      // ...this.state 合并父类的state
      this.state = { ...this.state, number: 0 };
    }
    componentWillMount() {
      console.log('warpper componentWillMount');
    }
    componentDidMount() {
      console.log('warpper componentDidMount');
    }
    handleClick = () => {
      this.setState({ number: this.state.number + 1 });
    };
    render() {
      console.log('warpper render');
      // super在普通方法中，指向父类的原型对象；在静态方法中，指向父类
      let renderElement = super.render();
      // React元素不可修改
      // renderElement.props.children = this.state.number;
      // renderElement.props.onClick = this.props.handleClick;
      let newProps = {
        ...renderElement.props,
        onClick: this.handleClick,
      };
      let cloneElement = React.cloneElement(
        renderElement,
        newProps,
        this.state.number
      );
      return cloneElement;
    }
  };
};

let WarpperAntDesignButton = warpper(AntDesignButton);

ReactDOM.render(
  <WarpperAntDesignButton title='标题' />,
  document.getElementById('root')
);

class Father {}
class Child extends Father {}
let child = new Child();
console.log('111', child.__proto__.__proto__ === Father.prototype);
console.log('222', child.__proto__ === Child.prototype);
console.log('222', child.constructor === Child);
