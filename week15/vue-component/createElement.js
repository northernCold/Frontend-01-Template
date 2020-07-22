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
  console.log(o)
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