## 01、垂直水平居中

1. 可以使用定位来解决

   ```css
   .container {
     position: relative;
     height: 300px;
     border: 1px solid red;
   }
   .item {
     width: 100px;
     height: 50px;
     position: absolute;
     left: 0;
     top: 0;
     right: 0;
     bottom: 0;
     margin: auto;
     border: 1px solid green;
   }
   ```

2. 定位+transform：主要来处理高宽未知的元素

   ```css
   .container {
     position: relative;
     height: 300px;
     border: 1px solid red;
   }
   .item {
     postion: absolute;
     top: 50%;
     bottom: 50%;
     width: 50px;
     height: 50px;
     transform: translate(-50%, -50%);
   }
   ```

3. 经典的flex方法

   ```css
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   ```

4. **新的flex方法**

   ```css
   .container {
     display: flex;
   }
   .item{
     margin: auto
   }
   ```

5. grid方式

   其中：`place-content: center;`是`align-content`和`justify-content`的简写

   ```css
   .container {
     display: grid;
     place-content: center;
   }
   ```

   其中：`place-items: center;`是`align-items`和`justify-items`的简写

   ```css
   .container {
     display: grid;
     place-items: center;
   }
   ```

## 02、css 如何实现左侧固定300px，右侧自适应的布局

方法一：flex布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>02_左侧固定，右侧自适应</title>
    <style>
      .container {
        display: flex;
        height: 400px;
        border: 1px solid black;
      }
      .left {
        width: 300px;
        height: 100%;
        background-color: #bfa;
      }
      .main {
        flex: 1;
        height: 100%;
        background-color: aqua;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left"></div>
      <div class="main"></div>
    </div>
  </body>
</html>
```

备注：

`flex: 1`===`flex: 1 1 任意数字+任意长度单位`

`flex`代表三个参数

1. `flex-grow`
2. `flex-shrink`
3. `flex-basis`



方法一：Grid 布局

```css
.container {
  display: grid;
  grid-template-columns: 300px 1fr;
}
```

## 03、如何实现一个loading效果

### svg实现方案

```html
<svg class="loading" viewbox="25 25 50 50">
  <circle cx="50" cy="50" r="25" class="path" fill="none" />
</svg>
```



```css
.loading {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear 0s infinite;
}
.path {
  animation: dash 2s ease-in-out infinite;
  stroke: #00b390;
  stroke-width: 2;
  stroke-dasharray: 90 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
}

@keyframes rotate {
  from {
    tranform: rotate(0deg);
  }
  to {
    tranform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -120px;
  }
}
```

#### 注意

viewBox 属性的值是一个包含 4 个参数的列表 `min-x`, `min-y`, `width` and `height`，以空格或者逗号分隔开，在用户空间中指定一个矩形区域映射到给定的元素，查看属性

`min-x`：表示0点的x方向向左的偏移量

`min-y`：表示0点的y方向向上的偏移量

`cx`：圆心x坐标

`cy`：圆心y坐标

## 04、如何使用 css 写一个魔方

利用transform的3D变换可以实现

https://codepen.io/indusy/pen/YzeEzzb

## 05、如何使用 css 写一个有 3D 效果的立方体

利用transform的3D变换可以实现

https://codepen.io/indusy/pen/YzeEzzb

## 06、有没有使用过 css variable，它解决了哪些问题

css变量减少样式重复定义，比如同一个颜色值要在多个地方重复使用，以前通过less和sass预处理做到，现在css变量也可以做到，方便维护，提高可读性

```css
:root{
  --bgcolor: blue;
  --color: red;
}
p {
  color: var(--color);
}
div {
  backgroung-color: var(--bgcolor);
  color: var(--color)
}
```

同一个 `CSS` 变量，可以在多个选择器内声明。读取的时候，优先级最高的声明生效。这与 `CSS` 的"层叠"（`cascade`）规则是一致的。



## 07、谈谈你对 styled-component 的看法

认识`styled-component`

```jsx
import React from 'react';
import styled from 'styled-components';
// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
// Create a <Wrapper> react component that renders a <section> with
// some padding and a papayawhip background
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
// Use them like any other React component – except they're styled!
<Wrapper>
  <Title>Hello World, this is my first styled component!</Title>
</Wrapper>

```

扩展

```jsx
const Button = styled.button`
  padding: 10px;
`;
const TomatoButton = Button.extend`
  color: #f00;
`;
```

传参

```jsx
import styled from 'styled-components'; // 引入styled-components组件
// 生命样式 ButtonA组件，通过styled 对象进行创建，注意styled.hlml 元素后面是 反引号；
const ButtonC = styled.button`
  width: 120px;
  height: 40px;
  border: 1 px solid ${props => props.color};
  color: ${props => props.color};
`;
// 对外暴露出去
export {
ButtonC
}
```

## 08、使用css如何画一个三角形

使用border来画三角形

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>06_css画一个三角形</title>
    <style>
      .triangle {
        width: 0px;
        height: 0px;
        border: 100px solid;
        border-color: transparent transparent rgba(134, 241, 143, 1) transparent;
      }
    </style>
  </head>
  <body>
    <div class="triangle"></div>
  </body>
</html>

```

## 09、display: inline 的元素设置 margin 和 padding 会生效吗

- `margin`上下不生效

- `padding`上下左右都生效，但是上下不会影响其他元素的位置

- `border`上下左右都生效，但是上下不会影响其他元素的位置

## 10、html 的默认 display 属性是多少

`html` 根元素的默认 `display` 为 `block`

## 11、响应式布局需要注意哪一些

media-query 媒体查询 rem 相对长度单位，相对于html根元素 vw/vh 网页视口高度和宽度

## 12、对一个非定长宽的块状元素如何做垂直水平居中

方法一：使用定位+`transform`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>08_非顶长宽块状元素垂直居中</title>
    <style>
      .container {
        position: relative;
        height: 100vh;
      }
      .box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #bfa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box">非定长宽</div>
    </div>
  </body>
</html>

```

方法二：使用flex

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>08_非顶长宽块状元素垂直居中</title>
    <style>
      .container {
        display: flex;
        height: 100vh;
      }
      .box {
        margin: auto;
        background-color: #bfa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box">非定长宽</div>
    </div>
  </body>
</html>

```

## 13、简述下 css specificity

`css specificity` 即 css 中关于选择器的权重，以下三种类型的选择器依次下降

1. `id` 选择器，如 `#app`

2. `class`、`attribute` 与 `pseudo-classes` 选择器，如 `.header`、`[type="radio"]` 与 `:hover`
3. `type` 标签选择器和伪元素选择器，如 `h1`、`p` 和 `::before`

其中通配符选择器 `*`，组合选择器 `+ ~ >`，否定伪类选择器 `:not()` 对优先级无影响

另有内联样式 `<div class="foo" style="color: red;"></div>` 及 `!important`(最高) 具有更高的权重

## 14、'+' 与 '~' 选择器有什么不同

- `+` 选择器匹配紧邻的兄弟元素
- `~` 选择器匹配随后的所有兄弟元素

## 15、有哪些 css 属性不能展示动画效果

一些不能被量化的属性不能进行动画效果，比如display，还有height从特定数值到auto等等

display,height css不能在display:none和display:block之间进行动画，也不能在height:0和height:auto之间进行动画

## 16、css 动画与 js 动画哪个性能更好

### CSS3动画和JS动画的比较

关于CSS动画和JS动画，**有一种说法是CSS动画比JS流畅，其实这种流畅是有前提的**。借此机会，我们对CSS3动画和JS动画进行一个简单对比。

### JS动画

**优点：**  

1. JS动画控制能力强，可以在动画播放过程中对动画进行精细控制，如开始、暂停、终止、取消等；
2. JS动画效果比CSS3动画丰富，功能涵盖面广，比如可以实现曲线运动、冲击闪烁、[视差滚动](https://www.zhihu.com/search?q=视差滚动&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})等CSS难以实现的效果；
3. JS动画大多数情况下没有兼容性问题，而CSS3动画有兼容性问题；

**缺点：**  

1. JS在浏览器的主线程中运行，而主线程中还有其它需要运行的JS脚本、样式计算、布局、绘制任务等，对其干扰可能导致线程出现阻塞，从而造成丢帧的情况；
2. 对于帧速表现不好的低版本浏览器，CSS3可以做到自然降级，而JS则需要撰写额外代码；
3. JS动画往往需要频繁操作DOM的css属性来实现视觉上的动画效果，这个时候浏览器要不停地执行重绘和重排，这对于性能的消耗是很大的，尤其是在分配给浏览器的内存没那么宽裕的移动端。

### CSS3动画

**优点：**  

1. 部分情况下浏览器可以对动画进行优化（比如专门新建一个图层用来跑动画），为什么说部分情况下呢，因为是有条件的：  
   1. 在Chromium基础上的浏览器中
   2. 同时CSS动画不触发layout或paint，在CSS动画或JS动画触发了paint或layout时，需要[main thread](https://www.zhihu.com/search?q=main thread&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})进行Layer树的重计算，这时CSS动画或JS动画都会阻塞后续操作。
2. 部分效果可以强制使用硬件加速 （通过 GPU 来提高动画性能）

**缺点：**  

1. 代码冗长。CSS 实现稍微复杂一点动画，CSS代码可能都会变得非常笨重；
2. 运行[过程控制](https://www.zhihu.com/search?q=过程控制&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})较弱。css3动画只能在某些场景下控制动画的暂停与继续，不能在特定的位置添加[回调函数](https://www.zhihu.com/search?q=回调函数&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})。

### main thread(主线程)和compositor thread([合成器线程](https://www.zhihu.com/search?q=合成器线程&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074}))

1. **渲染线程分为main thread(主线程)和compositor thread(合成器线程)。**主线程中维护了一棵Layer树（LayerTreeHost），管理了TiledLayer，在compositor thread，维护了同样一颗LayerTreeHostImpl，管理了LayerImpl，这两棵树的内容是拷贝关系。因此可以彼此不干扰，当Javascript在main thread操作LayerTreeHost的同时，compositor thread可以用LayerTreeHostImpl做渲染。当Javascript繁忙导致主线程卡住时，合成到屏幕的过程也是流畅的。
2. 为了实现防假死，鼠标键盘消息会被首先分发到compositor thread，然后再到main thread。这样，当main thread繁忙时，compositor thread还是能够响应一部分消息，例如，鼠标滚动时，如果main thread繁忙，compositor thread也会处理滚动消息，滚动已经被提交的页面部分（未被提交的部分将被刷白）。

### CSS动画比JS动画流畅的前提

1. CSS动画比较少或者不触发pain和layout，即重绘和重排时。例如通过改变如下属性生成的[css动画](https://www.zhihu.com/search?q=css动画&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})，这时整个CSS动画得以在[compositor thread](https://www.zhihu.com/search?q=compositor thread&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})完成（而JS动画则会在main thread执行，然后触发compositor进行下一步操作）：
   1. [backface-visibility](https://www.zhihu.com/search?q=backface-visibility&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})：该属性指定当元素背面朝向观察者时是否可见（3D，实验中的功能）；
   2. opacity：设置 div 元素的不透明级别；
   3. perspective 设置元素视图，该属性只影响 3D 转换元素；
   4. [perspective-origin](https://www.zhihu.com/search?q=perspective-origin&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})：该属性允许您改变 3D 元素的底部位置；
   5. transform：该属性应用于元素的2D或3D转换。这个属性允许你将元素旋转，缩放，移动，倾斜等。
2. JS在执行一些昂贵的任务时，main thread繁忙，CSS动画由于使用了compositor thread可以保持流畅；
3. 部分属性能够启动3D加速和GPU硬件加速，例如使用transform的translateZ进行3D变换时；
4. 通过设置 will-change 属性，浏览器就可以提前知道哪些元素的属性将会改变，提前做好准备。待需要改变元素的时机到来时，就可以立刻实现它们，从而避免卡顿等问题。
   1. 不要将 will-change 应用到太多元素上，如果过度使用的话，可能导致页面响应缓慢或者消耗非常多的资源。
   2. 例如下面的代码就是提前告诉渲染引擎 box 元素将要做几何变换和[透明度变换](https://www.zhihu.com/search?q=透明度变换&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})操作，这时候**渲染引擎会将该元素单独实现一帧**，等这些变换发生时，渲染引擎会通过[合成线程](https://www.zhihu.com/search?q=合成线程&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})直接去处理变换，这些变换并没有涉及到主线程，这样就大大提升了渲染的效率。

```css
 .box {will-change: transform, opacity;}
```

### setTimeout、setInterval 和 requestAnimationFrame 的一些细节

setTimeout 的执行时间并不是确定的。在JavaScript中，setTimeout 任务被放进了异步队列中，**只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行**，所以 setTimeout 的实际执行时机一般要比其设定的时间晚一些。

刷新频率受 屏幕分辨率 和 屏幕尺寸 的影响，不同设备的屏幕绘制频率可能会不同，而 setTimeout 只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。

**setTimeout 的执行只是在内存中对元素属性进行改变，这个变化必须要等到屏幕下次绘制时才会被更新到屏幕上。如果两者的步调不一致，就可能会导致中间某一帧的操作被跨越过去，而直接更新下一帧的元素。**假设屏幕每隔16.7ms刷新一次，而setTimeout 每隔10ms设置图像向左移动1px， 就会出现如下绘制过程：  

1. 第 0 ms：屏幕未绘制，等待中，setTimeout 也未执行，等待中；
2. 第 10 ms：屏幕未绘制，等待中，setTimeout 开始执行并设置元素属性 left=1px；
3. 第 16.7 ms：屏幕开始绘制，屏幕上的元素向左移动了 1px， setTimeout 未执行，继续等待中；
4. 第 20 ms：屏幕未绘制，等待中，setTimeout 开始执行并设置 left=2px;
5. 第 30 ms：屏幕未绘制，等待中，setTimeout 开始执行并设置 left=3px;
6. 第 33.4 ms：屏幕开始绘制，屏幕上的元素向左移动了 3px， setTimeout 未执行，继续等待中；
7. ...

从上面的绘制过程中可以看出，屏幕没有更新 left=2px 的那一帧画面，元素直接从left=1px 的位置跳到了 left=3px 的的位置，这就是**[丢帧现象](https://www.zhihu.com/search?q=丢帧现象&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2232180074})**，这种现象就会引起动画卡顿。

- setInterval的回调函数调用之间的实际延迟小于代码中设置的延迟，因为回调函数执行所需的时间“消耗”了间隔的一部分，**如果回调函数执行时间长、执行次数多的话，误差也会越来越大**：

```javascript
// repeat with the interval of 2 seconds
let timerId = setInterval(() => console.log('tick', timerId), 2000);
// after 50 seconds stop
setTimeout(() => {
  clearInterval(timerId);
  console.log('stop', timerId);
}, 50000);
```

![img](https://pic1.zhimg.com/80/v2-1d9623b50c4b3f43e0747ef95a959228_720w.webp?source=1def8aca)

- 嵌套的setTimeout可以保证固定的延迟：

在动画的实现上，requestAnimationFrame 比起 setTimeout 和 setInterval来无疑更具优势。我们先看看打字机效果的requestAnimationFrame实现：

```js
(function () {
    const container = document.getElementById('content')
    const data = '与 setTimeout 相比，requestAnimationFrame 最大的优势是 由系统来决定回调函数的执行时机。具体一点讲就是，系统每次绘制之前会主动调用 requestAnimationFrame 中的回调函数，如果系统绘制率是 60Hz，那么回调函数就每16.7ms 被执行一次，如果绘制频率是75Hz，那么这个间隔时间就变成了 1000/75=13.3ms。换句话说就是，requestAnimationFrame 的执行步伐跟着系统的绘制频率走。它能保证回调函数在屏幕每一次的绘制间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。'.split('')
    let index = 0
    function writing() {
      if (index < data.length) {
        container.innerHTML += data[index ++]
        requestAnimationFrame(writing)
      }
    }
    writing()
  })();
```

![动图封面](https://pic3.zhimg.com/v2-501d9c76a486a2b4fba1c8db5880746a_b.jpg)



与setTimeout相比，requestAnimationFrame最大的优势是**由系统来决定回调函数的执行时机**。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame 的步伐跟着系统的刷新步伐走。**它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题**。

提到的requestAnimationFrame的优势外，requestAnimationFrame还有以下两个优势：

1. CPU节能：使用setTimeout实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而requestAnimationFrame则完全不同，**当页面处于未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的requestAnimationFrame也会停止渲染**，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。
2. 函数节流：在高频率事件(resize,scroll等)中，为了防止在一个刷新间隔内发生多次函数执行，使用requestAnimationFrame可**保证每个刷新间隔内，函数只被执行一次**，这样既能保证流畅性，也能更好的节省函数执行的开销。一个刷新间隔内函数执行多次是没有意义的，因为显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。

### 关于最小时间间隔

1. [2011年的标准](https://link.zhihu.com/?target=https%3A//www.w3.org/TR/2011/WD-html5-20110525/timers.html)中是这么规定的：
   1. setTimeout：如果当前正在运行的任务是由setTimeout（）方法创建的任务，并且时间间隔小于4ms，则将时间间隔增加到4ms；
   2. setInterval：如果时间间隔小于10ms，则将时间间隔增加到10ms。
2. [在最新标准中](https://link.zhihu.com/?target=https%3A//html.spec.whatwg.org/multipage/timers-and-user-prompts.html)：如果时间间隔小于0，则将时间间隔设置为0。 如果**嵌套级别大于5，并且时间间隔小于4ms，则将时间间隔设置为4ms。**

### 定时器的清除

- 由于clearTimeout（）和clearInterval（）清除的是同一列表（活动计时器列表）中的条目，因此可以使用这两种方法清除setTimeout（）或 setInterval（）创建的计时器。

## 17、css 中属性选择器及类选择器的权重哪个高

.box 权重是10 ，div[class=box]权重可以看成11 div .box 和 div[class=box]权重是一样的

## 18、为什么会发生样式抖动

因为没有指定元素具体高度和宽度,比如数据还没有加载进来时元素高度是100px(假设这里是100px),数据加载进来后,因为有了数据,然后元素被撑大,所有出现了抖动

## 19、position: sticky 如何工作，适用于哪些场景

MDN的解释：`position: sticky` 在正常文档流中仍然保有位置，然后会相对于它的最近的滚动祖先和最近的块级祖先根据 `top`, `left`, `right`, `bottom` 的值进行偏移。元素偏移不会影响其他任何元素的位置，因为会为该元素创建一个新的层叠上下文，从而不会影响到页面上的其他元素

css-tricks一篇文章的理解：在窗口的管轮向下滚动没有让该元素完全消失前，该元素的表现就与postion:relative的元素相同，之后该元素的表现就类似于position: fixed 的元素， 只不过该元素是相对于离他最近的滚轮祖先

如果设置的值的`top`值大于当前元素的top值，则以设置的top值为准。

## 20、什么是层叠上下文 (stacking contect)，谈谈对它的理解

https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/

## 21、你用 css 实现过什么不错的效果

## 22、你做前端有多少时间花在写 css 上

如果说是开发阶段，我会用 20%-30% 的时间写 CSS。

比你想象的时间更少？

1. 我们开发的是一套内部的管理系统。
2. 其中一个原因是在 UI 设计时遵循了 element-ui 的规范，而开发使用的 UI 框架为 element-ui，因此大多数的界面并不需要写大量的 CSS，因为预设样式已足够使用。
3. 另外一个不得不提的原因是，针对业务场景，我们开发了一批公共组件，剩余的开发部分只需要对组件进行排列组合即可。
4. 最后是，我们的系统对动效的要求不高，不需要花费大量时间去调整动效。

## 23、伪类与伪元素有什么区别

1. 伪类使用单冒号，而伪元素使用双冒号。如 `:hover` 是伪类，`::before` 是伪元素
2. 伪元素会在文档流生成一个新的元素，并且可以使用 `content` 属性设置内容

参考 https://www.w3.org/TR/CSS2/selector.html#pseudo-elements

## 24、css 如何匹配前N个子元素及最后N个子元素

- 如何匹配最前三个子元素: `:nth-child(-n+3)`

- 如何匹配最后三个子元素: `:nth-last-child(-n+3)`

## 25、如何使用 CSS 实现网站的暗黑模式 (Dark Mode)

实现方式：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>12_暗黑模式</title>
    <style>
      html {
        /* background-color: yellow; */
        background-color: #fff;
      }
      html[theme='dark-model'] {
        filter: invert(0.6) hue-rotate(180deg);
        transition: all 1000; /*过渡动画*/
      }
      html[theme='light-model'] {
        filter: none;
        transition: color 1000, background-color 1000; /*过渡动画*/
      }
      .box1 {
        width: 100px;
        height: 100px;
        background-color: yellow;
      }
    </style>
  </head>
  <body>
    <button onclick="handleDarkTheme()">深色模式</button>
    <button onclick="handleLightTheme()">浅色模式</button>
    <div class="box1" />
    <script>
      // 暗黑模式
      function handleDarkTheme() {
        const htmlNode = document.getElementsByTagName('html')[0]
        htmlNode.setAttribute('theme', 'dark-model')
      }
      // 暗黑模式
      function handleLightTheme() {
        const htmlNode = document.getElementsByTagName('html')[0]
        htmlNode.setAttribute('theme', 'light-model')
      }
    </script>
  </body>
</html>

```

解释： css 的 filter属性 是将用于图片上的过滤，颜色变化等图形效果应用与元素上， 上面所使用到的 invert 可以用来反转应用程序的颜色; hue-rotate 是用来改变图像上的应用色颜色 通过invert(1)将白色变成黑色，那么为了适配颜色的变化，网页上的图像的颜色应该也做一个改变，这个改变就是通过hue-rotate(180edg)来实现的 filter属性 其他著名的应用还有: _ blur() 模糊图像 _ opacity() 图像透明程度 _ drop-shadow() 对图像应用阴影效果 _ ...

### Reference

[MDN Docs(opens in a new tab)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter) [如何实现网页dark-model](https://segmentfault.com/a/1190000023598551)

## 26、介绍 CSS 隐藏页面中某个元素的几种方法

### 01 display: none

通过 CSS 操控 display，移出文档流

```css
display: none;
```

### 02 opacity: 0

透明度为0，仍在文档流中，当作用于其上的事件(如点击)仍有效

```css
opacity: 0;
```

### 03 visibility: hidden

透明度为0，仍在文档流中，**但作用于其上的事件(如点击)无效**，这也是 `visibility:hidden` 与 `opacity: 0` 的区别

```css
visibility: hidden;
```

### 04 content-visibility

移出文档流，但是再次显示时消耗性能低，影响的是子元素

```css
content-visibility: hidden;
```

### 05 绝对定位于当前页面的不可见位置

```css
position: absolute;top: -9000px;left: -9000px;
```
