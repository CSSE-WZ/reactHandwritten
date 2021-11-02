import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  getTextInoutFocus = () => {
    this.inputRef.current.focus();
  };
  render() {
    return (
      <div>
        <input type='text' ref={this.inputRef} />
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  handleClick = () => {
    // this.textInputRef.current指向TextInputRef组件的实例
    this.textInputRef.current.getTextInoutFocus();
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>焦点</button>
        <TextInput ref={this.textInputRef} />
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('root'));
