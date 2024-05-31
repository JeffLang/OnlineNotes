## 01、了解 React 中的 ErrorBoundary 吗，它有那些使用场景

```tsx
import { Component } from 'react';

export default class ErrorBoundary extends Component<any> {
  constructor(props: any) {
    super(props);
    // initialize the error state
    this.state = { hasError: false };
  }

  // if an error happened, set the state to true
  static getDerivedStateFromError(error: any) {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // 在捕获到错误后，更新状态以显示错误信息,
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    // if error happened, return a fallback component
    if ((this.state as { hasError: boolean }).hasError) {
      return this.props.fallback ?? <>Oh no! Epic fail!</>;
    }

    return this.props.children;
  }
}

```

关键是`componentDidCatch`

[参考资料](https://juejin.cn/post/6844904014581088270)

## 02、hook

1.类组件比起函数组件更难以理解。

2.无需修改组件结构的情况下复用状态逻辑，状态管理更加清晰。

3.不用写类函数就可以使用更多的 React 特性。

4.更符合 React 本身的思想，函数式、组件化。

5.组件树层级变浅 （原本的HOC/render props 等方式增加了组件树层数及渲染，在 React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”，这些功能都可以通过强大的自定义的 Hooks 来实现。）

6.不用再去考虑 this 的指向、生命周期问题。

## 03、React 中，cloneElement 与 createElement 各是什么，有什么区别

```jsx
React.cloneElement(element, [props], [...children]); 
React.createElement(type, [props], [...children]);
```

直接上 API，很容易得出结论：首参不一样。这也是他们的最大区别：

1. `cloneElement`，根据 Element 生成新的 Element
2. `createElement`，根据 Type 生成新的 Element

然而，此时估计还是云里雾里，含糊不清，需要弄清它，首先要明白俩概念

1. Type
2. Element

### React.cloneElement 的使用场景

> Author 回答者: [okkjoo(opens in a new tab)](https://github.com/okkjoo)

`createElement`：

- 第一个参数是 type 简单来说就是各种 标签名字（包括 HTML 自身的，还有 React 组件名字）
- 第二个参数是传入的属性
- 第三个参数以及之后的参数就是作为组件的子组件 JSX 编写的代码就是转换为这个方法，一般用了 JSX 写法都不会再需要自己直接调用 该方法

`cloneElement`

- 第一个参数是 一个 React 元素
- 新添加的属性会并入原有的属性 一般配合 `React.children.map`使用，如用于动态地给子组件添加更多 props 信息、样式

更深一点的原因在于，React 元素是 不可变对象 例如 props.children 获取到的只是一个 描述符，不能直接修改它的任何属性，只能读取他的信息。 所以我们可以选择拷贝它们，然后再修改、添加

## 04、自定义Message

首先肯定需要暴露一个方法来进行组建的挂载显示

```javascript
export default function showMessage(content) {
  // 显示通知，content 为 ReactNode
}
```

组件挂载

```javascript
import { MutableRefObject, createRef } from 'react';
// 引入react-dom
import { createRoot } from 'react-dom/client';
import { Notifications } from './Notification';
// 创建一个容器来加载message
const el = document.createElement('div');
el.style.position = 'fixed';
el.style.top = '10px';
el.style.zIndex = '999';
el.style.left = '50%';
el.style.transform = 'translateX(-40%)';

// 将这个el挂载到body的最后一个元素
document.body.appendChild(el);

const root = createRoot(el);

// 创建一个 Ref
const notificationRef: MutableRefObject<any> = createRef();

// 渲染jsx组件
root.render(<Notifications ref={notificationRef} />);

export default function ShowMessage(content: string) {
  // 创建一个
  notificationRef.current.notify(content);
}

```

定义一个通知列表组件和一个通知组件来维护，因为这个通知会同时出现很多个

```tsx
/**
 * 这里需要设计两个组件，一个是通知列表组件（Notifications），一个是单个通知组件（NotificationItem）。通知列表组件主要是管理通知列表和动画管理，而单个通知组件主要是渲染通知和移除控制，两个组件设计如下：
 */

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  ReactElement,
  useRef
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface INotificationItem {
  content: string;
  onRemove: () => void;
}

/**
 * @NotificationItem 单通知组件
 * @returns
 */
export const NotificationItem: React.FC<INotificationItem> = ({ content, onRemove }) => {
  // 如果鼠标在通知上,则不会进行消除
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timer;
    // 如果鼠标在通知上,则不会进行消除
    if (!isHover) {
      timerId = setTimeout(() => {
        // 移除当前
        onRemove();
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        background: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            padding: '10px',
              marginBottom: '10px',
                color: 'black'
      }}
      >
      {content}
    </div>
  );
};

// 使用forwardRef能够自动接收ref
export const Notifications: React.FC<any> = forwardRef((_, ref) => {
  // 通知列表
  const [list, setList] = useState<ReactElement[]>([]);

  // 通知自增 key
  const incrementKeyRef = useRef(0);

  // 暴露当前组件的一些方法
  useImperativeHandle(ref, () => ({
    // 暴露出一个notify方法
    notify(content: string) {
      // 自增 key
      const key = incrementKeyRef.current++;
      setList(list => {
        // 动画使用的是 React Transition Group
        const noti = (
          <CSSTransition key={key} timeout={300} classNames='message' className='message'>
            <NotificationItem
              onRemove={() => {
                // 移除通知
                setList(list => {
                  return list.filter(item => item.key !== key.toString());
                });
              }}
              content={content}
              />
          </CSSTransition>
        );
        const newList = [...list, noti];
        return newList;
      });
    }
  }));

  return <TransitionGroup>{list}</TransitionGroup>;
});
```

[参考资料](https://zhuanlan.zhihu.com/p/551548383)

## 05、如何使用 react hooks 实现 useFetch 请求数据

```javascript
// 自定义hook

import { useEffect, useState } from 'react';

/**
 *
 */
export function useFetch<R, P>(
  getFunction: any,
  params: P,
  callBack?: () => void,
  initRes?: R,
    execute: boolean = true
): [R, boolean, (params?: Partial<P>) => void] {
    const [res, setRes] = useState(initRes as R);
const [fetching, setFetch] = useState(false);

// 定义一个发送请求的函数
// 参数也许并不是每次都完整需要 Partial<P>
const run: (params?: Partial<P>) => void = async (params?: any) => {
  if (fetching) return;
  console.log('开始请求');
  setFetch(true);
  try {
    setRes(await getFunction(params));
    setFetch(false);
    // 请求完成的回调
    callBack?.();
  } catch (err) {
    console.error(err);
    setFetch(false);
  }
};

useEffect(() => {
  execute && run(params);
}, []);

return [res, fetching, run];
}

```

## 06、React Portal 有哪些使用场景

在以前， `react` 中所有的组件都会位于 `#app` 下，而使用 `Portals` 提供了一种脱离 `#app` 的组件。

因此 `Portals` 适合脱离文档流(out of flow) 的组件，特别是 `position: absolute` 与 `position: fixed` 的组件。比如模态框，通知，警告，goTop 等。

```javascript
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const maskRoot = document.getElementById('mask-root');

const Mask: React.FC<any> = ({ children }) => {
  const [el] = useState(document.createElement('div'));

  useEffect(() => {
    maskRoot?.appendChild(el);
    return () => {
      maskRoot?.removeChild(el);
    };
  }, []);
  return createPortal(children, el);
};

export default Mask;

```

## 07、什么是 virtual DOM，它的引入带了什么好处

### 优点

- 虚拟DOM最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的DOM，可以是安卓和IOS的原生组件，可以是近期很火热的小程序，也可以是各种GUI
- vdom把渲染过程给抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配DOM以外的渲染目标
- vdom在牺牲（牺牲很关键）部分性能的前提下，增加了可维护性，这也是很多框架的通性。实现了对dom的集中化操作，在数据改变时先对虚拟dom进行修改，再反映到真是的DOM中，用最小的代价来更新DOM，提升效率

### 缺点

- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
- 虚拟DOM需要在内存中维护一份DOM的副本
- 如果虚拟DOM大量修改，这是合适的，但是单一的，频繁的更新的话，虚拟DOM将会花费更多的时间处理计算的工作。所以，如果你有一个DOM节点相对较少页面，用虚拟DOM，它实际上可能会更慢，但对于大多数单页面应用，这应该都会更快

## 08、react 与 vue 数组中 key 的作用是什么

diff算法需要比对虚拟dom的修改，然后异步的渲染到页面中，当出现大量相同的标签时，vnode会首先判断key和标签名是否一致，如果一致再去判断子节点一致，使用key可以帮助diff算法提升判断的速度，在页面重新渲染时更快消耗更少

## 09、react 中 ref 是干什么用的，有哪些使用场景

**取得深层次的dom的结构。进行操作；我用过的主要是对表格滚动条的操作**

- 传入字符串，使用时通过 this.refs.传入的字符串的格式获取对应的元素
- 传入对象，对象是通过 React.createRef() 方式创建出来，使用时获取到创建的对象中存在 current 属性就是对应的元素
- 传入函数，该函数会在 DOM 被挂载时进行回调，这个函数会传入一个 元素对象，可以自己保存，使用时，直接拿到之前保存的元素对象即可
- 传入hook，hook是通过 useRef() 方式创建，使用时通过生成hook对象的 current 属性就是对应的元素

## 10、react hooks 中如何模拟 componentDidMount

在 `useEffect`，把第二个参数即依赖的状态，设置为 `[]`

## 11、如果使用 SSR，可以在 created/componentWillMount 中访问 localStorage 吗

不可以，created/componentWillMount 时，还未挂载，代码仍然在服务器中执行，此时没有浏览器环境，因此此时访问 localStorage 将会报错

### next 14 简单教程

创建一个最新（14）

```shell
npx create-next-app@latest --typescript
```

#### app Router

路由以app文件夹为基础，每一个页面需要创建一个文件夹承载，文件以`page.tsx`命名，组件名随便取

结构如下

```text
└── pages
    ├── about.js
    ├── index.js
    └── team.js
```



#### pages Router

路由以pages文件夹为基础，可以直接在pages目录下创建文件，路由为`/routerName`

结果如下

```text
└── pages
    ├── about.js
    ├── index.js
    └── team.js
```

#### 静态导出

```javascript
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}

module.exports = nextConfig
```



## 12、react hooks 如何替代或部分替代 redux 功能

`useReducer`+`useContext`

`reducer.ts`

```typescript
// 定义一个useReducer的reducer\
// 定义一个初始化的state
export const initState = {
  count: 0
};
// 这个reducer有两个参数,一个是state,一个是action
export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, count: state.count + action.value };
    default:
      return state;
  }
};

```

## 13、什么是React Fiber？

React Fiber是React 16中新的协调算法，它的主要目的是提高React在大型应用中的性能表现并解决React的调度问题。React Fiber将渲染过程分割成多个阶段，每个阶段可以被中断和恢复，使得React在执行渲染任务时可以更好地控制任务的优先级和执行顺序，提高了应用的性能表现。

## 14、React hooks 中 useCallback 的使用场景是什么

能想到的只有两个场景

1. 作为props传递的函数，集合memo一起使用；
2. 作为更新触发的依赖项 主要目的是为了避免高昂的计算和不必要的重复渲染

## 15、useEffect 中如何使用 async/await

根据文档及 ts 的提示来看，`useEffect` 的回调参数返回的是一个清除副作用的 `clean-up` 函数。因此无法返回 `Promise`，更无法使用 `async/await`

```javascript
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

**此时可以选择再包装一层 async 函数，置于 useEffect 的回调函数中，变相使用 async/await**

```javascript
async function fetchMyAPI() {
  let response = await fetch("api/data");
  response = await res.json();
  dataSet(response);
}

useEffect(() => {
  fetchMyAPI();
}, []);
```

## 16、react hooks 的原理是什么

React Hooks 是 React 16.8 引入的一个新特性，它允许在函数组件中使用状态和其他 React 功能，而无需编写类组件。它的实现原理是通过利用 JavaScript 的闭包和函数式编程的思想来实现。

每个 Hook 都是一个函数，它可以对组件的状态进行操作或者访问 React 的其他功能。当组件渲染时，React 会根据每个 Hook 调用的顺序来维护内部的状态并执行相应的操作。

使用 Hook 的过程中，React 维护了每个组件的“Hook 状态链”，它是一个单向链表结构，存储着所有使用 Hook 的状态信息。每次组件更新时，React 会检查使用的 Hook 是否发生变化，并根据变化来更新状态链中的对应状态。

总体来说，React Hooks 的实现原理是基于函数式编程的思想来实现的，通过函数的调用和闭包的机制来管理状态，使得组件代码更加简洁、易于维护。

## 17、redux 解决什么问题，还有什么其他方案

1. mobx
2. useContext ➕ useReducer

## 18、为什么不能在表达式里面定义 react hooks

在 React 中，Hooks 是一种特殊的函数，用于在函数组件中添加状态、生命周期等特性。Hooks 可以在函数组件的顶层使用，但不能在条件语句、循环语句或嵌套函数中使用。这是因为 Hooks 的使用依赖于 React 的调用顺序和内部状态的管理机制。

下面是为什么不能在表达式中定义 React Hooks 的原因：

1. **Hooks 必须在函数组件的顶层使用**：
   - React Hooks 必须在 React 函数组件的顶层使用，而不是在函数的内部或表达式中使用。这是因为 React 依赖于 Hooks 的调用顺序来确定组件的状态和效果的正确应用。
   - 如果在表达式中定义 Hooks，React 将无法确定 Hooks 的调用顺序，可能会导致状态错误或效果不一致。
2. **Hooks 需要在每次渲染时保持稳定**：
   - React Hooks 需要在每次组件渲染时保持稳定，以便能够正确地管理组件的状态和效果。
   - 如果在表达式中定义 Hooks，它们的调用可能会随着表达式的求值而发生变化，这将破坏 React 的调用顺序和状态管理机制。

因此，为了确保 React 组件的正确运行和状态管理，Hooks 必须在函数组件的顶层使用，而不能在表达式中定义。如果需要根据条件动态使用 Hooks，可以考虑使用条件渲染或自定义钩子来管理。

## 19、关于 React hooks 的 caputre value，以下输出多少

```javascript
function App() {
  const [count, setCount] = useState(0);
  const incr = () => {
    setTimeout(() => {
      setCount(count + 1);
    }, 3000);
  };
  return <h1 onClick={incr}>{count}</h1>;
}
```

结论：因为setCount在三秒后统一执行3次，如果传的是值，所以会被节流

如果想调用十次，则需要将`setCount(count + 1);`改写为`setCount(count => count + 1);`

## 20、在 redux 中如何发送请求

- `redux v4`中可以使用`redux-thunk`，然后在`action`中返回一个函数就可以使用异步

- `redux-react`可以使用`createAsyncThunk`创建异步`redux`

## 21、React 在 setState 时发生了什么

- 如果新状态不依赖于原状态【使用对象方式】

- 如果新状态依赖于原状态 【使用函数方式】

- 如果需要在setState()执行后，获取最新的状态数据，可以在第二个callback函数中读取到异步更新的最新值

- 在组件生命周期或React合成事件中，setState是异步；

- this.state是否异步，关键是看是否命中 batchUpdata 机制，命中就异步，未命中就同步。

- setState 中的 preState 参数，总是能拿到即时更新（同步）的值。

- 在setTimeout或者原生dom事件中，setState是同步；

  注：最新react setTimeout中也是异步

- 不要直接修改state中的引用数据

## 22、react的diff算法

传统的diff算法是通过**循环递归**的方式对dom节点进行依次的比对，然后判断每个节点的状态以及要执行的操作，效率较低，其复杂度可达到O(n^3)，其中，n所代表的就是tree的节点个数。

### 策略一：tree diff——层级控制，对dom节点的跨层级操作不做优化，只对同层级的节点进行比较。

![img](https://pic2.zhimg.com/80/v2-2fd15c716c2590813f8c9526cbc7aae5_720w.webp)

如上图所示，在React的算法中，只会对相同颜色的方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会进一步的比较。这样只需要对树进行一次遍历，就完成对整个DOM树的比较。

tree层级示例：

![img](https://pic2.zhimg.com/80/v2-28e90f535b7721674610927f909c63e1_720w.webp)

tree层级下diff算法策略示例图

新形成的dom树中R节点下没有了A节点，那么直接删除A节点，在D节点下新建A节点以及子节点。

React diff 的执行情况：**create A -> create B -> create C -> delete A**

### 策略二：component diff——dom节点组件的比较。

（1）、如果是同一个类的组件，则会继续往下diff运算，更新节点属性；

*（开发小建议：如果确切知道该组件可以不用更新，可以使用react生命周期函数shouldComponentUpdate()方法进行判断优化，阻断不必要的render）*

（2）、如果不是同一个类的组件，那么直接删除这个组件的所有子节点，创建新的组件。（即使是类似的组件，但只要组件不同，就会被销毁重新创建）

component层级示例：

![img](https://pic2.zhimg.com/80/v2-01d30547c443b095e0a7764d25433295_720w.webp)

component层级下diff算法策略示例图

新形成的dom树中R节点下D组件被替换成G组件，那么直接删除D，在R下新建G节点以及子节点。

React diff 的执行情况：**create G -> create E -> create F -> delete D**

### 策略三：element diff——dom同层级单个节点的比较。

比较策略：先将所有列表遍历一遍，确定需要新增和删除的节点，再确定需要移动的节点。

同一层级的节点，每个节点在对应的层级用唯一的key作为标识，diff算法有3种节点的操作：

（1）、插入（INSERT_MARKUP）：新的节点不在旧集合中，对新节点进行插入操作。

（2）、移动（MOVE_EXISTING）：该节点存在于旧集合中且是可更新的类型，此时可复用之前的node节点，更新属性，执行移动操作。

（3）、删除（REMOVE_NODE）：原节 删除操作。

element层级下node节点移动遵循的算法条件（规则）：

（1）、当mountIndex > lastIndex时，更新lastIndex，不执行移动

（2）、当mountIndex = lastIndex时，不执行移动

（3）、当mountIndex < lastIndex时，将当前节点移动到index的位置——只有改种情况下，才移动

其中： •index：新集合的遍历下标。

•mountIndex：当前操作\移动的节点在旧集合中的下标。

•lastIndex：访问过的节点在旧集合中最右的位置。循环比较初始值为0。

规则说明：若当前访问的节点在旧集合中的位置比lastIndex大，即节点在原集合中比在新集合中靠右，说明该元素不会影响到其他元素的位置，因此不会被添加到差异队列中，不执行移动操作，反之，进行移动操作。

详细解析说明：

element层级示例一：

![img](https://pic3.zhimg.com/80/v2-4f7527cc4c179d906f1a7c6d92a2e766_720w.webp)

element层级下diff算法策略示例图一

![img](https://pic1.zhimg.com/80/v2-5ba964510e35b6920e0492fa21b393e0_720w.webp)

示例图一解析

该示例中，实际的移动操作是A、C。在移动C之后，C已经是遍历中的最后一个节点，所以diff操作结束。

element层级示例二：

![img](https://pic2.zhimg.com/80/v2-f723847ff0719c315eccd44206970001_720w.webp)

element层级下diff算法策略示例图二

![img](https://pic4.zhimg.com/80/v2-09c600632eb3764828624b1089157fc7_720w.webp)

示例图二解析

该示例中，实际的移动操作只有A。当完成新集合中所有节点的差异对比后，对旧集合进行遍历，判断是否存在新集合中不存在的节点，发现D符合该删除条件，则执行删除D节点的操作，diff算法完成。

以上，是react中diff算法的三种策略，策略一和二只有新建和删除节点的操作，而策略三中则有新建、删除、移动三种节点的操作。通过这三种策略可以明显的将传统的diff算法的复杂度进行优化。

**但react diff算法也有明显的不足与待优化的地方：**

如下图示例：该示例中，理想的移动策略是只移动D，但实际的移动操作是A、B、C

![img](https://pic1.zhimg.com/80/v2-51ae926b03bd5586cabfa16437c614c0_720w.webp)

![img](https://pic3.zhimg.com/80/v2-b6dc3c090e4498da5f4b8cc37d7c1216_720w.webp)

因此，在开发中，应该尽量减少将最后一个节点移动到列表首位的操作。

## 23、在 React 应用中如何排查性能问题

1、使用 Performance 录制应用快照，查看调用情况 

2、查看network中网络请求情况，是否有资源因过大请求阻塞，导致后续资源无法加载，这种情况一般选择分包或固定资源选择cdn分担（多域名。浏览器设置的http2.0以下同域名仅允许同时最多6个tcp的限制） 

3、可以通过 React Developer Tools 的 Profiler 的 Flamegraph（火焰图）或 Ranked（渲染时长排行榜） 查看各组件的渲染时长，根据对应的组件可以进行排查渲染问题，以下作答： 

​	a). 通过检查代码中是否有重复触发的 useEffect 

​	b). 检查是否有多次不同渲染周期中触发的setState导致的渲染（比如在一个事件中导致的state更新，导致依赖于该state的useEffect触发，而该effect中又有其他的setState，导致多个有依赖项的useEffect不同批次连环触发） 

​	c). 检查是否在某个超大组件中需要渲染的元素过多，可使用子组件可考虑使用 pureComponent，或 React.mome ，或使用useMome来根据依赖项更新子组件，或在父组件中将子组件需要的props通过使用useMome或useCallback缓存， 或在子组件中使用 shouldComponentUpdate 中校验是否需要更新来减少更新 

​	d). 检查是否存在拖拽业务，这类业务一般会导致大量的diff存在，可以的话可以考虑不使用React的方式去实现，使用第三方非React的JS库去实现。 

​	e). 同上情况，存在大量增删改查逻辑，会导致大量的的diff可以检查列表元素是否存在唯一的key，通过key可以让React复用Fiber从而避免重复创建 Fiber节点与 Dom 节点 

​	f). 存在未清除掉的定时器或dom监听事件

## 24、React 17.0 有什么变化

1.合成事件的变化，事件委托放在了root元素上，同时去掉了事件池

2.全新jsx的变化，可以单独使用jsx，不需要手动引入react;旧版jsx会被转换为React.createElement, 新版jsx转换为_jsx()

## 25、现代框架如 React、Vue 相比原生开发有什么优势

react、vue： 1、一套代码维护Android和ios两个平台，减少开发成本 2、相同功能可以使用组件复用 3、两个平台可以同时更新，原生代码更新时需要审核

## 26、React/Vue 中的 router 实现原理如何

前端路由有两种实现方式:

### history API

- 通过 `history.pushState()` 跳转路由
- 通过 `popstate event` 监听路由变化，但无法监听到 `history.pushState()` 时的路由变化

### hash

- 通过 `location.hash` 跳转路由
- 通过 `hashchange event` 监听路由变化

## 27、在 SSR 项目中如何判断当前环境时服务器端还是浏览器端

1. SSR渲染的时候，服务端与客户端走不同的webpack打包配置。 那么就可以在打包的时候写入区分环境的环境变量。
2. 服务器端是没有window document 等浏览器宿主环境对象的，可以通过 类型检测 这些对象 来区分。

一般就是通过第二条来区分了

## 28、React.setState 是同步还是异步的

- 使用`ReactDom.render()`则在`setTimeout`和原生事件中是同步的

- 使用`createRoot`都是异步的

## 29、什么是服务器渲染 (SSR)

服务器渲染 (SSR)：将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。这个过程可以成为服务端渲染。

优势：

- 更好的 SEO
- 更快的内容到达时间 (time-to-content)

## 30、在 React 中如何实现代码分割 (code splitting)

## 31、在 React 中如何做好性能优化

- 代码分割
- React.memo()、shouldComponentUpdate()等防止不必要的渲染
- Fragments避免额外标记
- 错误边界避免组件在出错时破坏整个应用

## 32、在 React 中发现状态更新时卡顿，此时应该如何定位及优化

在 React 中，当状态更新时出现卡顿，可能是由于以下原因导致的：

1. 大量计算：当组件进行大量计算时，可能会导致状态更新时出现卡顿。这种情况下，可以考虑使用 `useMemo` 或 `useCallback` 来优化计算性能。
2. 大量渲染：当组件进行大量渲染时，可能会导致状态更新时出现卡顿。这种情况下，可以考虑使用 `React.memo` 或 `shouldComponentUpdate` 来避免不必要的渲染。
3. 大量数据：当组件需要处理大量数据时，可能会导致状态更新时出现卡顿。这种情况下，可以考虑使用分页或虚拟滚动等技术来优化性能。
4. 异步更新：当组件进行异步更新时，可能会导致状态更新时出现卡顿。这种情况下，可以考虑使用 `React.lazy` 或 `Suspense` 来异步加载组件，从而避免卡顿。

针对以上情况，可以采取以下优化措施：

1. 使用性能分析工具：可以使用 Chrome 开发者工具中的 Performance 面板或 React DevTools 中的 Profiler 面板来分析组件的性能瓶颈，并找到需要优化的地方。
2. 拆分组件：可以将组件拆分成更小的组件，从而减少组件的复杂度，提高性能。
3. 使用异步更新：可以使用 `React.lazy` 或 `Suspense` 来异步加载组件，从而避免卡顿。
4. 使用分页或虚拟滚动：可以使用分页或虚拟滚动等技术来优化处理大量数据时的性能。
5. 使用 `useMemo` 或 `useCallback`：可以使用 `useMemo` 或 `useCallback` 来优化计算性能。
6. 使用 `React.memo` 或 `shouldComponentUpdate`：可以使用 `React.memo` 或 `shouldComponentUpdate` 来避免不必要的渲染。

总之，在 React 中，当状态更新时出现卡顿，可以使用性能分析工具来定位性能瓶颈，并采取相应的优化措施来提高性能。

## 33、当多次重复点击按钮时，以下三个 Heading 是如何渲染的

```jsx
import React, { memo, useMemo, useState } from "react";

const Heading = memo(({ style, title }) => {
  console.log("Rendered:", title);

  return <h1 style={style}>{title}</h1>;
});

export default function App() {
  const [count, setCount] = useState(0);

  const normalStyle = {
    backgroundColor: "teal",
    color: "white",
  };

  const memoizedStyle = useMemo(() => {
    return {
      backgroundColor: "red",
      color: "white",
    };
  }, []);

  return (
    <>
    <button
      onClick={() => {
        setCount(count + 1);
      }}
      >
      Increment {count}
    </button>
    <Heading style={memoizedStyle} title="Memoized" />
    <Heading style={normalStyle} title="Normal" />
    <Heading title="React.memo Normal" />
    </>
  );
}
```

"Memoized"只在第一次渲染时打印一次，后续点击不刷新。 "Normal"会在每次渲染时打印。 "React.memo Normal”只会在第一次渲染时打印一次。

使用`useMemo`时，依赖数组为null，这意味着只会在首次渲染时，对memoizedStyle进行一次计算，后续不再计算。 在渲染`组件时，React.memo会先判断前后状态

## 34、在 React hooks 中如何模拟 forceUpdate

```jsx
const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

function handleClick() {
  forceUpdate();
}
```

## 35、useLayoutEffect 和 useEffect 有什么区别

- useLayoutEffect 和 componentDidMount 和 componentDidUpdate 触发时机一致（都在在 DOM 修改后且浏览器渲染之前）；
- useLayoutEffect 要比 useEffect 更早的触发执行；
- useLayoutEffect 会阻塞浏览器渲染，切记执行同步的耗时操作

## 36、在虚拟 DOM 中进行 diff 算法时，介绍当根据 key 对数组进行重用时的算法

```html
<div key="1">Demo 1</div>
<div key="2">Demo 2</div>
<div key="3">Demo 3</div>
<div key="4">Demo 4</div>
<div key="5">Demo 5</div>
 
<div key="4">Demo 4</div>
<div key="5">Demo 5</div>
<div key="2">Demo 2</div>
<div key="1">Demo 1</div>
<div key="3">Demo 3</div>
```

```javascript
function updateChildren(element, oldVnodes, newVnodes) {}
```

## 37、在 react 中，以下父子组件的 useEffect/useLayoutEffect 顺序如何

```jsx
import { useEffect, useLayoutEffect } from "react";
import "./App.css";

function Child() {
  console.log("Child: Render");

  useEffect(() => {
    console.log("Child: useEffect");
  });

  useLayoutEffect(() => {
    console.log("Child: useLayoutEffect");
  });

  return <div className="App">Child</div>;
}

function App() {
  console.log("App: render");

  useEffect(() => {
    console.log("App: useEffect");
  });

  useLayoutEffect(() => {
    console.log("App: useLayoutEffect");
  });

  return (
    <div className="App">
      App
      <Child />
    </div>
  );
}

export default App;
```

总结一下我的理解： 

1. useEffect 通过 scheduleCallback调度的，是异步执行的，也就是在渲染到页面后执行 而useLayoutEffect 是同步执行的，发生在dom mutation更新了dom结构，但是还未绘制到屏幕之前 
2. useEffect 和 useLayoutEffect 都是递归执行的，先执行子组件 
3. 有useEffect 和 useLayoutEffect的fiber会被打上标记，加入到effectList中, 每次更新都会都会处理, 两个函数都会处理成effectObject, 包含create、destory属性，其中create是useEffect 和 useLayoutEffect传入的函数，destory对应传入的函数执行返回的函数，在commit阶段，每次都是先执行destory清理函数，然后执行create， 挂载时destory为undefined，跳过清理函数执行，执行create，执行后把return的函数复制给destory， 下一次更新时destory不为undefined就会执行destory销毁函数，如果dep有变化接下来执行create
