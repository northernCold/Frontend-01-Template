# 每周总结可以写在这里

> 用状态机处理完全未知的 pattern 实现在`fsm/demo4.js`

[TOC]

## 状态机

> **有限状态机**又称**有限状态自动机**，简称**状态机**，是表示有限个状态以及在这些状态之间的转移和动作等行为的数学计算模型。

### 1. 使用状态机匹配“abc”字符串

入口函数main，输入每一个字符，用状态(start)处理，并放回一个状态(state)，继续处理下一个字符。

```javascript
function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}
```

匹配“abc",需要三个状态，分别是处理a、b、c的状态, 还有开始状态和结束状态，这里的开始状态即为处理a的状态

``` javascript
const start = c => c === "a" ? foundA : start; // 开始状态（处理a状态)
const foundA = c => c === "b" ? foundB : start; // 处理b状态
const foundB = c => c === "c" ? end : start; // 处理c状态
const end = c => end; // 结束状态
```

状态转移的顺序：start => foundA => foundB => end。 只有状态全部走完到结束状态则说明字符匹配成功。

状态说明：

结束状态(end), 不处理任何输入的字符，直至字符串结束。

剩余其他的状态的逻辑都是：如果输入字符是期待的字符，进入下一个状态，否则重新回到开始状态。

执行

```javascript
console.log(match("i am abc")) // true
```

但是这个状态机有个缺陷：

```javascript
console.log(match("i am aabc")) // false
```

“i am aabc”中有“abc”字符串，正确的应该返回true。

问题出现在 "i am aabc“字符中处理，

1. 第二a的时候，此时状态是start，输入的字符是a，进入下一个状态foundA，

2. foundA处理下一个字符”a“，不匹配，回到开始状态

3. start处理下一个字符“b”, 不匹配，回到开始状态

4. 重复...不匹配，回到开始状态

第二个步骤的时候，处理字符的时候把“i am aabc”第三个a字符“吃掉了”。

正确的处理办法是：

1.当每个状态处理字符匹配失败时，返回使用开始状态处理当前字符后的状态。

```javascript
const start = c => c === "a" ? foundA : start; // 开始状态（处理a状态)
const foundA = c => c === "b" ? foundB : start(c); // 处理b状态
const foundB = c => c === "c" ? end : start(c); // 处理c状态
const end = c => end; // 结束状态

console.log(match("i am aabc")) // true
```

2.当每个状态处理字符匹配失败时，在判断当前字符是否为a，如果是返回foundA状态，否则返回开始状态。

```javascript
const start = c => c === "a" ? foundA : start; // 开始状态（处理a状态)
const foundA = c => c === "b" ? foundB : c === "a" ? foundA : start; // 处理b状态
const foundB = c => c === "c" ? end : c === "a" ? foundA : start; // 处理c状态
const end = c => end; // 结束状态

console.log(match("i am aabc")) // true
```

### 如何使用状态机处理诸如“abcabx”这样的字符串

```javascript
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
  match("ababcabx"),  // true
  match("abcabx") // true
)
```

### 用状态机处理匹配“abababx”

```javascript
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
```

### 使用状态机处理完全为止的pattern

要处理的问题：

1. 根据pattern生成状态
2. 处理出现“吃掉”字符的情况
3. 匹配成功标准
4. 处理诸如“abcabx”的情况


#### 1.根据pattern生成状态、

分割pattern字符串，根据每个字符生成一个相应的状态，按顺序保存在一个数组(状态表)中

#### 2.处理出现“吃掉”字符的情况

首先知道的是什么情况下才出现“吃掉”字符的情况： 一般是回到之前状态的时候

#### 3.匹配成功标志

生成好的状态表中push一个结束状态(`const end = c => end`), 最后的状态如果是结束状态则代表匹配成功

#### 4.处理诸如“abcabx”的情况

> 参考kmp的 部分匹配表(Partial Match Table)

状态表： stateA1 => stateB1 => stateC = stateA2 => stateB2 => stateX

