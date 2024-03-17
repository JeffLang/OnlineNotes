# 面试宝典

## 基础知识

### 前端基础

#### 对象

##### 对象使用和属性

`JavaScript`中所有的变量都可以当作对象使用，除了两个例外`null`和`undefined`

```javascript
false.toString(); // 'false'
[1,2,3].toString(); // '1,2,3'
function Foo(){};
Foo.bar = 1;
Foo.bar; // 1
```

点操作符解析为浮点数字面值的一部分。

```javascript
2.toString(); // 出错：SyntaxError
```

有很多变通方法可以让数字的字面值看起来像对象

```javascript
(2).toString(); // 可以被正常解析
```

###### 对象作为数据类型

`JavaScript`的对象可以作为[哈希表](http://en.wikipedia.org/wiki/Hashmap)使用，主要用来保存命名的键与值得对象关系。

`{}`-可以创建一个简单对象。这个新创建的对象从`Object.prototype`[继承](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.prototype)下面，没有任何[自定义属性](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.hasownproperty)

    var foo = {}; // 一个空对象
    
    // 一个新对象，拥有一个值为12的自定义属性'test'
    var bar = {test: 12};
111

###### 访问属性

有两种方式来访问对象的属性，点操作符或者中括号操作符。

```js
    var foo = {name: 'kitten'}
    foo.name; // kitten
    foo['name']; // kitten

    var get = 'name';
    foo[get]; // kitten

    foo.1234; // SyntaxError
    foo['1234']; // works
```

两种语法是等价的，但是中括号操作符在下面两种情况下依然有效

- 动态设置属性
- 译者注：比如属性名中包含空格，或者属性名是JS的关键词

译者注：在  [JSLint](http://www.jslint.com/) 语法检测工具中，点操作符是推荐做法。

###### 删除属性

`delete`操作符；设置属性为`undefined`或者`null`并不能正在的删除属性，而仅仅是移除了属性和值的关联。

```javascript
var obj = {
  bar: 1,
  foo: 2,
  baz: 3,
};
obj.bar = undefined;
obj.foo = null;
delete obj.baz;

for (var i in obj) {
  if (obj.hasOwnProperty(i)) {
    console.log(i, "" + obj[i]);
  }
}
```

输出为：`bar undefined` 和  `foo null` 

##### 原型

`prototype`

虽然这经常被当作是`JavaScript`的缺点被提及，其实基于原型的继承模型比传统的类继承还要强大。 实现传统的类继承模型是很简单，但是实现 JavaScript 中的原型继承则要困难的多。 (It is for example fairly trivial to build a classic model on top of it, while the other way around is a far more difficult task.)

由于`JavaScript`是唯一一个被广泛使用的基于原型继承的语言，所以理解两种继承模式的差异是需要一定时间的。

原型链的继承方式

注意：简单的使用`Bar.prototype = Foo.prototype`将会导致两个对象共享相同的原型。因此，改变任意一个对象的原型都会影响到另一个对象的原型，在大多数情况下这不是希望的结果。

```javascript
function Foo() {
  this.value = 42
}

Foo.prototype = {
  method: function () {},
}

function Bar() {}

// 设置Bar的prototype属性为Foo的实例对象, 这样bar就能继承Foo,但是如果编辑Bar的原型也不会影响到Foo的原型对象
Bar.prototype = new Foo()
const barObj = new Bar()

console.log(barObj.value)
console.log(barObj.method)
```

```
// 原型链
test [Bar的实例]
    Bar.prototype [Foo的实例]
        { foo: 'Hello World' }
        Foo.prototype
            {method: ...};
            Object.prototype
                {toString: ... /* etc. */};
```

test` 对象从  `Bar.prototype` 和  `Foo.prototype` 继承下来；因此， 它能访问  `Foo` 的原型方法  `method`。同时，它也能够访问那个定义在原型上的  `Foo` 实例属性  `value`。 需要注意的是  `new Bar()` 不会创造出一个新的  `Foo` 实例，而是 重复使用它原型上的那个实例；因此，所有的  `Bar` 实例都会共享相同的  `value`注意: 不要使用`Bar.prototype = Foo`，因为这不会执行  `Foo` 的原型，而是指向函数  `Foo`。 因此原型链将会回溯到`Function.prototype` 而不是`Foo.prototype`，因此`method

###### 属性查找

向上遍历原型链，直到找到给定名称的属性为止。

`Object.prototype`但是依然没有找到指定的属性，就会返回`undefined`

###### 原型属性

任何类型的值赋给它（prototype）。 然而将原子类型赋给 prototype 的操作将会被忽略。

```javascript
function Foo() {}
Foo.prototype = 1; // 无效
```

而将对象赋值给 prototype，正如上面的例子所示，将会动态的创建原型链。

###### 性能

如果一个属性在原型链的上端，则对于查找时间带来不利影响。特别的，试图获取一个不存在的属性将会遍历整个原型链。

并且，当使用[for in](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.forinloop)循环遍历对象的属性时，原型链上的所有属性都将被访问。

###### 扩展内置类型的原型

`Object.prototype`

这种技术被称之为[monkey patching](http://en.wikipedia.org/wiki/Monkey_patch)并且会破环封装。虽然它被广泛的应用到一些JavaScript类库比如[Prototype](http://prototypejs.org/)，但是仍然不认为为内置类型添加一些非标准的函数是个好主意。

唯一理由是为了和新的 JavaScript 保持一致，比如  [Array.forEach](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach)。

译者注：这是编程领域常用的一种方式，称之为  [Backport](http://en.wikipedia.org/wiki/Backport)，也就是将新的补丁添加到老版本中。

###### [总结](https://www.mianshibook.com/cat/basic/review.html#总结)

必修的功课。 要提防原型链过长带来的性能问题，并知道如何通过缩短原型链来提高性能。 更进一步，绝对不要扩展内置类型的原型，除非是为了和新的 JavaScript 引擎兼容。

##### hasOwnProperty

自定义属性而不是  [原型链](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.prototype)上的属性， 我们需要使用继承自  `Object.prototype` 的  `hasOwnProperty`注意: 通过判断一个属性是否`undefined` 是不够的。 因为一个属性可能确实存在，只不过它的值被设置为`undefined`。`hasOwnProperty` 是 JavaScript 中唯一一个处理属性但是不查找原型链的函数。

```javascript
// 修改Object.prototype
Object.prototype.bar = 1;
var foo = { goo: undefined };

foo.bar; // 1
"bar" in foo; // true

foo.hasOwnProperty("bar"); // false
foo.hasOwnProperty("goo"); // true
```

`hasOwnProperty` 可以给出正确和期望的结果，这在遍历对象的属性时会很有用。 没有其它方法可以用来排除原型链上的属性，而不是定义在对象自身上的属性。

###### hasOwnProperty

不会保护  `hasOwnProperty` 被非法占用，因此如果一个对象碰巧存在这个属性， 就需要使用外部的  `hasOwnProperty`

```javascript
var foo = {
  hasOwnProperty: function () {
    return false;
  },
  bar: "Here be dragons",
};

foo.hasOwnProperty("bar"); // 总是返回 false

// 使用其它对象的 hasOwnProperty，并将其上下文设置为foo
({}).hasOwnProperty.call(foo, "bar"); // true
```

###### [结论](https://www.mianshibook.com/cat/basic/review.html#结论)

`hasOwnProperty` 是唯一可用的方法。 同时在使用  `[for in](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.forinloop)` 遍历对象时，推荐总是使用  `hasOwnProperty` 方法， 这将会避免  [原型](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.prototype)对象扩展带来的干扰。

##### for in

`in`操作符一样，`for in`注意：`for in`循环不会遍历那些`enumerable`设置为`false`的属性；比如数组的`length`

```javascript
// 修改 Object.prototype
Object.prototype.bar = 1;

var foo = { moo: 2 };
for (var i in foo) {
  console.log(i); // 输出两个属性：bar 和 moo
}
```

`for in` 自身的行为，因此有必要过滤出那些不希望出现在循环体中的属性， 这可以通过  `Object.prototype` 原型上的  [hasOwnProperty](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.hasownproperty) 函数来完成。

###### 总结

总是使用  `hasOwnProperty`。不要对代码运行的环境做任何假设，不要假设原生对象是否已经被扩展了

#### 函数

##### 函数声明与表达式

匿名函数作为回调函数传递到异步函数中。

###### 函数声明

```javascript
function foo() {}
```

上面的方法会在执行前被  [解析(hoisted)](http://bonsaiden.github.io/JavaScript-Garden/zh/#function.scopes)，因此它存在于当前上下文的任意一个地方， 即使在函数定义体的上面被调用也是对的。

```javascript
foo(); // 正常运行，因为foo在代码运行前已经被创建
function foo() {}
```

###### 函数赋值表达式

```javascript
var foo = function () {};
```

匿名的函数复制给变量

```javascript
foo; // 'undefined'
foo(); // 出错：TypeError
var foo = function () {};
```

`var` 定义了一个声明语句，对变量  `foo` 的解析是在代码运行之前，因此`foo``foo` 的值缺省为  [undefined](http://bonsaiden.github.io/JavaScript-Garden/zh/#core.undefined)。

###### 命名函数的赋值表达式

另外一个特殊的情况是将命名函数赋值给一个变量。

```javascript
var foo = function bar() {
  bar(); // 正常运行
};
bar(); // 出错：ReferenceError
```

bar` 函数声明外是不可见的，这是因为我们已经把函数赋值给了  `foo`； 然而在  `bar` 内部依然可见。这是由于 JavaScript 的  [命名处理](http://bonsaiden.github.io/JavaScript-Garden/zh/#function.scopes) 所致， 函数名在函数内总是可见的。注意:在 IE8 及 IE8 以下版本浏览器 bar 在外部也是可见的，是因为浏览器对命名函数赋值表达式进行了错误的解析， 解析成两个函数  `foo` 和  `bar

###### argument

转化为数组

- 方法一

  ```javascript
  Array.prototype.slice.call(arguments);
  ```

- 方法二

  ```javascript
  Array.from(arguments);
  ```

  

```javascript
function Foo() {}

Foo.prototype.method = function (a, b, c) {
  console.log(this, a, b, c);
};

// 创建一个解绑定的 "method"
// 输入参数为: this, arg1, arg2...argN
Foo.method = function () {
  // 结果: Foo.prototype.method.call(this, arg1, arg2... argN)
  Function.call.apply(Foo.prototype.method, arguments);
  // 相当于：Foo.prototype.method.call(arg[0], otherArg)
  // apply把call的this指向了第一个参数，然后再掺入剩余的参数调用call
};
```

