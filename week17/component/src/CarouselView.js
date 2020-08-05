import { createElement, Text, Wrapper } from "../lib/createElement";
import { Timeline, Animation } from "../lib/animation";
import { ease, linear } from "../lib/cubicBezier";
import { enableGesture } from "../lib/gesture";
import css from "./carousel.css";

export class CarouselView {
  constructor() {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  render() {
    let timeline = new Timeline;
    timeline.start();

    let position = 0;
    
    let nextPicStopHanlder = null;  

    
    let children = this.children.map((child, currentPosition) => {
      let nextPosition = (currentPosition + 1) % this.children.length;
      let lastPosition = (currentPosition - 1 + this.children.length) % this.children.length;
      
      let offset = 0;
      let onStart = event => {
        timeline.pause();
        clearTimeout(nextPicStopHanlder);
        let currentElement = children[currentPosition];
        
        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
        offset = currentTransformValue + 500 * currentPosition;
      }
      
      let onPan = event => {
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];
        let dx = event.clientX - event.startX;
        let currentTransformValue = - 500 * currentPosition + offset + dx;
        let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
        let nextTransformValue = 500 - 500 * nextPosition + offset + dx;
        // debugger

        currentElement.style.transform = `translateX(${currentTransformValue}px)`
        lastElement.style.transform = `translateX(${lastTransformValue}px)`
        nextElement.style.transform = `translateX(${nextTransformValue}px)`
        console.log(currentTransformValue)
      }
      
      let onPanend = event => {
        let direction = 0;
        let dx = event.clientX - event.startX;

        if (dx + offset > 250) {
          direction = 1;
        } else if (dx - offset < -250){ 
          direction = -1;
        }
        timeline.reset();
        timeline.start();

        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let currentAnimation = new Animation(currentElement.style, "transform", - 500 * currentPosition + offset + dx,
          - 500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        let lastAnimation = new Animation(lastElement.style, "transform", -500 - 500 * lastPosition + offset + dx,
          -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        let nextAnimation = new Animation(nextElement.style, "transform", 500 - 500 * nextPosition + offset + dx,
          500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        timeline.add(currentAnimation)
        timeline.add(lastAnimation)
        timeline.add(nextAnimation)

        position = (position - direction + this.children.length) % this.children.length;
        nextPicStopHanlder = setTimeout(nextPic, 2000);
      }
      let element = <div onStart={onStart} onPan={onPan} enableGesture={true} onPanend={onPanend}>{child}</div>;
      element.style.transform = "translateX(0px)";
      element.addEventListener("dragstart", event => event.preventDefault())
      return element;
    })
    let root = (
      <div class="carousel">
        { children }
      </div>
    );

    let nextPic = () => {
      let nextPosition = (position + 1) % this.children.length;
      let current = children[position];
      let next = children[nextPosition];
      
      let currentAnimation = new Animation(current.style, "transform", - 100 * position, -100 - 100 * position, 500, 0, ease, v => `translateX(${5 * v}px)`);
      let nextAnimation = new Animation(next.style, "transform", 100 - 100 * nextPosition, -100 * nextPosition, 500, 0, ease, v => `translateX(${5 * v}px)`);

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      position = nextPosition;
      nextPicStopHanlder = setTimeout(nextPic, 2000);
    }
    nextPicStopHanlder = setTimeout(nextPic, 2000);
    
    
    // root.addEventListener("mousedown", event => {
    //   let startX = event.clientX;
    //   let startY = event.clientY;
    //   let nextPosition = (position + 1) % this.data.length;
    //   let lastPosition = (position - 1 + this.data.length) % this.data.length;
    //   let current = children[position];
    //   let next = children[nextPosition];
    //   let last = children[lastPosition];
    //   current.style.transition = "ease 0s";
    //   next.style.transition = "ease 0s";
    //   last.style.transition = "ease 0s";
      
    //   current.style.transform = `translateX(${ -500 * position})`
    //   last.style.transform = `translateX(${-500 -500 * lastPosition})`
    //   next.style.transform = `translateX(${500 -500 * nextPosition})`
    //   let move = event => {
      
    //     current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`
    //     last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`
    //     next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`
    //     // console.log(event.clientX - startX, event.clientY - startY)
    //   };
    //   let up = event => {
    //     let offset = 0;
    //     if (event.clientX - startX > 250) {
    //       offset = 1;
    //     } else if (event.clientX - startX < -250){
    //       offset = -1;
    //     }
    //     position = (position - offset + this.data.length) % this.data.length;
    //     current.style.transition = "";
    //     next.style.transition = "";
    //     last.style.transition = "";
    //     current.style.transform = `translateX(${offset * 500 - 500 * position}px)`
    //     last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`
    //     next.style.transform = `translateX(${offset * 500  + 500 - 500 * nextPosition}px)`
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   };
      
    //   document.addEventListener("mousemove", move)
    //   document.addEventListener("mouseup", up)
    // })
    return root;
  }
  
  mountTo(parent) {
    this.render().mountTo(parent);
  }
  appendChild(child) {
    this.children.push(child)
  }
}