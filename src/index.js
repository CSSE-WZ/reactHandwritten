import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// hooks本质是函数 这些函数的作用是管理一个全局变量 每次渲染都是一个独立的闭包
// hooks最大的好处就是可以很方便的实现逻辑的复用，拆分功能，任意组合。颗粒化更细，逻辑更加清晰
/**
 * 自定义Hooks可以实现逻辑复用，把公共逻辑提取出来，进行复用
 * 自定义Hooks复用的是逻辑，而不是状态本身
 * 1.是一个函数
 * 2.方法名称是use开头
 * 3.在函数内部需要调用其他的Hooks
 * 
 * 应用：表格组件？
 */

function useCounter (initialState) {
  const [number, setNumber] = React.useState(initialState);
  const getFocus = () => {
    setNumber(number + 1)
  };
  return [number, getFocus]
}

function Parent1 () {
  const [number, getFocus] = useCounter(10);
  // const [number, setNumber] = React.useState(10);
  // const getFocus = () => {
  //   setNumber(number + 1)
  // }
  return (
    <div>
      <p>{number}</p>
      <button onClick={getFocus}>增加</button>
    </div>
  )
}
function Parent2 () {
  // const [number, setNumber] = React.useState(20);
  const [number, getFocus] = useCounter(20);
  // const getFocus = () => {
  //   setNumber(number + 1)
  // }
  return (
    <div>
      <p>{number}</p>
      <button onClick={getFocus}>增加</button>
    </div>
  )
}

function App () {
  return (
    <div>
      <Parent1 />
      <Parent2 />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

