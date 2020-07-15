# 每周总结可以写在这里

```javascript
import { createElement, Text, Wrapper } from "./createElement";

class Carousel {
  constructor() {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    let children = this.data.map(url => {
      let element = <img src={url}/>;
      element.addEventListener("dragstart", event => event.preventDefault())
      return element;
    })
    let root = (
      <div class="carousel">
        { children }
      </div>
    );
    let position = 0;
    // let nextPic = () => {
    //   let nextPosition = (position + 1) % this.data.length;
    //   let current = children[position];
    //   let next = children[nextPosition];

    //   current.style.transition = "ease 0s";
    //   next.style.transition = "ease 0s";

    //   current.style.transform = `translateX(${-100 * position}%)`
    //   next.style.transform = `translateX(${100 -100 * nextPosition}%)`;

    //   setTimeout(function () {
    //     // means use class rules
    //     current.style.transition = "";
    //     next.style.transition = "";
     
    //     current.style.transform = `translateX(${ -100 -100 * position}%)`
    //     next.style.transform = `translateX(${-100 * nextPosition}%)`;
     
    //     position = nextPosition;
    //   }, 16)

    //   setTimeout(nextPic, 1000);
    // }
    // setTimeout(nextPic, 1000);
    
    
    root.addEventListener("mousedown", event => {
      let startX = event.clientX;
      let startY = event.clientY;

      let nextPosition = (position + 1) % this.data.length;
      let lastPosition = (position - 1 + this.data.length) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];
      let last = children[lastPosition];

      current.style.transition = "ease 0s";
      next.style.transition = "ease 0s";
      last.style.transition = "ease 0s";
      
      current.style.transform = `translateX(${ -500 * position})`
      last.style.transform = `translateX(${-500 -500 * lastPosition})`
      next.style.transform = `translateX(${500 -500 * nextPosition})`

      let move = event => {
      
        current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`
        last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`
        next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`
        // console.log(event.clientX - startX, event.clientY - startY)
      };
      let up = event => {
        let offset = 0;
        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < -250){
          offset = -1;
        }

        position = (position - offset + this.data.length) % this.data.length;
        current.style.transition = "";
        next.style.transition = "";
        last.style.transition = "";

        current.style.transform = `translateX(${offset * 500 - 500 * position}px)`
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`
        next.style.transform = `translateX(${offset * 500  + 500 - 500 * nextPosition}px)`

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      
      document.addEventListener("mousemove", move)

      document.addEventListener("mouseup", up)

    })
    return root;
  }
  
  mountTo(parent) {
    this.render().mountTo(parent);
  }

  appendChild(child) {
    this.children.push(child)
  }
}

let component = <Carousel data={
  [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
  ]
}>
  <div>{ new Wrapper("span") }</div>
</Carousel>

console.log(component)
component.mountTo(document.body)

```

```javascript
// 创建顺序 先子后父
export function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === "string") {
    o = new Wrapper(Cls)
  } else {
    o = new Cls;
  }
  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }
  

  let visit = (children) => {
    for (let child of children) {
      if (typeof child === "object" && child instanceof Array) {
        visit(child);
        continue;
      }
      if (typeof child === "string") {
        child = new Text(child);
      }
      o.appendChild(child)
    }
  }

  visit(children)

  return o;

}


export class Wrapper {
  constructor(tagName) {
    this.children = [];
    this.root = document.createElement(tagName);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }

  get style() {
    return this.root.style
  }

  addEventListener() {
    this.root.addEventListener(...arguments)
  }

  appendChild(child) {
    this.children.push(child)
  }
}

export class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
```