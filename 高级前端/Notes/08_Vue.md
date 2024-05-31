## 01、vue3.0 中为什么要使用 Proxy，它相比以前的实现方式有什么改进

1. Vue2.x通过给每个对象添加`getter setter`属性去改变对象,实现对数据的观测,Vue3.x通过Proxy代理目标对象,且一开始只代理最外层对象,嵌套对象`lazy by default` ,性能会更好
2. 支持数组索引修改,对象属性的增加,删除

## 02、react 与 vue 数组中 key 的作用是什么

diff算法需要比对虚拟dom的修改，然后异步的渲染到页面中，当出现大量相同的标签时，vnode会首先判断key和标签名是否一致，如果一致再去判断子节点一致，使用key可以帮助diff算法提升判断的速度，在页面重新渲染时更快消耗更少

## 03、vue 中 v-if 和 v-show 的区别是什么

v-show 总是会进行编译和渲染的工作 - 它只是简单的在元素上添加了 `display: none;` 的样式。v-show 具有较高的初始化性能成本上的消耗，但是使得转换状态变得很容易。 相比之下，v-if 才是真正「有条件」的：它的加载是惰性的，因此，若它的初始条件是 false，它就不会做任何事情。这对于初始加载时间来说是有益的，当条件为 true 时，v-if 才会编译并渲染其内容。切换 v-if 下的块儿内容实际上时销毁了其内部的所有元素，比如说处于v-if下的组件实际上在切换状态时会被销毁并重新生成，因此，切换一个较大v-if块儿时会比v-show消耗的性能多。

## 04、vue-loader 的实现原理是什么

vue-loader会把sfc中的内容拆分为template，script，style三个“虚拟模块”，然后分别匹配webpack配置中对应的rules，比如script模块会匹配所有跟处理JavaScript或TypeScript相关的loader。

template中的内容会通过 vue compiler 转换为 render函数后合并到 script “虚拟模块”中。

scoped style 会经过vue-loader/style-post-loader的处理，成为只匹配特定元素的私有样式。

## 05、Vue 中 nextTick 的实现原理是什么

nextTick方法主要是使用了宏任务和微任务。它是定义了一个异步方法，如果多次调用nextTick的话，就会将方法存入队列中，通过这个异步方法来清空当前队列，这个nextTick方法就是异步方法

`nextTick` 的实现原理也是利用事件循环来进行异步操作，然后等 vue 的事件循环结束之后，再执行回调函数。首先大多数情况下，`nextTick` 会通过 `Promise.resolve()`来创建一个成功的 `Promise`，然后再通过 `Promise.then()`来将回调函数添加入微任务队列。同时，`nextTick` 还设置了状态锁`pedding`，通过`pedding`来判断当前队列当中是否已经存在一个`nextTick`的任务。这样就可以避免多次执行`nextTick`的任务，降低系统资源的使用。 前面我们说过，大多数情况下，我们使用的是`Promise.then()`将回调函数添加入事件队列。但是有些情况，我们无法使用这种方式。假如我们的浏览器不支持 `Promise` 的话，我们就无法使用 Promise 了。这种情况，我们会选择将 `nextTick` 加入到宏任务队列。另外，当 nextTick 的回调执行的时候，下一次事件循环还没有执行，这时候我们是获取不到更新渲染之后的数据的，因此，这时候我们会将 nextTick 的回调函数添加到宏任务队列当中。加入宏任务队列的方式有很多种，按照优先级来依次为`setImmediate`、`MessageChannel`、`setTimeout`。

