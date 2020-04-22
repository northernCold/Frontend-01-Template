
// 利用encodeURIComponent 转义除了以下字符外的所有字符：A-Z a-z 0-9 - _ . ! ~ * ' ( )
// 这些保留字符，都是在ASCII码的范围内，可以使用charCodeAt获取
function utf8_encodeA(str) {
  const t = encodeURIComponent(str);
  const ret = [];
  for (let i = 0; i < t.length; i++) {
    if (t.charAt(i) === '%') {
      ret.push(parseInt(t.substring(i + 1, i + 3), 16));
      i += 2;
    } else {
      ret.push(t.charCodeAt(i))
    }
  }
  return new Uint8Array(ret)
}

console.log(decodeURIComponent(utf8_encodeA("😁🤩")))

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

// 在处理3个字符及以下的情况，因为范围是在0x0000-0xFFFF比较简单, 按照正常的utf-8 encoding
// 在处理4个字符的情况的话，使用charCodeAt，在0x10000及以上的字符，会得到两个码元，需要先将其转化为Unicode相应的码点，然后在进行utf-8 encoding
function utf8_encodeB(str) {
  const ret = []
  let code, nextCode, realCode
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (code >= 0x0000 && code <= 0x007F) {
      // 处理一个字节
      ret.push(code)
    } else if (code >= 0x0080 && code <= 0x07FF) {
      // 处理两个个字节
      ret.push(192 | (code >> 6))
      ret.push(128 | (code & 63))
    } else if (
      (code >= 0x0800 && code <= 0xD7FF) ||
      (code >= 0xE000 && code <= 0xFFFF)
      ) {
      // UTF-8标准中：指明禁止编码U+D800到U+DFFF之间的Unicode，用来作为UTF-16的代理对编码
      // 处理三个个字节
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
          // UTF-16 标准中 decodeing UTF-16 有说明
          // throw new Error("error sequence")
          return null;
        }
      } else {
        // UTF-16 标准中 decodeing UTF-16 有说明
        // throw new Error("error sequence")
        return null;
      }
    }
  }
  return ret.join(",")
}

console.log(utf8_encodeB("😁🤩"));
// de01
console.log(utf8_encodeB('\uD800'))
module.exports = {
  encodeA: utf8_encodeA,
  encodeB: utf8_encodeB
};

