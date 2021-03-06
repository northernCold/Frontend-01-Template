# 每周总结可以写在这里


## 一、带括号的四则
```
<Expression> ::= <AdditiveExpression>

<AdditiveExpression> ::=
	<MultiplicativeExpression> |
	<MultiplicativeExpression> "+" <AdditiveExpression>
	<MultiplicativeExpression> "-" <AdditiveExpression>

<MultiplicativeExpression> ::=
	<Number> |
	<MultiplicativeExpression> "*" <Number>
	<MultiplicativeExpression> "/" <Number>
```

```
<Expression> ::= <AdditiveExpression>

<AdditiveExpression> ::=
	<MultiplicativeExpression> |
	<MultiplicativeExpression> "+" <AdditiveExpression>
	<MultiplicativeExpression> "-" <AdditiveExpression>

<MultiplicativeExpression> ::=
	<PrimaryExpression> |
	<MultiplicativeExpression> "*" <PrimaryExpression>
	<MultiplicativeExpression> "/" <PrimaryExpression>
	
<PrimaryExpression> ::= <Number> | "(" <AdditiveExpression> ")"
```

```html
<script>
  let regexp = /([0-9]+)|([ ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)|(\()|(\))/g;
let dictionary = ["Number", "Whitespace", "LineTerminator", "+", "-", "*", "/", "(", ")"];

function* tokenize (source) {
  let result = null;
  let lastIndex = 0;
  do {
    lastIndex = regexp.lastIndex;
    result = regexp.exec(source);
    if (!result) {
      yield { type: "EOF" }
      return
    };
    if(regexp.lastIndex - lastIndex > result[0].length) {
      throw new Error(`Unexpected token "${source.substr(lastIndex, regexp.lastIndex - lastIndex - result[0].length)}"`)
    }

    let token = {
      type: null,
      value: null
    } 
    for (let i = 0; i < dictionary.length; i++) {
      if (result[i + 1]) {
        token.type = dictionary[i];
      }
    }
    token.value = result[0];
    yield token;
    // console.log(result[0])

  } while(result);
}

let result = [];
for(let token of tokenize("(1024 + (5 - 2)) * 25")) {
  if (["Whitespace", "LineTerminator"].indexOf(token.type) === -1) {
    result.push(token);
  }
}
console.log(
  Expression(result)
);

function Expression (source) {
  debugger
  if (source[0].type === "AdditiveExpression" &&
    source[1].type === "EOF") {
    let node = {
      type: "Expression",
      children: [source.shift(), source.shift()]
    }
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression (source) {
  if (
    source[0].type === "Number" ||
    source[0].type === "("
  ) {
    MultiplactiveExpression(source);
  }
  if (source[0].type === "MultiplicativeExpression") {
    let node = {
      type: "AdditiveExpression",
      children: [source.shift()]
    }
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === "AdditiveExpression" &&
    source.length > 1 && source[1].type === "+") {
    let node = {
      type: "AdditiveExpression",
      children: [source.shift(), source.shift()]
    }
    MultiplactiveExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === "AdditiveExpression" &&
    source.length > 1 && source[1].type === "-") {
    let node = {
      type: "AdditiveExpression",
      children: [source.shift(), source.shift()]
    }
    MultiplactiveExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
}

function MultiplactiveExpression (source) {
  if (
    source[0].type === "Number" ||
    source[0].type === "("
  ) {
    PrimaryExpression(source);
    // return MultiplactiveExpression(source);
  }
  if (source[0].type === "PrimaryExpression") {
    let node = {
      type: "MultiplicativeExpression",
      children: [source.shift()]
    }
    source.unshift(node);
  }
  if (source[0].type === "MultiplicativeExpression" &&
    source.length > 1 && source[1].type === "*") {
    let node = {
      type: "MultiplicativeExpression",
      children: [source.shift(), source.shift()]
    }
    PrimaryExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplactiveExpression(source);
  }
  if (source[0].type === "MultiplicativeExpression" &&
    source.length > 1 && source[1].type === "/") {
    let node = {
      type: "MultiplicativeExpression",
      children: [source.shift(), source.shift()]
    }
    PrimaryExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplactiveExpression(source);
  }
  // if (source.type === "MultiplicativeExpression") {
  //   return source[0];
  // }
}

function PrimaryExpression (source) {
  if (source[0].type === "Number") {
    let node = {
      type: "PrimaryExpression",
      children: source.shift()
    }
    source.unshift(node);
  }
  if (
    source[0].type === "("
  ) {
    let node = {
      type: "PrimaryExpression",
      children: [source.shift()]
    }
    AdditiveExpression(source);
    node.children.unshift(source.shift());
    node.children.unshift(source.shift());
    source.unshift(node);
  }
}
// 尾部不合法

// option
// 正则风格tokenize改成状态机
// 括号
</script>
```

## 二、字段树

```html
<script>
  class Trie {
    constructor () {
      this.root = new Map();
    }
    insert(word) {
      let node = this.root;
      for (let c of word) {
        if (!node[c]) {
          node[c] = Object.create(null);
        }
        node = node[c];
      }
      if (!("$" in node)) {
        node["$"] = 0;
      }
      node["$"]++;
    }
    most() {
      let max = 0;
      let maxWord = null;
      let visit = (node, word) => {
        if (node.$ && node.$ > max) {
          max = node.$;
          maxWord = word;
        }
        for (let p in node) {
          visit(node[p], word + p);
        }
      }
      visit(this.root, "");
      console.log(maxWord);
    }
  }
  function randomWord(length) {
    let s = "";
    for (let i = 0; i < length; i++) {
      s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
    }
    return s;
  }

  const trie = new Trie();
  for (let i = 0; i < 1000; i++) {
    trie.insert(randomWord(4))
  }
</script>
```

## 三、kmp

```javascript
function getNext(pattern) {
  let j = -1;
  let ret = [-1];
  for (let i = 0; i < pattern.length - 1;) {
    if (j === -1 || pattern[i] === pattern[j]) {
      i++;
      j++;
      ret[i] = j;
    } else {
      j = ret[j]
    }
  }
  return ret;
}
function kmp(str, pattern) {
  const next = getNext(pattern);
  let j = 0;
  for (let i = 0; i < str.length;) {
    if (j === -1 || str[i] === pattern[j]) {
      if (j === pattern.length - 1) return true;
      i++;
      j++;
    } else {
      j = next[j]
    }
  }
  return j === pattern.length - 1;
}

console.log(
  kmp("acabaabaabcaccaabc","abaabcac")
)
```


## 四、wildcard

```javascript
function find (source, pattern) {
  let startCount = 0;
  for (let i =0; i < pattern.length; i++) {
    if (pattern[i] === "*") {
      startCount++;
    }
  }

  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") return false;
    }
  }

  let i = 0;
  let lastIndex = 0;

  for (i = 0; pattern[i] !== "*" ; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== "?") return false;
  }

  lastIndex = i;

  for (let j = 0; j < startCount - 1; j++) {
    i++;
    let subPattern = "";
    while (pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]", "g"));
    reg.lastIndex = lastIndex;

    reg.exec(source);

    lastIndex = reg.lastIndex;
  }

  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") return false;
  }

  return true
}

console.log(
  find("abcabcxbabdabc","ab*ab*dabc")
)
```