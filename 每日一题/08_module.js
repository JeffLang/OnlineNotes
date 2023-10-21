
// require 方式

// script 标签引入方式
define(['08_module'], function (require) {

  let counts = 1;
  function sayHello() {
      alert(`"hello , ${counts}`)
  }
  setTimeout(() => {
  counts += 2
  }, 3000);

  return {
    counts,
    sayHello
  };
});
// module.exports = {counts, sayHello};

// import 方式
/* let counts = 1;
function sayHello() {
    alert(`"hello , ${counts}`)
}
setTimeout(() => {
counts += 2
}, 3000);
// export { counts, sayHello }; */