当pattern是abcabx, input是abcabcabx, 当匹配到"abcab**c**abx"中第6个字符("c")时, **stateX**状态处理时匹配失败（是否是“x”字符），错误的做法是回到开始状态**stateA1**，继续读取下一个字符，最后返回false。应该如何处理第6个字符("c")，下一个状态应该是**stateA2**。

简单来说：stateX处理，字符为x的时候，进入结束状态；字符为c，回到stateA2的状态，其他字符的时候回到开始状态(stateA1)。

“abcabx"可以直接把stateX函数可以写死，但是pattern是未知的时候该如何处理呢？

**重点就是如何在某个状态的时候，匹配失败时，根据当前的字符，返回到之前状态还是开始状态**，这里要利用KMP算法思想。

|             char              | a    | b    | c    | a    | b    | x    |
| :---------------------------: | ---- | ---- | ---- | ---- | ---- | ---- |
|             index             | 0    | 1    | 2    | 3    | 4    | 5    |
| 前缀后缀的公共元素的 最大长度 | 0    | 0    | 0    | 1    | 2    | 0    |
|             next              | -1   | 0    | 0    | 0    | 1    | 2    |

> KMP算法: https://www.zhihu.com/question/21923021

转化为

|         char         | a       | b       | c       | a       | b          | x         |
| :------------------: | ------- | ------- | ------- | ------- | ---------- | --------- |
|        index         | 0       | 1       | 2       | 3       | 4          | 5         |
|    state（状态）     | stateA1 | stateB1 | stateC  | stateA2 | stateB2    | stateX    |
| 匹配失败，回到的状态 | stateA1 | stateA1 | stateA1 | stateA2 | stateB1(c) | stateC(c) |

> stateB1(c) ：下一个状态继续处理当前的字符

pattern: abcabcabx

input: abcabx

计算过程：

```
第一个字符a，进入开始状态stateA1, 匹配成功，返回下一个状态stateB1
第二个字符b，进入stateB1, 匹配成功，返回下一个状态stateC
第三个字符c，进入stateC，匹配成功，返回下一个状态stateA2
第四个字符a，进入stateA2,匹配成功，返回下一个状态stateB2
第五个字符b。进入stateB2,匹配成功，返回下一个状态stateX
第六个字符c，进入stateX，匹配失败，返回stateC(c)的状态
还是第六次c，进入stateC，匹配成功，放回下一个状态stateA2
第七个个字符a，进入stateA2,匹配成功，返回下一个状态stateB2
第八个字符b，进入stateB2,匹配成功，返回下一个状态stateX
第九个字符x，进入stateX，匹配成功，返回结束状态
```

```javascript
const match = (pattern, input) => {
  if (pattern === "") return true;

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
          if (c === pattern[0]) {
            return start(c);
          } else {
            return start;
          }
        }
      }
    }
  }

  const start = c => stateOrder[index](c)

  const end = c => end;

  const generateStateOrder = p => p.split("").map(state => generateState(state, p));
  
  let stateOrder = generateStateOrder(pattern, generateState);
  stateOrder.push(end);
  let next = generateNext(pattern);
  let index = 0;
  let state = start;
  for (let c of input) {
    state = state(c);
  }
  return state === end;
}
```

### 测试结果

![image-20200517173201532](D:\workplace\northernCold\Frontend-01-Template\week06\fsm\img\test.png)

## 浏览器

解析dom树中需要注意的地方是

- HTML字符串中有三种类型：标签、文本、属性

- 维护一个栈来构建dom对象，开始标签入栈，结束标签出栈。（自封闭标签先入栈在出栈）

计算css中需要注意的地方：

- 解析html时，遇到style就解析css规则
- 标签解析标签名、属性后，就可以开始计算css
- css优先级，行内 > id > class > tag, 后面永远小于前面，计算优先级的时候前面相当于后面一个乘了一个巨大的数

#### 深度遍历解析html出现的对象，生成字符串打印。验证结果的准确性

遍历实现地址`/toy-broswer/dfs.js`

![image-20200520214448465](.\img\image-20200520214448465.png)

![image-20200520214857321](.\img\image-20200520214857321.png)

结果证明是正确的。