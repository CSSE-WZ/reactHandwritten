import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// 函数组件不需要实例，用完就销毁 性能高 节约内存 方便逻辑复用
// useState为什么返回数组？返回对象不好吗？
//  不好，因为对象的属性是定死的，而数组可以重命名。

// 如果组件嵌套层级深的话，每次更新会很慢，需要遍历很多层，所以需要引入Fiber，做调度，暂停渲染做其他优先级更高的事情
function Counter1 () {
  const [number, setNumber] = React.useState('Counter1');
  const [number1, setNumber1] = React.useState(1);
  return (
    <div>
      Counter1: {number}
      <p>{number1}</p>
    </div >
  )

}


function Counter () {
  const [number, setNumber] = React.useState(0);
  const [number1, setNumber1] = React.useState(1);
  const [number2, setNumber2] = React.useState(2);
  return (
    <div>
      SubCounter: {number}
      <p>{number1}</p>
      <p>{number2}</p>
      <Counter1 />
      <button onClick={() => { setNumber(number + 1) }}> + </button>
    </div >
  )

}

ReactDOM.render(<Counter />, document.getElementById('root'));


// import React from './react';
// import ReactDOM from './react-dom'; //React 的DOM渲染库

// function Counter () {
//   // const [number, setNumber] = React.useState(0);
//   // const [number1, setNumber1] = React.useState(1);
//   // const [number2, setNumber2] = React.useState(2);
//   return (
//     <div>
//       <p>111</p>
//       SubCounter: { }
//       {/* <p>{number1}</p> */}
//       {/* <p>{number2}</p> */}
//       {/* <button onClick={() => { setNumber(number + 1) }}> + </button> */}
//     </div >
//   )

// }
// // 性能高 节约内存 方便逻辑复用
// class A extends React.Component {
//   state = { num: 1 }
//   render () {
//     return (
//       <div>
//         <div onClick={() => this.setState({ num: 1 })}>1111</div>
//         <Counter />

//       </div>
//     )
//   }

// }


// ReactDOM.render(<A />, document.getElementById('root'));
