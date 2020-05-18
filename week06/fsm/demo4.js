const match = (pattern, input) => {
  if (pattern === "") return true;

  // 生成next数组
  const generateNext = (p) => {
    const next = [];
    let i = 0, j = - 1;
    next[0] = -1;
    while(i < p.length - 1) {
      if (j === - 1 || p[i] === p[j]) {
        i++;
        j++;
        next[i] = j;
      } else {
        j = next[j];
      }
    }
    return next;
  }
  const generateState = state => {
    return function (c) {
      count++;
      if (c == state) {
        if (index < stateOrder.length - 1) {
          index++;
        }
        return stateOrder[index]
      } else {
        if (next[index] !== 0 && next[index] !== -1) {
          index = next[index];
          return stateOrder[index](c)
        } else {
          index = 0;
          // 返回开始状态时 根据当前字符是否等于pattern第一个字符判断是否需要当前的字符
          if (c === pattern[0]) {
            return start(c);
          } else {
            return start;
          }
        }
      }
    }
  }

  const start = c => stateOrder[index](c); // // 开始状态

  const end = c => end; // 结束状态

  // 生成状态表
  const generateStateOrder = p => p.split("").map(state => generateState(state, p));
  
  let stateOrder = generateStateOrder(pattern, generateState);
  stateOrder.push(end);
  let next = generateNext(pattern);
  let index = 0; // 当前状态的下标
  let state = start;
  for (let c of input) {
    state = state(c);
  }
  return state === end;
}

console.log(match("ebcf", "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef"))
module.exports = match;


// abababca

// a ab aba abab ababa ababab abababca
// a ca bca abca babca ababca bababca

//       a b a b a b c a
// index 0 1 2 3 4 5 6 7
// pmt   0 0 1 2 3 4 0 1
// next -1 0 0 1 2 3 4 0

//       a b c a b x
// index 0 1 2 3 4 5
// pmt   0 0 0 1 2 0
// next -1 0 0 0 1 2

//  eeeeeeeeef

// ef
//-01