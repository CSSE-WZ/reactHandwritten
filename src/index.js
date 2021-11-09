import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

let ThemeContext = React.createContext();
// ThemeContext = { Provider, Consumer } // Provider提供者 Consumer 消费者:一般使用在函数组件中
let { Provider, Consumer } = ThemeContext;

class Header extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `1px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        头部
        <Title />
      </div>
    );
  }
}
class Title extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `1px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        标题
      </div>
    );
  }
}
class Main extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `1px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        主体区
        <Content />
      </div>
    );
  }
}
class Content extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          margin: '10px',
          border: `1px solid ${this.context.color}`,
          padding: '5px',
        }}
      >
        内容
        <button onClick={() => this.context.changeColor('red')}>变红</button>
        <button onClick={() => this.context.changeColor('green')}>变绿</button>
      </div>
    );
  }
}
class Page extends React.Component {
  state = { color: 'red' };

  changeColor = color => {
    this.setState({ color });
  };

  render() {
    let value = { color: this.state.color, changeColor: this.changeColor };
    return (
      <Provider value={value}>
        <div
          style={{
            margin: '10px',
            border: `2px solid ${this.state.color}`,
            padding: '5px',
            width: '200px',
          }}
        >
          <Header />
          <Main />
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById('root'));
