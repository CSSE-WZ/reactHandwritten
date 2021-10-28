## 1.JSX的执行过程
1. 我们写代码的时候写的JSX : `<h1>hello</h1>`
2. 打包的时候，会调用webpack中的 babel-loader 把JSX写法转换成JS写法 creatElement
3. 我们在浏览器里执行createElement,得到虚拟DOM，也就是React元素，它是一个普通的JS对象，描述了你在界面上想看到的DOM元素的样式
4. 把React元素（即虚拟DOM）给了ReactDOM.render(),render方法会把虚拟DOM转换成真实DOM，并且插入页面

