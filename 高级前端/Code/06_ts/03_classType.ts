interface IPerson1 {
  name: string
  age: any
  sayHello(): void
}

// 类可以实现接口
class Person1 implements IPerson1 {
  name: string
  age: number
  constructor(name: string, age: any) {
    this.name = name
    this.age = age
  }

  sayHello() {
    console.log(this.name, this.age)
  }
}

// 类可以继承一个类,不能实现一个接口
class Person2 extends Person1 {
  name: string
  age: number
  constructor(name: string, age: number) {
    super(name, age)
    this.name = name
    this.age = age
  }

  sayHello() {
    console.log(this.name, this.age)
  }
}

class Person3 {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  sayHello() {
    console.log(this.name, this.age)
  }
}

// 接口可以继承一个类/接口
interface IPerson2 extends Person3 {}

// 抽象类
abstract class Shape {
  abstract name: string // 抽象属性

  age: 18 // 抽象属性

  abstract draw(): void // 抽象方法

  area() {
    console.log('Calculating area...')
  }
}

// 具体类继承抽象类
class Circle extends Shape {
  name: string
  constructor(name) {
    super()
    this.name = name
  }
  draw() {
    console.log('Drawing a circle')
  }
}

// 使用type, 可以定义一个对象,也可以定义一个类
type TPerson = {
  name: string
  age: number
}

class Person implements TPerson {
  name: string
  age: number
  constructor(name, age) {
    this.age = age
    this.name = name
  }
}
