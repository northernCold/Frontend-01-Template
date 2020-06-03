const images = require("images");

function render(viewport, element) {
  if (element.style) {
    let img = images(element.style.width, element.style.height);
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0,0,0)";
      const match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(Number(match[1]), Number(match[2]), Number(match[3]), 1);
      console.log(element.style.width, element.style.height)
      console.log(element.style.left || 0, element.style.top||0);
      console.log('--')
      viewport.draw(img, element.style.left || 0, element.style.top||0);
    }
  }

  if (element.children) {
    for(let child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;