export class Timeline {
  constructor() {
    this.animations = [];
    this.requsetId = null;
    this.state = "inited";
    this.tick = () => {
      // console.log("tick")
      let animations = this.animations.filter(animation => animation.finished !== true)
      // debugger
      let t = Date.now() - this.startTime;
      for (let animation of animations) {
        let {object, property, template, start, end, timingFunction, delay, duration, addTime} = animation;
        let progression = timingFunction((t - delay - addTime)/duration);
        if (t > duration + delay + addTime) {
          progression = 1;
          animation.finished = true;
        }
        // console.log(start, end, progression);
        let value = animation.valueFromProgression(progression);
        // console.log(start, end, progression)
        object[property] = template(value);
      }
      // if (animations.length > 0) {
        this.requsetId = requestAnimationFrame(() => this.tick())
      // }
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
    cancelAnimationFrame(this.requsetId)
  }

  resume() {
    if (this.state !== "pause") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  restart() {
    if (this.state === "plaiying") {
      this.pause();
    }
    this.animations = [];
    this.requsetId = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.start();
  }

  add(animation, addTime) {
    // debugger
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === "playing") {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
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