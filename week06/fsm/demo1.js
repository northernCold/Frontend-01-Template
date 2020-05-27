// const start = c => c === "a" ? foundA : start; // 开始状态（处理a状态)
// const foundA = c => c === "b" ? foundB : start; // 处理b状态
// const foundB = c => c === "c" ? end : start; // 处理c状态
// const end = c => end; // 结束状态

const start = c => c === "a" ? foundA : start; // 开始状态（处理a状态)
const foundA = c => c === "b" ? foundB : c === "a" ? foundA : start; // 处理b状态
const foundB = c => c === "c" ? end : c === "a" ? foundA : start; // 处理c状态
const end = c => end; // 结束状态

function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

// function start(c) {
//   if (c === "a") {
//     return foundA;
//   }
//   return start;
// }

// function end(c) {
//   return end;
// }

// function foundA(c) {
//   if (c === "b") {
//     return foundB;
//   } else if (c === "a") {
//     return foundA
//   }
//   // return start(c);
//   return start;

// }

// function foundB(c) {
//   if (c === "c") {
//     return end;
//   } else if (c === "a") {
//     return foundA
//   }
//   // return start(c);
//   return start;
// }


console.log(
  match("i am aabc")
)
