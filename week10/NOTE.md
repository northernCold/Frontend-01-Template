# 每周总结可以写在这里

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      display: inline-block;
      width: 50px;
      height: 50px;
      background: green;
      margin: 2px;
      font-size: 34px;
      line-height: 50px;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
    }
    #app {
      font-size: 0;
      width: 166px;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    let pattern = [
      0, 0, 0,
      0, 1, 0,
      0, 0, 2
    ];
    let turn = true;
    function show () {
      const app = document.querySelector("#app");
      app.innerHTML = "";
      function createBox(el, label, i) {
        const div = document.createElement("div");
        div.className = "box";
        if (label && label !== 0) {
          div.innerText = label === 1 ? "⭕" : "❌";
        }
        div.addEventListener("click", () => {
          move(i)
          check(i, pattern[i])
        })
        el.appendChild(div);
      }
      function move (x) {
        turn = !turn;
        if (pattern[x] !== 0) return;
        pattern[x] = turn ? 1 : 2;
        show();
        if (check(pattern, pattern[x])) {
          alert(`${pattern[x] === 1 ? "⭕" : "❌"} is winner`)
        }
        if (willWin(pattern, 3 - pattern[x])) {
          console.log(`${3 - pattern[x] === 1 ? "⭕" : "❌"} will win`)
        }
        console.log(bestChoice(pattern, pattern[x]).point, bestChoice(pattern, pattern[x]).result)
      }
      for(let i = 0; i < pattern.length; i++) {
        createBox(app, pattern[i], i);
      };
    }

    function check (p, val) {
      for (let i = 0; i < 3; i++) {
        {
          let win = true;
          for (let j = 0; j < 3; j++) {
            if (p[i*3+j] !== val) {
              win = false;
              break;
            }
          }
          if (win) {
            return true;
          }
        }
        {
          let win = true;
          for (let j = 0; j < 3; j++) {
            if (p[j*3+i] !== val) {
              win = false;
              break;
            }
          }
          if (win) {
            return true;
          }
        }
        {
          let win = true;
          for (let j = 0; j < 3; j++) {
            if (p[j*3+j] !== val) {
              win = false;
              break;
            }
          }
          if (win) {
            return true;
          }
        }
        {
          let win = true;
          for (let j = 0; j < 3; j++) {
            if (p[j*3+2-j] !== val) {
              win = false;
              break;
            }
          }
          if (win) {
            return true;
          }
        }
      }
      return false;
    }
    
    function willWin (p, val) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (p[i*3+j] !== 0) continue;
          let t = JSON.parse(JSON.stringify(p));
          t[i*3+j] = val;
          if (check(t, val)) {
            return [i, j];
          }
        }
      }
      return false;
    }

    function bestChoice(p, val) {
      let point = null;
      if (point = willWin(p, val)) {
        return {
          point: point,
          result: 1
        }
      }

      let result = -1;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (p[i*3+j] !== 0) continue;
          let t = JSON.parse(JSON.stringify(p));
          t[i*3+j] = val;
          let opp = bestChoice(t, 3 - val);
          if (-opp.result >= result) {
            point = [i, j];
            result = -opp.result;
          }
        }
      }

      return {
        point: point,
        result: point ? result : 0
      }
    }

    show();
  </script>
</body>
</html>
```