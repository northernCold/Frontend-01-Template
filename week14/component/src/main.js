class Div {
  constructor(config) {

    this.children = [];
    this.root = document.createElement("div");
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child in this.children) {
      child.mountTo(this.root);
    }
  }

  // child
  appendChild(child) {
    // this.root.appendChild(child);
    child.mountTo(this.root);
    console.log("Parent::appendChild",child)
  }
}

class Wrapper {
  // config
  constructor(tagName) {
    this.children = [];
    this.root = document.createElement(tagName);
  }

  setAttribute(name, value) {
    // console.log(name, value);
    this.root.setAttribute(name, value);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }

  // child
  appendChild(child) {
    this.children.push(child)
  }
}

class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class MyComponent {
  constructor() {
    this.children = [];
  }

  // attribute
  setAttribute(name, value) {
    // console.log(name, value);
    this.root.setAttribute(name, value);
  }

  render() {
    return (
      <article>
        <header>Header</header>
        { this.slot }
        <footer>Footer</footer>
      </article>
    ) 
  }
  
  mountTo(parent) {
    this.slot = <div></div>;
    for (let child of this.children) {
      this.slot.appendChild(child)
    }
    this.render().mountTo(parent);
  }

  // child
  appendChild(child) {
    this.children.push(child)
  }
}
// let component = (<Div id="a" class="b" style="height: 200px; width: 200px; background: lightblue">
// <Div></Div>
// <Div></Div>
// <Div></Div>
// </Div>);

// let component = (<div id="a" class="b" style="height: 200px; width: 200px; background: lightblue">
// <div></div>
// <div></div>
// <div></div>
// </div>);

// let component = (<div id="a" class="b" style="height: 200px; width: 200px; background: lightblue">
// 123
// </div>);

let component = <MyComponent>
  <div>{ new Wrapper("span") }</div>
</MyComponent>

console.log(component)
component.mountTo(document.body)
// 创建顺序 先子后父
function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === "string") {
    o = new Wrapper(Cls)
  } else {
    o = new Cls;
  }
  for (let name in attributes) {
    // o[name] = attributes[name];
    o.setAttribute(name, attributes[name]);
  }
  
  for (let child of children) {
    if (typeof child === "string") {
      child = new Text(child);
    }
    o.appendChild(child)
    // o.children.push(child)
  }
  return o;

}

console.log(component)