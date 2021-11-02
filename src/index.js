import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

function TextInput(props, ref) {
  return <input type='text' ref={ref} />;
}

const ForwardTextInput = React.forwardRef(TextInput);
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  handleClick = () => {
    // this.textInputRef.current指向TextInputRef组件的实例
    this.textInputRef.current.focus();
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>焦点</button>
        <ForwardTextInput ref={this.textInputRef} />
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('root'));
