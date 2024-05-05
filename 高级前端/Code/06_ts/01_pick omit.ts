interface User {
  id: number;
  age: number;
  name: string;
}
 
// 相当于: type PickUser = { age: number; name: string; }
type OmitUser = Omit<User, "id">;
 
// 相当于: type PickUser = { id: number; age: number; } 
type PickUser = Pick<User, "id" | "age">;


// 自定义一个Pick
type MyPick<O extends object, K extends keyof O> = {
  [P in K]: O[P]
}

// 自定义一个Omit, 除开指定的key
type MyOmit<O extends object, K extends keyof O> = {
  [P in Exclude<keyof O, K>]: O[P]
}



