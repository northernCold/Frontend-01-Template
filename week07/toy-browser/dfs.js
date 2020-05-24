function dfs(element) {
  let currentElement = null;
  let queue = [];
  queue.push(element)
  let html = "<!--placeholder-->";
  while(queue.length !== 0) {
    currentElement = queue.pop();
    if (currentElement.type === "element") {
      let attrs = currentElement.attributes.reduce((t, c) => {
        if (c.name === "isSelfClosing") {
          return t;
        } else {
          return t + ` ${c.name}="${c.value}"`
        }
      }, "")
      let isSelfClosing = currentElement.attributes.find(attr => attr.name === "isSelfClosing");
      if (isSelfClosing && isSelfClosing.value) {
        if (currentElement.children && currentElement.children.length !== 0) {
          html = html.replace(
            /<!--placeholder-->/,
            `<${currentElement.tagName}${attrs}/><!--placeholder-->`
          )
        } else {
          html = html.replace(
            /<!--placeholder-->/,
            `<${currentElement.tagName}${attrs}/>`
          )
        }
      } else {
        if (currentElement.children && currentElement.children.length !== 0) {
          html = html.replace(
            /<!--placeholder-->/,
            `<${currentElement.tagName}${attrs}><!--placeholder--></${currentElement.tagName}>`
          );
        } else {
          html = html.replace(
            /<!--placeholder-->/,
            `<${currentElement.tagName}${attrs}></${currentElement.tagName}>`
          );
        }
      }
    } else if (currentElement.type === "text") {
      if (currentElement.children && currentElement.children.length !== 0) {
        html = html.replace(
          /<!--placeholder-->/,
          `${currentElement.content}<!--placeholder-->`
        )
      } else {
        html = html.replace(
          /<!--placeholder-->/,
          `${currentElement.content}`
        )
      }
    }
    if (currentElement.children && currentElement.children.length !== 0) {
      html = html.replace(
        /<!--placeholder-->/,
        "<!--placeholder-->".repeat(currentElement.children.length)
      )
      queue.push(...currentElement.children.reverse());
    }
  }
  return html;
}

module.exports = dfs;