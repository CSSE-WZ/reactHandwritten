import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// hooks本质是函数 这些函数的作用是管理一个全局变量 每次渲染都是一个独立的闭包

/**
 * 什么是纯函数？
 * 1、不能修改参数；2、不能修改函数作用域外的变量；
 * 除此之外都是副作用，如：修改DOM，修改全局变量，调用接口，开启定时器。
 * @returns 
 */

function Counter () {
  const [number, setNumber] = React.useState(0)
  React.useEffect(() => {
    console.log('开启一个新的定时器！', number);
    const timer = setInterval(() => {
      setNumber(number + 1)
    }, 1000)
    return () => {
      console.log('清空定时器！', number);
      clearInterval(timer);
    }
  }, [number])
  return (
    <div>
      <p>{number}</p>
    </div >
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));

