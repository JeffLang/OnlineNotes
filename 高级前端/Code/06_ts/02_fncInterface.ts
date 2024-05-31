interface IFuc {
  (a: number, b: number): number //
}

type TFunc = () => void

// interface 方式
const fn1: IFuc = (a, b) => a + b

// type方式
const fn2: TFunc = () => {}

function fn3(a: number, b: number): number {
  return a + b
}

// 函数表达式
const fn4 = (a: number, b: number): number => {
  return a + b
}

const fn5: (a: number, b: number) => number = (a, b) => {
  return a + b
}
