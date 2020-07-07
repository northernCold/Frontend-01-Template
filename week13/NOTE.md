# 每周总结可以写在这里

## 一、Vue3中effect的实现原理

1. 维护一个reactive和effect都能访问的变量useReactivities
2. 执行effect时，useReactivities清空，会执行一次回调函数
3. 执行回调函数过程中，访问到proxy对象的属性，触发get，将对象和属性push到useReactivities
4. 遍历useReactivities, 将访问的对象路径保存，值为回调函数
5. 然后修改prox对象的属性的值之后，会触发set方法，通过对象路径是否有回调函数，有则执行。

```html
<input id="r" type="range" min="0" max="255">
<input id="g" type="range" min="0" max="255">
<input id="b" type="range" min="0" max="255">

<div id="color" style="width: 200px; height: 200px;"></div>
<script>
let object = {
  a: 1,
  b: 2
}
let reactivities = new Map();
let handlers = new Map();
let useReactivities = [];


function reactive (obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj);
  }
  
  let proxy = new Proxy(obj, {
    get (obj, prop, c) {
      useReactivities.push([obj, prop])
      if (typeof obj[prop] === "object") {
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
    set (obj, prop, val) {
      obj[prop] = val
      console.log(handlers)
      if (handlers.get(obj) && handlers.get(obj).get(prop)) {
        for (let handler of handlers.get(obj).get(prop)) {
          handler();
        }
      }
      return obj[prop];
    }
  })

  reactivities.set(obj, proxy);

  return proxy;
}

function effect (handler) {
  useReactivities = [];
  handler();
  console.log(useReactivities)
  for (let useReactivity of useReactivities) {
    let [obj, prop] = useReactivity;
    console.log([obj, prop])
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map())
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, [])
    }

    handlers.get(obj).get(prop).push(handler)
  }
}

// let dummy;

// let proxy = reactive(object);

// effect(() => dummy = proxy.a);
// console.log(dummy);
// proxy.a = 2;
// console.log(dummy);

// let v12, v1, v2;
// let p1 = reactive({a:1});
// let p2 = reactive({a:2});

// effect(() => v12 = p1.a + p2.a);
// effect(() => v1 = p1.a);
// effect(() => v2 = p2.a);

// let v;
// let p1 = reactive({a:1});
// let p2 = reactive({a:2});

// let b = true;
// effect(() => v = b ? 2 : p1.a);
// console.log(v);
// b = false;

// p1.a = 10;
// console.log(v);

let p = reactive({r: 100, g: 100, b: 100});
effect(() => {
  document.querySelector("#r").value = p.r;
  document.querySelector("#g").value = p.g;
  document.querySelector("#b").value = p.b;
})

document.querySelector("#r").addEventListener("input", (event) => {
  p.r = event.target.value;
})

document.querySelector("#g").addEventListener("input", (event) => {
  p.g = event.target.value;
})

document.querySelector("#b").addEventListener("input", (event) => {
  p.b = event.target.value;
})

effect(() => {
  document.querySelector("#color").style.backgroundColor = `rgb(${p.r},${p.g},${p.b})`
})
</script>
```

### 二、 Range

```html
<div id="dragable" style="width: 100px; height: 100px; background-color: pink; display: inline-block;"></div>
<div id="container">
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
  文字 文字 文字 文字 文字 文字 文字
</div>
<script>
  let dragable = document.querySelector("#dragable");

  let baseX = 0;
  let baseY = 0;
  // 为什么是嵌套
  dragable.addEventListener("mousedown", event => {
    let startX = event.clientX;
    let startY = event.clientY;
    let move = event => {
      // let x = baseX + event.clientX - startX;
      // let y = baseY + event.clientY - startY;
      // dragable.style.transform = `translate(${x}px, ${y}px)`;
      
      let range = nearest(event.clientX, event.clientY);
      range.insertNode(dragable)
    };
    let up = event => {
      baseX = baseX + event.clientX - startX;
      baseY = baseY + event.clientY - startY;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    
    document.addEventListener("mousemove", move)

    document.addEventListener("mouseup", up)

  })

  let ranges = [];
  let container = document.querySelector("#container");
  for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
    let range = document.createRange();
    range.setStart(container.childNodes[0], i);
    range.setEnd(container.childNodes[0], i);
    console.log(range.getBoundingClientRect());
    ranges.push(range);
  }
  
  function nearest (x0, y0) {
    let nearestRange;
    let distance = Infinity;
    for (let range of ranges) {
      let {x, y} = range.getBoundingClientRect();
      let d = (x0 - x) ** 2 + (y0 - y) ** 2;

      if (d < distance) {
        nearestRange = range;
        distance = d;
      }
    }

    return nearestRange;
  }

  document.addEventListener("selectstart", event => {
    event.preventDefault();
  })
</script>
```