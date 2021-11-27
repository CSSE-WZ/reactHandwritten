import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// hooks本质是函数 这些函数的作用是管理一个全局变量 每次渲染都是一个独立的闭包

/**
 * 什么是纯函数？
 * 1、不能修改参数；2、不能修改函数作用域外的变量；
 * 除此之外都是副作用，如：修改DOM，修改全局变量，调用接口，开启定时器。
 * 
 * useEffect 不会阻塞浏览器渲染，而 useLayoutEffect 会阻塞浏览器渲染；
 * useEffect 会在浏览器渲染结束后执行，而 useLayoutEffect 则是在DOM更新完成后，浏览器绘制之前执行。
 */

function Animation () {
  const ref = React.useRef();
  /**
   * useLayoutEffect 是在绘制前执行的，useEffect 是在绘制后执行的
   */
  // React.useLayoutEffect(() => {
  React.useEffect(() => {
    ref.current.style.webkitTransform = 'translate(500px)';
    ref.current.style.transition = 'all 500ms'
  });
  let styles = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  };
  return <div style={styles} ref={ref}>内容</div>
}

ReactDOM.render(<Animation />, document.getElementById('root'));

