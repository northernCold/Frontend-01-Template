/**
 * @description 将字符串以x进制(2-36)解析，,主要模仿parseInt的行为
 * 1.当第二个参数省略或者为0时，。
 *  1.1都以数字组成 以十进制解析
 *   1.1.1 整数
 *   1.1.2 小数
 *   1.1.3 幂 e/E
 *  2.1 “0b” 或 “0B” 开头二进制
 *  3.1 “0o” 或 “0o” 开头八进制
 *  4.1 “0x” 或 “0X” 开头，将以 16 为基数 16进制
 * 2.当第二个参数2-36范围内，正常解析
 *  2.1 整数
 *  2.2 小数
 * 3.其他情况为NAN
 * @param {*} string 
 * @param {*} x 
 */

function convertStringToNumber(string, x) {
  if (x < 0 && x > 36) return NaN;

  if (x === 0 || x === undefined) {
    return parseDecimal(string)
  }
  const chars = string.toLowerCase().split('');
  let integer = 0;
  let fraction = 1;
  let i = 0, val = 0;
  while (i < chars.length && chars[i] !== ".") {
    if (/\d/.test(chars[i])) {
      val = chars[i].codePointAt(0) - "0".codePointAt(0);
    } else if (/[a-z]/.test(chars[i])) {
      val = chars[i].codePointAt(0) - "a".codePointAt(0) + 10;
    } else {
      return i === 0 ? NaN : integer;
    }
    if (val >= x) {
      return i === 0 ? NaN : integer;
    }
    integer = integer * x;
    integer += val;
    i++;
  }
  if (i < chars.length && chars[i++] !== ".") return integer;
  while(i < chars.length) {
    if (/\d/.test(chars[i])) {
      val = chars[i].codePointAt(0) - "0".codePointAt(0);
    } else if (/[a-z]/.test(chars[i])) {
      val = chars[i].codePointAt(0) - "a".codePointAt(0) + 10;
    } else {
      return i === 0 ? NaN : integer;
    }
    if (val >= x) {
      return i === 0 ? NaN : integer;
    }
    fraction = fraction / x;
    integer += fraction*val;
    i++;
  }
  return integer;
}

// 使用状态机实现 
function parseDecimal(string) {
  let token = 0;
  let exponent = 0;
  let place = 0;
  string += "#"; // #表示结束标识符

  const state = (char) => {
    if (/[1-9.]/.test(char)) {
      if (char === '.') {
        return inFraction;
      }
      token = char.codePointAt('') - "0".codePointAt('');
      return inNumber;
    } else if (/0/.test(char)) {
      return inOther;
    } else {
      return null;
    }
  }

  const inNumber = (char) => {
    if (/[0-9]/.test(char)) {
      token = token * 10 + char.codePointAt('') - "0".codePointAt('');
      return inNumber;
    } else if (/[.]/.test(char)) {
      return inFraction;
    } else if (/[e]/i.test(char)) {
      return inExponent;
    } else {
      emit();
      return null;
    }
  }

  const inExponent = char => {
    if (/[0-9]/.test(char)) {
      exponent = exponent * 10 + char.codePointAt('') - "0".codePointAt('');
      return inExponent;
    } else {
      if (exponent !== 0) {
        token = token * 10 ** exponent;
        emit();
      }
    }
  }

  const inFraction = (char) => {
    if (/[0-9]/.test(char)) {
      place++;
      token +=  (char.codePointAt(0) - "0".codePointAt(0))/(10**place);
      return inFraction;
    } else if (/[e]/i.test(char)) {
      return inExponent;
    } else {
      emit();
      return null;
    }
  }

  const inOther = (char) => {
    if (/[b]/i.test(char)) {
      return inBinary;
    } else if (/[o]/i.test(char)) {
      return inOctal;
    } else if (/[x]/i.test(char)) {
      return inHex;
    } else if (/[0-9.]/.test(char)) { 
      return inNumber;
    } else {
      return null;
    }
  }

  const inBinary = (char) => {
    if (/[01]/.test(char)) {
      token = token * 2 + char.codePointAt(0) - '0'.codePointAt(0);
      return inBinary;
    } else {
      emit()
      return null;
    }
  }

  const inOctal = (char) => {
    if (/[0-7]/.test(char)) {
      token = token * 8 + char.codePointAt(0) - '0'.codePointAt(0);
      return inOctal;
    } else {
      emit()
      return null;
    }
  }

  const inHex = (char) => {
    if (/[0-9a-f]/i.test(char)) {
      if (/\d/.test(char)) {
        token = token * 16 + char.codePointAt(0) - "0".codePointAt(0);
      } else if (/[a-z]/.test(char)) {
        token = token * 16 + char.codePointAt(0) - "a".codePointAt(0) + 10;
      }
      return inHex;
    } else {
      emit()
      return null;
    }
  }

  const emit = () => {
    if (exponent > place) {
      result = token
    } else {
      result = token.toFixed(place - exponent) // 防止 11.12e1 = 111.199999999999
    }
  }

  var call = state
  for (i of string) {
    if (!call) break;
    call = call(i)
  }

  return result;
}


console.log(convertStringToNumber("11.12e1")) // 111.2 
console.log(convertStringToNumber("11.12e1", 10)) // 11.12
console.log(convertStringToNumber("0o16")) // 14
console.log(convertStringToNumber("0b11111111")) // 255
console.log(convertStringToNumber("0xff")) // 
console.log(convertStringToNumber(".12")) // 0.12
console.log(convertStringToNumber("1213123", 36) === parseInt("1213123", 36))