// abababx
let count = 0;
const start = c => findA(c);
const findA = c => {
  if (c === "a") {
    return findB;
  }
  count = 0;
  return start;
}
const findB = c => {
  if (c === "b") {
    count++;
    return count === 3 ? findX : findA
  }
  return start(c);
}
const findX = c => {
  if (c === "x") {
    return end;
  }
  return start(c);
}
const end = _ => end;

function match(input) {
  let state = start;
  for (let c of input) {
    state = state(c);
  }
  return state === end;
}

console.log(
  match("aabababx")
)