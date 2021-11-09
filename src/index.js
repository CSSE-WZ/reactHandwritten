import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };
  handleMouseMove = event => {
    this.setState({ x: event.clientX, y: event.clientY });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {/* <h1>移动鼠标</h1>
        <p>
          当前鼠标的位置是x={this.state.x} y={this.state.y}
        </p> */}
        {this.props.render(this.state)}
      </div>
    );
  }
}
// ReactDOM.render(<MouseTracker />, document.getElementById('root'));
ReactDOM.render(
  <MouseTracker
    render={props => (
      <div>
        <h1>移动鼠标</h1>
        <p>
          当前鼠标的位置是x={props.x} y={props.y}
        </p>
      </div>
    )}
  />,
  document.getElementById('root')
);
