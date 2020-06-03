// display: flex; // 自动填满一行
// displey:inline-flex; // 宽度由子元素撑开

/**
 * 1.定义
 * 2.收集元素进行
 * 3.计算主轴
 * 4.计算交叉轴
 */

function isUnDef(identify) {
  return identify !== null || identify !== (void 0);
}

/**
 * @description: 将元素的getComputedStyle里的属性赋值到元素的style属性
 * @param {type} 
 * @return: 
 */
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (
      element.style[prop].toString().match(/px$/) ||
      element.style[prop].toString().match(/^[0-9\.]+$/)  
    ) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

// layout实现只flex布局
function layout(element) {
  if (!element.computedStyle) return;
  const elementStyle = getStyle(element);

  if (elementStyle.display !== 'inline-flex') return; // 只处理有flex
  const items = element.children.filter(e => e.type === 'element');

  // 实现flex的order属性效果
  items.sort((a, b) => (a.style.order || 0) - (b.style.order || 0));


  const style = elementStyle;
  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '' || style[size] === undefined) {
      style[size] = null;
    }
  })

  // 设置 flex-direction, align-items, justify-content, flex-wrap, align-content 默认值
  if (!style['flex-direction'] || style['flex-direction'] === 'auto') {
    style['flex-direction'] = 'row';
  }
  if (!style['align-items'] || style['align-items'] === 'auto') {
    style['align-items'] = 'stretch';
  }
  if (!style['justify-content'] || style['justify-content'] === 'auto') {
    style['justify-content'] = 'flex-start';
  }
  if (!style['flex-wrap'] || !style['flex-wrap'] === 'auto') {
    style['flex-wrap'] = 'nowrap';
  }
  if (!style['align-content'] || !style['align-content'] === 'auto') {
    style['align-content'] = 'stretch';
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style['flex-direction'] === 'row') {
      mainSize = 'width';
      mainStart = 'left';
      mainEnd = 'right';
      mainSign = +1;
      mainBase = 0;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
    }

    if (style['flex-direction'] === 'row-reverse') {
      mainSize = 'width';
      mainStart = 'rigth';
      mainEnd = 'left';
      mainSign = -1;
      mainBase = style.width;

      crossSize = 'height';
      crossStart = 'top';
      crossEnd = 'bottom';
    }

    if (style['flex-direction'] === 'column') {
      mainSize = 'height';
      mainStart = 'top';
      mainEnd = 'bottom';
      mainSign = +1;
      mainBase = 0;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right'
    }

    if (style['flex-direction'] === 'column-reverse') {
      mainSize = 'height';
      mainStart = 'bottom';
      mainEnd = 'top';
      mainSign = -1;
      mainBase = style.height;

      crossSize = 'width';
      crossStart = 'left';
      crossEnd = 'right'
    }

    if (style['flex-wrap'] === 'wrap-reverse') {
      let tmp = crossStart;
      crossStart = crossEnd;
      crossEnd = tmp;
      crssSign = -1;
    } else {
      crossBase = 0;
      crossSign = 1;
    }

    // 如果没有设置容器的主轴的宽度，那么其宽度由其子元素撑开

    // need validate: 子元素的style已经生成
    let isAutoMainSize = false;
    if (!style[mainSize]) {
      style[mainSize] = items.reduce((total, item) => {
        return isUnDef(item.style[mainSize]) ?
          total += item.style[mainSize] :
          total;
      }, 0);
      isAutoMainSize = true;
    }

    // 收集元素进行
    let flexLine = []; // 当前行
    let flexLines = [flexLine]; // 全部行
    let mainSpace = style[mainSize]; // 容器主轴的剩余宽度
    let crossSpace = 0; // 容器交叉轴的

    /**
     * 如果子元素有flex属性直接进行
     * 没有的话
     *  判断容器的不允许换行且宽度是自适应，mainSpace减去子元素的宽度，再记录当前最大的交叉轴的元素，进行
     *    如果存在子元素的宽度超过容器的宽度，设置其宽度为容器宽度
     *    如果剩余的宽度，不过放子元素 换行
     * 
     */
    items.forEach(item => {
      if (!isUnDef(item.style[mainSize])) {
        item.style[mainSize] = 0;
      }

      if (item.style.flex) {
        flexLine.push(item);
        if (isUnDef(item.style[crossSize])) {
          crossSpace = Math.max(crossSpace, item.style[crossSize])
        }
      } else if (style['flex-wrap'] === 'nowrap' && isAutoMainSize) {
        mainSpace -= item.style[mainSize];
        if (isUnDef(item.style[crossSize])) {
          crossSpace = Math.max(crossSpace, item.style[crossSize])
        }
        flexLine.push(item);
      } else {
        if (item.style[mainSize] > style[mainSize]) {
          item.style[mainSize] = style[mainSize];
        }
        if (mainSpace < item.style[mainSize]) {
          flexLine.mainSpace = mainSpace;
          flexLine.crossSpace = crossSpace;

          flexLine = [];
          flexLines.push(flexLine);

          flexLine.push(item);
          mainSpace = style[mainSize];
          crossSpace = 0;
        } else {
          flexLine.push(item);
        }
        if (isUnDef(item.style[crossSize])) {
          crossSpace = Math.max(crossSpace, item.style[crossSize]);
        }
        mainSpace -= item.style[mainSize];
      }
    })

    flexLine.mainSpace = mainSpace;
    if (style['flex-wrap'] === 'nowrap' || isAutoMainSize) {
      flexLine.crossSpace = (isUnDef(style[crossSize])) ? crossSpace : style[crossSize];
    } else {
      flexLine.crossSpace = crossSpace;
    }

    // 溢出 (只会发生在一行的情况下) 缩放每个子元素
    if (mainSpace < 0) {
      let scale = style[mainSize] / (style[mainSize] - mainSpace);
      let currentMain = mainBase;
      items.forEach(item => {
        if (item.style.flex) {
          item.style[mainSize] = 0;
        }

        item.style[mainSize] = item.style[mainSize] * scale;

        item.style[mainStart] = currentMain;
        item.style[mainEnd] = item.style[mainStart] + mainSign * item.style[mainSize];
        currentMain = item.style[mainEnd];
      })
    } else {
      flexLines.forEach(flexLine => {
        let mainSpace = flexLine.mainSpace;
        let flexTotal = 0;
        flexLine.forEach(item => {
          if (isUnDef(item.style.flex)) {
            flexTotal += item.style.flex; // ？？这里的flex值的好像就是一个数字
          }
        })

        if (flexTotal > 0) {
          let currentMain = mainBase;
          items.forEach(item => {
            if (item.style.flex) {
              item.style[mainSize] = (mainSpace / flexTotal) * item.style.flex;
            }
            item.style[mainStart] = currentMain;
            item.style[mainEnd] = item.style[mainStart] + mainSign * item.style[mainSize];
            currentMain = item.style[mainEnd];
          })
        } else {
          let step, currentMain; // step 步长（元素之间的间隔） 第一个子元素开始的地方
          if (style['justify-content'] === 'flex-start') {
            currentMain = mainBase;
            step = 0;
          } else if (style['justify-content'] === 'flex-end') {
            currentMain = mainSpace * mainSign + mainBase;
            step = 0;
          } else if (style['justify-content'] === 'center') {
            currentMain = mainSpace / 2 * mainSign + mainBase;
            step = 0;
          } else if (style['justify-content'] === 'space-between') {
            currentMain = mainBase;  
            step = mainSpace / (items.length - 1) * mainSign;
          } else if (style['justify-content'] === 'space-arround') {
            step = mainSpace / items.length * mainSign;
            currentMain = step / 2 + mainBase;
          }
          flexLine.forEach(item => {
            item.style[mainStart] = currentMain;
            item.style[mainEnd] = item.style[mainStart] + mainSign * item.style[mainSize];
            currentMain = item.style[mainEnd] + step;
          })
        }

        // 计算交叉轴
        if (!style[crossSize]) {
          // 如果交叉轴的长度没有设置，则为其子元素的长度。
          crossSpace = 0;
          style[crossSize] = flexLines
            .reduce((total, flexLine) => total += flexLine.crossSpace, 0)
        } else {
          // 计算交叉轴的剩余长度
          crossSpace = flexLines
            .reduce((total, flexLine) => total -= flexLine.crossSpace, style[crossSize])
        }

        if (style['flex-wrap'] === 'wrap-reverse') {
          crossBase = style[crossSize];
        } else {
          crossBase = 0;
        }

        let step;
        if (style['align-content'] === 'flex-start') {
          crossBase += 0;
          step = 0;
        } else if (style['align-content'] === 'flex-end') {
          crossBase += crossSign * crossSpace;
          step = 0;
        } else if (style['align-content'] === 'center') {
          crossBase += crossSign * crossSpace / 2;
          step = 0;
        } else if (style['align-content'] === 'space-between') {
          crossBase += 0;
          step = crossSpace / (flexLines.length - 1);
        } else if (style['align-content'] === 'space-around') {
          step = crossSpace / (flexLines.length);
          crossBase += crossSign * step / 2;
        } else if (style['align-content'] === 'stretch') {
          crossBase += 0;
          step = 0;
        }
        let lineCrossSize
        flexLines.forEach(flexLine => {
            lineCrossSize = style['align-content'] === 'stretch' ?
            flexLine.crossSpace + crossSpace / flexLine.length :
            flexLine.crossSpace;
          flexLine.forEach(item => {
            let align = item.style['align-self'] || style['align-items'];
            if (item.style[crossSize] === null) {
              item.style[crossSize] = (align === 'stretch') ?
              lineCrossSize : 0;
            } 
            if (align === 'flex-start') {
              item.style[crossStart] = crossBase;
              item.style[crossEnd] = item.style[crossStart] + crossSign * item.style[crossSize];
            } else if (align === 'flex-end') {
              item.style[crossEnd] = crossBase + crossSign * lineCrossSize;
              item.style[crossStart] = item.style[crossEnd] - crossSign * item.style[crossSize];
            } else if (align === 'center') {
              item.style[crossStart] = crossBase + crossSign * (lineCrossSize - item.style[crossSize]) / 2;
              item.style[crossEnd] = item.style[crossStart] + crossSign * item.style[crossSize];
            } else if (align === 'stretch') {
              item.style[crossStart] = crossBase;
              item.style[crossEnd] = crossBase + crossSign * (isUnDef(item.style[crossSize]) ? item.style[crossSize] : lineCrossSize);
              item.style[crossSize] = crossSign * (item.style[crossEnd] - item.style[crossStart]);
            }
          })
        })
        crossBase += crossSign * (lineCrossSize + step);
      })
    }
}

module.exports = layout;