import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// hooks本质是函数 这些函数的作用是管理一个全局变量 每次渲染都是一个独立的闭包
// hooks最大的好处就是可以很方便的实现逻辑的复用，拆分功能，任意组合
/**
 * 什么是纯函数？
 * 1、不能修改参数；2、不能修改函数作用域外的变量；
 * 除此之外都是副作用，如：修改DOM，修改全局变量，调用接口，开启定时器。
 * 
 * useEffect 不会阻塞浏览器渲染，而 useLayoutEffect 会阻塞浏览器渲染；
 * useEffect 会在浏览器渲染结束后执行，而 useLayoutEffect 则是在DOM更新完成后，浏览器绘制之前执行。
 * 
 * forwardRef将ref从父组件转发到子组件中的dom上，子组件接受props和ref作为参数
 * useImperativeHandle 可以让你使用ref时，自定义暴露给父组件的实例值
 */
function Child (props, ref) {
  const childRef = React.useRef();
  // 在函数组件内自定义暴露给父组件ref对象
  React.useImperativeHandle(ref, () => ({
    focus () {
      childRef.current.focus()
    },
    print () {
      console.log('print');

    }
  }))
  return <input ref={childRef} />
}
let ForwardChild = React.forwardRef(Child)
function Parent () {
  const [number, setNumber] = React.useState(0);
  const inputRef = React.useRef();
  const getFocus = () => {
    inputRef.current.focus();
    inputRef.current.print();
  }
  return (
    <div>
      <ForwardChild ref={inputRef} />
      <button onClick={getFocus}>焦点</button>
    </div>
  )

}

ReactDOM.render(<Parent />, document.getElementById('root'));

