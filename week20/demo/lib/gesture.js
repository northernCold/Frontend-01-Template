export function enableGesture(element) {
  let contexts = new Map();
  let MOUSE_SYMBOL = Symbol("mouse")

  if (!document.ontouchstart !== null) {
    element.addEventListener("mousedown", event => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      let mousemove = event => {
        move(event, contexts[MOUSE_SYMBOL]);
      }
    
      let mouseup = event => {
        end(event, contexts[MOUSE_SYMBOL]);
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      }
    
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    })
  } else {
    element.addEventListener("touchstart", event => {
      for(let touch of event.changedTouches) {
        contexts[touch.identifier] = Object.create(null);
        start(touch, contexts[touch.identifier]);
      }
    })
    
    element.addEventListener("touchmove", event => {
      for(let touch of event.changedTouches) {
        contexts[touch.identifier] = Object.create(null);
        move(touch, contexts[touch.identifier]);
      }
    })
    
    element.addEventListener("touchend", event => {
      for(let touch of event.changedTouches) {
        end(touch, contexts[touch.identifier]);
        delete contexts[touch.identifier];
      }
    })
    
    element.addEventListener("touchcancel", event => {
      for(let touch of event.changedTouches) {
        cancel(touch, contexts[touch.identifier]);
        delete contexts[touch.identifier];
      }
    })
  }

  /**
   * tap
   * pan - panstart panmove panend
   * flick
   * press pressstart pressend
   */



  let start = (point, context) => {
    element.dispatchEvent(new CustomEvent("start", {
      startX: point.startX,
      startY: point.startY,
      clientX: point.clientX,
      clientY: point.clientY
    }))
    context.startX = point.clientX, context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeoutHanlder = setTimeout(() => {
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new CustomEvent("pressstart", {}))
      ////console.log("pressstart");
    }, 500)
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        ////console.log("presscancel")
      element.dispatchEvent(new CustomEvent("presscancel", {}))
    }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      ////console.log("panstart");
      let e = new CustomEvent("panstart")
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      })
      element.dispatchEvent(e)
    }

    if (context.isPan) {
      context.moves.push({
        dx, dy,
        t: Date.now()
      })
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);;
      //console.log("pan")
      let e = new CustomEvent("pan")
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      })
      element.dispatchEvent(e)
    }
    // //console.log(dx, dy)
  }

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
      let record = context.moves[0]
      let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
      //console.log(speed)
      let isFlick = speed > 2.5;
      if (isFlick) {
        //console.log("flick")
        let e = new CustomEvent("panend")
        Object.assign(e, {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed
        })
        element.dispatchEvent(e)
      }
      //console.log("panend")
      let e = new CustomEvent("panend")
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed,
        isFlick
      })
      element.dispatchEvent(e)
    } 
    if (context.isTap) {
      element.dispatchEvent(new CustomEvent("tap", {}))
      //console.log("tap")
    }
    if (context.isPress) {
      //console.log("pressend")
      element.dispatchEvent(new CustomEvent("pressend", {}))
    }
    clearTimeout(context.timeoutHanlder);
  }

  let cancel = (point, context) => {
    //console.log("canceled")
    element.dispatchEvent(new CustomEvent("canceled", {}))
    clearTimeout(context.timeoutHanlder);
  }
}
