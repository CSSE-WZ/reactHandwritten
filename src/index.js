import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

// 函数组件不需要实例，用完就销毁 性能高 节约内存 方便逻辑复用
// useState为什么返回数组？返回对象不好吗？
//  不好，因为对象的属性是定死的，而数组可以重命名。

// 如果组件嵌套层级深的话，每次更新会很慢，需要遍历很多层，所以需要引入Fiber，做调度，暂停渲染做其他优先级更高的事情
function Child ({ data, handleClick }) {
  console.log('Child render');
  return (
    <button onClick={handleClick}>{data.number}</button>
  )

}
// memo 是什么？备忘录，属性变了重新渲染，属性不变，不重新渲染。
// React.useMemo React.useCallback 依赖项未改变时，使用上次的值，改变的话，重新计算值；
let MemoChild = React.memo(Child);

let lastData;
function Counter () {
  console.log('Counter render');

  const [name, setName] = React.useState('haha');
  const [number, setNumber] = React.useState(0);
  // let data = { number };
  // let handleClick = () => setNumber(number + 1)
  let data = React.useMemo(() => ({ number }), [number]);
  console.log(data === lastData);
  lastData = data;
  let handleClick = React.useCallback(() => setNumber(number + 1), [number]);
  return (
    <div>
      <input value={name} onChange={event => setName(event.target.value)} />
      <MemoChild handleClick={handleClick} data={data} />
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
