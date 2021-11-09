import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.warpper = React.createRef();
  }

  addState = () => {
    const { messages } = this.state;
    this.setState({ messages: [messages.length, ...messages] });
  };
  componentDidMount() {
    this.timer = setInterval(() => {
      this.addState();
    }, 1000);
  }
  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.warpper.current.scrollTop, // 更新前向上滚动的高度
      prevScrollHeight: this.warpper.current.scrollHeight, // 更新前内容的高度
    };
  }

  componentDidUpdate(
    prevProps,
    prevState,
    { prevScrollTop, prevScrollHeight }
  ) {
    console.log('prevScrollTop', prevScrollTop, prevScrollHeight);

    this.warpper.current.scrollTop =
      prevScrollTop + this.warpper.current.scrollHeight - prevScrollHeight;
  }
  render() {
    console.log('1', this.state);

    let style = {
      height: '100px',
      width: '200px',
      border: '1px solid black',
      overflow: 'scroll',
    };
    return (
      <div style={style} ref={this.warpper}>
        {this.state.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

ReactDOM.render(<ScrollList />, document.getElementById('root'));

/**
 *  旧版生命周期（React15）
 * 1、挂载阶段
 * constructor
 * componentWillMount
 * render
 * componentDidMount
 * 2、更新阶段
 * 状态改变
 * shouldComponentUpdate
 * componentwillUpdate
 * render
 * componentDidUpdate
 * 父组件props改变时，子组件更新
 * componentWillReceiveProps
 * shouldComponentUpdate
 * componentWillUpdate
 * render
 * componentDidUpdate
 * 3、卸载阶段
 * componentWillUnmount
 */

/**
 * 新版生命周期（React16）
 * 1、创建时
 * constructor
 * getDerivedStateFromProps
 * render
 * componentDidMount
 * 2、更新时
 * getDerivedStateFromProps
 * shouldComponentUpdate
 * render
 * getSnapshotBeforeUpdate
 * componentDidUpdate
 * 3、卸载时
 * componentWillUnmount
 */
