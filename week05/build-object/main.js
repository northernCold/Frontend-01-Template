import G6 from "@antv/g6";

const buildObject = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect"
];

const map = new Map();
const queue = [];
let current, p, obj;

buildObject.forEach(v => {
  obj = {
    path: v,
    object: window[v]
  }
  map.set(v, obj);
  queue.push(obj)
});

while(queue.length !== 0) {
  current = queue.shift();
  if (map.has(queue.object)) {
    continue;
  }
  // console.log(current)
  for(let name of Object.getOwnPropertyNames(current.object)) {
    p = Object.getOwnPropertyDescriptor(current.object, name);
    if (
      p.hasOwnProperty("value") &&
      (typeof p.value === "object" || typeof p.value === "function")) {
        if (!map.has(p.value)) {
          obj = {
            path: `${current.path}.${name}`,
            object: p.value
          }
          map.set(p.value, obj);
          queue.push(obj)
        }
    }
    if (p.get) {
      if (!map.has(p.get)) {
        obj = {
          path: `${current.path}.get ${name}`,
          object: p.get
        }
        map.set(p.get, obj);
        queue.push(obj)
      }
    }
    if (p.set) {
      if (!map.has(p.set)) {
        obj = {
          path: `${current.path}.set ${name}`,
          object: p.set
        }
        map.set(p.set, obj);
        queue.push(obj)
      }
    }
  }
}

const data = { id: "0", label: "global"};
let id = 1;
[...map].map((v) => v[1].path.split(".")).forEach(v => {
  v.reduce((t,c, idx, src) => {
    if (!t.children) {
      t.children = []
    }
    t = t.children;
    let index = t.findIndex(v => v.label === c)
    if (index === -1) {
      index = t.push({ id: id.toString(),label: c }) - 1;
      idx !== src.length - 1 ? t[index].children = [] : void 0;
      id++;
    };
    return t[index];
  }, data)
})

console.log(map.size)
console.log(data)

const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 2000;
const graph = new G6.TreeGraph({
  container: 'container',
  width,
  height,
  modes: {
    default: [
      {
        type: 'collapse-expand',
        onChange: function onChange(item, collapsed) {
          const data = item.getModel();
          data.collapsed = collapsed;
          return true;
        },
      },
      'drag-canvas',
      'zoom-canvas',
    ],
  },
  defaultNode: {
    size: 26,
    anchorPoints: [
      [0, 0.5],
      [1, 0.5],
    ],
    style: {
      fill: '#C6E5FF',
      stroke: '#5B8FF9',
    },
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: {
      stroke: '#A3B1BF',
    },
  },
  layout: {
    type: 'mindmap',
    direction: 'H',
    getHeight: () => {
      return 16;
    },
    getWidth: () => {
      return 16;
    },
    getVGap: () => {
      return 10;
    },
    getHGap: () => {
      return 50;
    },
  },
});

let centerX = 0;
graph.node(function(node) {
  if (node.id === 'Modeling Methods') {
    centerX = node.x;
  }

  return {
    label: node.label,
    id: node.id,
    labelCfg: {
      position:
        node.children && node.children.length > 0
          ? 'left'
          : node.x > centerX
          ? 'right'
          : 'left',
      offset: 5,
    },
  };
});
// graph.edge((edge,a,b) => {
//   console.log(edge)
//   const sourceLabel = edge.source.defaultCfg.model.label;
//   const targetLabel = edge.target.defaultCfg.model.label;
//   console.log(sourceLabel, targetLabel) 
//   return {
//     id: edge.id,
//     label: `${sourceLabel}.${targetLabel}`,
//     type: 'cubic-horizontal',
//     style: {
//       stroke: 'green',
//     },
//   };
// });
graph.data(data);
graph.render();
graph.fitView();