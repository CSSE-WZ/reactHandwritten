import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// 高阶组件就是一个函数，传给它一个组件，返回一个新组件
// 高阶组件的作用其实就是为了组件之间的代码复用
// 两大用途：属性代理 反向继承
// const NewComponent = higherOrderComponent(OldComponent)

// 高阶组件来自于高阶函数
const withLoading = OldComponent => {
  return class extends React.Component {
    show = () => {
      let div = document.createElement('div');
      div.innerHTML = `<p id='loading' style="position: absolute;top:100px;z-index:10;background-color:gray">loading...</p>`;
      document.body.appendChild(div);
    };

    hide = () => {
      document.getElementById('loading') &&
        document.getElementById('loading').remove();
    };

    render() {
      return <OldComponent {...this.props} show={this.show} hide={this.hide} />;
    }
  };
};
@withLoading
class Panel extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    );
  }
}
// let LoadingPanel = withLoading(Panel);
ReactDOM.render(<Panel />, document.getElementById('root'));
