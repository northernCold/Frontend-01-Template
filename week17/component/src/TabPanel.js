import { createElement, Text, Wrapper } from "../lib/createElement";
import { Timeline, Animation } from "../lib/animation";
import { ease, linear } from "../lib/cubicBezier";
import { enableGesture } from "../lib/gesture";

export class TabPanel {
  constructor() {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  render() {
    setTimeout(() => this.select(0));
    this.childViews = this.children.map(child => <div style="width: 300px; min-height: 300px">{child}</div>)
    this.titleView = this.children.map((child, i) => <span style="background-color: lightgreen; padding: 5px;font-size: 20px;" onClick={this.select.bind(this, i)}>{child.getAttribute("title")}</span>)
    return <div class="tab-panel" style="border: 1px solid lightgreen; width: 300px;">
      <h1 style="display: flex; width: 300px; margin: 0;">{this.titleView}</h1>
      <div>
        {this.childViews}
      </div>
    </div>;
  }
  select(i) {
    for (let view of this.childViews) {
      view.style.display = "none";
    }
    this.childViews[i].style.display = "";
    for (let view of this.titleView) {
      view.classList.remove("selected");
    }
    this.titleView[i].classList.add("selected");
    // this.titleView.innerText = this.children[i].title;
  }
  mountTo(parent) { 
    this.render().mountTo(parent);
  }
  appendChild(child) {
    this.children.push(child)
  }
}