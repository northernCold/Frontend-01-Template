
// animation 改为set

export class Timeline {
  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.requsetId = null;
    this.state = "inited";
    this.addTimes = new Map();
    this.tick = () => {
      let t = Date.now() - this.startTime;
      for (let animation of this.animations) {
        let {object, property, template, start, end, timingFunction, delay, duration} = animation;
        let addTime = this.addTimes.get(animation);
        if (t < delay + addTime) continue; // delay progress 負數
        let progression = timingFunction((t - delay - addTime)/duration);
        if (t > duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation)
        }
        // console.log(start, end, progression);
        let value = animation.valueFromProgression(progression);
        // console.log(start, end, progression)
        object[property] = template(value);
      }
      if (this.animations.size) {
        this.requsetId = requestAnimationFrame(() => this.tick())
      } else {
        this.requsetId = null;
      }
    }
  }

  start() {
    // debugger

    if (this.state !== "inited") {
      return;
    }
    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }
  
  pause() {
    if (this.state !== "playing") {
      return;
    }
    this.state = "pause";
    this.pauseTime = Date.now();
    if (this.requsetId !== null) {
      cancelAnimationFrame(this.requsetId)
      this.requsetId = null;
    }
  }

  resume() {
    if (this.state !== "pause") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  reset() {
    if (this.state === "plaiying") {
      this.pause();
    }
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requsetId = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.start();
  }

  restart() {
    if (this.state === "plaiying") {
      this.pause();
    }
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation);
    }
    this.finishedAnimations = new Set();
    this.requsetId = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.start();
  }

  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state === "playing" && this.requsetId === null) {
      this.tick();
    }
    if (this.state === "playing") {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0)
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || ((start, end) => {
      return (t) => {
        return start + (t / duration) * (end - start)
      };
    })
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}
  
export class ColorAnimation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || ((start, end) => {
      return (t) => {
        return start + (t / duration) * (end - start)
      };
    })
  }
  valueFromProgression(progression) {
    // return this.start + progression * (this.end - this.start);
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a)
    }
  }
}

/*

let animation = new Animation(object, property, start, end, duration, delay, timingFunction);

let timeline = new Timeline;

timeline.add(animation);
timeline.add(animation2);

timeline.start();

timeline.resume();
timeline.pause();

timeline.stop();

*/