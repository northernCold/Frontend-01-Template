// abcabx

const start = c => c === "a" ? foundA : start;
const foundA = c => c === "b" ? foundB : start(c);
const foundB = c => c === "c" ? foundC : start(c);
const foundC = c => c === "a" ? foundA1 : start(c);
const foundA1 = c => c === "b" ? foundB1 : start(c);
const foundB1 = c => c === "x" ? end : c === "c" ? foundA1 : start(c);
const end = _ => end;

function match(input) {
  let state = start;
  for (let c of input) {
    state = state(c);
  }
  return state === end;
}

console.log(
  match("ababcabx"),
  match("abcabx")
)