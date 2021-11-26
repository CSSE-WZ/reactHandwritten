import React from './react';
import ReactDOM from './react-dom'; //React 的DOM渲染库

function reducer (state, action) {
  switch (action.type) {
    case 'add':
      return { number: state.number + 1 }
    case 'minus':
      return { number: state.number - 1 }
    default:
      return state;
  }
}
function Counter () {
  const [count, setCount] = React.useState(0)
  const [state, dispatch] = React.useReducer(reducer, { number: 0 })
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}> - </button>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: 'add' })}> + </button>
      <button onClick={() => dispatch({ type: 'minus' })}> - </button>
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
