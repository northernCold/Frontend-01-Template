import { createElement, Text, Wrapper } from "./createElement";
import { Timeline, Animation, ColorAnimation } from "../../../week15/animation/animation";

let linear = t => t;
class Carousel {
  constructor() {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    console.log(name)
    if (name === "onclick") {
      console.log(this)
    } else {
      this[name] = value;
    }
  }

  render() {
    let children = this.data.map(url => {
      let element = <img src={url}/>;
      element.addEventListener("dragstart", event => event.preventDefault())
      return element;
    })
    this.position = 0;
    let root = (
      <div>
        <div class="carousel">
          { children }
        </div>
      </div>
    );
    
    this.loopId = null
    this.loopTl = this.loop(children)
    this.dragTl = this.drag(root, children)
    return root;
  }
  limit(value) {
    let left = document.querySelector(".carousel").getBoundingClientRect().left - 500;
    let right = document.querySelector(".carousel").getBoundingClientRect().right + 500;
    if (value < left) {
      return left;
    } else if (value > right) {
      return right;
    }
    console.log(value, right)
    console.log(value, left)
    return value;
  }
  loop(children,) {
    let nextStart, nextEnd;
    let currentStart, currentEnd;
    let tl = new Timeline();
    tl.start();
    let nextPic = () => {
      let { position } = this;
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];

      // console.log(`loop: ${position}`)
      currentStart = -500 * position;
      nextStart = 500 -500 * nextPosition
      
      currentEnd = -500 -500 * position;
      nextEnd = -500 * nextPosition;
      tl.add(new Animation(current.style, "transform", currentStart, currentEnd, 1000, 0, linear, v => `translateX(${v}px)`));
      tl.add(new Animation(next.style, "transform", nextStart, nextEnd, 1000, 0, linear, v => `translateX(${v}px)`));
    
      this.position = nextPosition;
    }
    this.nextPic = nextPic;
    this.loopId = setInterval(() => {
      nextPic();
    }, 2000);
    return tl;
  }
  pasueLoop() {
    clearInterval(this.loopId);
    this.loopTl.pause();
  }
  resumeLoop() {
    this.loopId = setInterval(() => {
      this.nextPic();
    }, 2000)
    this.loopTl.resume(); 

  }
  drag(root, children) {
    let tl = new Timeline();
    tl.start();
    root.addEventListener("mousedown", event => {
      this.loopTl && this.pasueLoop();
      let { position } = this;
      let startX = event.clientX;
      let startY = event.clientY;
      console.log(`drag: ${position}`)
      let nextPosition = (position + 1) % this.data.length;
      let lastPosition = (position - 1 + this.data.length) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];
      let last = children[lastPosition];

      current.style.transform = `translateX(${ -500 * position})`
      last.style.transform = `translateX(${-500 -500 * lastPosition})`
      next.style.transform = `translateX(${500 -500 * nextPosition})`
      
      let currentStart, currentEnd;
      let lastStart, lastEnd;
      let nextStart, nextEnd;
      
      let move = event => {
        currentStart = event.clientX - startX - 500 * position;
        lastStart = event.clientX - startX - 500 - 500 * lastPosition;
        nextStart = event.clientX - startX + 500 - 500 * nextPosition;

        current.style.transform = `translateX(${currentStart}px)`
        last.style.transform = `translateX(${lastStart}px)`
        next.style.transform = `translateX(${nextStart}px)`

        console.log(currentStart);
        console.log(lastStart);
        console.log(nextStart);
        // console.log(event.clientX - startX, event.clientY - startY)
      };
      let up = event => {
        let offset = 0;
        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < -250){
          offset = -1;
        }
        
        currentEnd = offset * 500 - 500 * position
        lastEnd = offset * 500 - 500 - 500 * lastPosition
        nextEnd = offset * 500  + 500 - 500 * nextPosition

        this.position = (position - offset + this.data.length) % this.data.length;
        tl.add(new Animation(current.style, "transform", currentStart, currentEnd, 200, 0, linear, v => `translateX(${v}px)`));
        tl.add(new Animation(last.style, "transform", lastStart, lastEnd, 200, 0, linear, v => `translateX(${v}px)`));
        tl.add(new Animation(next.style, "transform", nextStart, nextEnd, 200, 0, linear, v => `translateX(${v}px)`));
        setTimeout(() => {
          this.loopTl && this.resumeLoop();
        }, 200);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      
      document.addEventListener("mousemove", move)

      document.addEventListener("mouseup", up)

    })

    return tl;
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
  {/* <div>{ new Wrapper("span") }</div> */}
</Carousel>

console.log(component)
component.mountTo(document.body)
