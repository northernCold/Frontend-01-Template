// https://segmentfault.com/a/1190000005794963
// http://www.huangwenchao.com.cn/2015/09/javascript-utf8-encoding.html
// https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330

// JavaScript是什么编码的 https://mathiasbynens.be/notes/javascript-encoding
function utf8_encode(str) {
  const t = encodeURIComponent(str);
  const ret = [];
  for (let i = 0; i < t.length; i++) {
    if (t.charAt(i) === '%') {
      // ret.push(t.substring(i + 1, i + 3));
      ret.push(parseInt(t.substring(i + 1, i + 3), 16));
      i += 2;
    } else {
      ret.push(t.charCodeAt(i))
      // ret.push(t.charCodeAt(i).toString(16))
    }
  }
  // return (ret)
  return new Uint8Array(ret)
}

// console.log(decodeURIComponent(utf8_encode("中")))

// "严".charCodeAt(0).toString(16)
// "4e25"
// "严".charCodeAt(0).toString(2)
// "100 111000 100101"
// 0x4e25 >> 12
// "100"
// 15 & 4
// 4
// 224..toString(2)
// "11100000"

// | 是用来去掉多个位
// & 是用来补位的


function utf8_encodeB(str) {
  const ret = []
  let code, nextCode, realCode
  for (let i = 0; i < str.length; i++) {
     code = str.charCodeAt(i);
    if (code >= 0x0000 && code <= 0x007F) {
      ret.push(code)
    } else if (code >= 0x0080 && code <= 0x07FF) {
      ret.push(192 | (code >> 6))
      ret.push(128 | (code & 63))
    } else if (
      (code >= 0x0800 && code <= 0xD7FF) ||
      (code >= 0xE000 && code <= 0xFFFF)
    ) {
      ret.push(224 | (code >> 12))
      ret.push(128 | (63 & (code >> 6)))
      ret.push(128 | (63 & (code)))
    } else {
      //处理UTF-16的4个字节的编码
      i++
      if (code >= 0xD800 && code <= 0xDBFF && i < str.length) {
        nextCode = str.charCodeAt(i);
        if(nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          realCode = ((code & 0x03FF) << 10) + (nextCode & 0x03FF) + 0x10000;
          ret.push(240 | realCode >> 18)
          ret.push(128 | (63 & (realCode >> 12)))
          ret.push(128 | (63 & (realCode >> 6)))
          ret.push(128 | (63 & (realCode)))
        } else {
          throw new Error("illegal input")
        }
      } else {
        throw new Error("illegal input")
      }
    }
  }
  return ret.map(v => v.toString(16)).join("")
}

console.log(utf8_encodeB("😁🤩"));
// de01