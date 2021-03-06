# 每周总结可以写在这里

### match

实现了
 - 简单选择中的  类型选择器(type)、类选择器、id选择器、*、
 - 以上简单选择器相互组合的复合选择器
 - 复杂选择器 " ",">","+","~"

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div>
    <div id="nc" class="abc">
      <div id="email">
        <a id="href" href="">111</a>
        <div id="port">
          <a href="">22</a>
        </div>
      </div>
    </div>
    <section class="module" id="book">
      <article id="en" class="nature">
        <p class="title">
          <a href="" id="logo"></a>
        </p>
      </article>
    </section>
  </div>
</body>
<script>
  // 将每个复合选择器转化为一个都是简单选择器的对象
  function resovleSimpleSelectorSequence(selector) {
    const ident = "[a-z-A-Z0-9]+";
    const type = new RegExp(ident, "g");
    const universal = new RegExp("\\*", "g")
    const clazz = new RegExp(`\\.${ident}`, "g");
    const id = new RegExp(`\\#${ident}`, "g");
    const attr = new RegExp(`(\\[.+\\])`, "g");
    const pseudo = new RegExp("::?(.+)", "g");
    const negation = new RegExp(":not\\(.+\\)", "g");
    
    const simpleSelector = [];
    let temp = selector;
    
    let match;
    let regMap = ["negation", "pseudo", "attr", "id", "clazz", "universal", "type"];
    [negation, pseudo, attr, id, clazz, universal, type].forEach((reg, i) => {
      match = temp.match(reg);
      if (match) {
        temp = temp.replace(reg, "");
        let data = simpleSelector[regMap[i]];
        if (data) {
          data.add(match)
        } else {
          simpleSelector[regMap[i]] = [...new Set(match)];
        }
      }
    })
    return simpleSelector;
  }

  // 简单选择器与dom匹配
  function matchSimple(selector, element) {
    for(let key in selector) {
      // type 或者 universal 一般只有一个
      if (key === "universal") {
        return element;
      }
      if (key === "type") {
        if (element.tagName && selector[key][0] === element.tagName.toLowerCase()) {
          return element
        }
        return null;
      }

      if (key === "id" || key === "clazz") {
        let tkey = key === "id" ? "id" : "clazz";
        let elSelector = key === "id" ? element.id : element.className;
        if (!elSelector) return null;
        for (let i in selector[tkey]) {
          if (elSelector.indexOf(selector[tkey][i].slice(1)) === -1) {
            return null
          }
        }
        return element;
      }
    }
  }

  // 处理“ ”， 遍历element元素与selector匹配
  function resovleDescendant(selector, element) {
    const stack = [element];
    let next, pre, connector;
    selector.match(/([^+~ >]+)(?:\s*([+~ >])\s*)?(.*)/);
    pre = RegExp.$1;
    connector = RegExp.$2;
    next = RegExp.$3;
    const preSelector = resovleSimpleSelectorSequence(pre);
    while(stack.length !== 0) {
      let cur = stack.pop();
      stack.push(...cur.children)
      let el = matchSimple(preSelector, cur);
      if (!el) continue;
      if (!next) return true;
      if (connector === " ") {
        return resovleDescendant(next, cur);
      } else if (connector === ">") {
        return resovleChild(next, cur);
      } else if (connector === "+") {
        return resovleNextSibling(next, cur);
      } else if (connector === "~") {
        return resovleSubsequentSibling(next, cur);
      }
    };
    return false;
  };

  // 处理“>”, 循环element的children属性
  function resovleChild(selector, element) {
    let next, pre, connector;
    selector.match(/([^+~ >]+)(?:\s*([+~ >])\s*)?(.*)/);
    pre = RegExp.$1;
    connector = RegExp.$2;
    next = RegExp.$3;
    const preSelector = resovleSimpleSelectorSequence(pre);
    for (let i = 0; i < element.children.length; i++) {
      let cur = element.children[i];
      let el = matchSimple(preSelector, cur);
      if (!el) continue;
      if (!next) return true;
      if (connector === " ") {
        return resovleDescendant(next, cur);
      } else if (connector === ">") {
        return resovleChild(next, cur);
      } else if (connector === "+") {
        return resovleNextSibling(next, cur);
      } else if (connector === "~") {
        return resovleSubsequentSibling(next, cur);
      }
    };
    return false;
  };

  // 处理“+” 寻找element的第一个子元素
  function resovleNextSibling(selector, element) {
    let next, pre, connector;
    selector.match(/([^+~ >]+)(?:\s*([+~ >])\s*)?(.*)/);
    pre = RegExp.$1;
    connector = RegExp.$2;
    next = RegExp.$3;
    const preSelector = resovleSimpleSelectorSequence(pre);
    let cur = element.children[0];
    let el = matchSimple(preSelector, cur);
    if (!el) return false;
    if (!next) return true;
    if (connector === " ") {
      return resovleDescendant(next, cur);
    } else if (connector === ">") {
      return resovleChild(next, cur);
    } else if (connector === "+") {
      return resovleNextSibling(next, cur);
    } else if (connector === "~") {
      return resovleSubsequentSibling(next, cur);
    }
    return false;
  };

  // 处理“~”  寻找element的之后的兄弟元素
  function resovleSubsequentSibling(selector, element) {
    let next, pre, connector;
    selector.match(/([^+~ >]+)(?:\s*([+~ >])\s*)?(.*)/);
    pre = RegExp.$1;
    connector = RegExp.$2;
    next = RegExp.$3;
    const preSelector = resovleSimpleSelectorSequence(pre);

    let cur = element.nextElementSibling;
    while(cur) {
      let el = matchSimple(preSelector, cur);
      cur = element.nextElementSibling
      if (!el) continue;
      if (!next) return true;
      if (connector === " ") {
        return resovleDescendant(next, cur);
      } else if (connector === ">") {
        return resovleChild(next, cur);
      } else if (connector === "+") {
        return resovleNextSibling(next, cur);
      } else if (connector === "~") {
        return resovleSubsequentSibling(next, cur);
      }
    };
  };


  function match(selector, element) {
    // 刚开始可以看做 “* [selector]”
    ` ${selector}`.match(/([^+~ >]*)(?:\s*([+~ >])\s*)?(.*)/);
    pre = RegExp.$1;
    connector = RegExp.$2;
    next = RegExp.$3;
    isOk = resovleDescendant(next, document);
    console.log(isOk);
    return isOk;
  }

  match("div#nc.abc #email>a", document.getElementById("href")); // true
  match("body section.module#book article#en.nature p.title>#logo", document.getElementById("logo"));  // true
  match("body p.title>#logo", document.getElementById("logo")); // true
  match("#href~#port", document.getElementById("port")); // true
  match("#email+#href", document.getElementById("port")); // true
</script>
</html>
```

### render

使用`images`node包把布局好的元素绘制出来。

```html
`<html>
<head>
    <style>
.p {
    display: inline-flex;
    justify-content: center;
    width: 800px;
    background-color: rgb(255,255,255);
}

.p div {
    background-color: rgb(255,255,255);
    width: 100px;
    height: 100px;
}
.p .c1 {
    background-color: rgb(123,1,52);
}
.p .c2 {
    background-color: rgb(123,1,1);
}
.p .c3 {
    background-color: rgb(2,1,52);
}
.p .c4 {
    background-color: rgb(32,1,52);
}
    </style>
</head>
<body>
    <div class="p">
        <div class="c1"></div>
        <div class="c2"></div>
        <div class="c3"></div>
        <div class="c4"></div>
    </div>
</body>
</html>`
```



结果：

![render](./toy-browser/viewport.jpg)
