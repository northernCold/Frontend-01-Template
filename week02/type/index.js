const resolveLeaddingZero = str => {
  if (/^0[^box.]\d*/i.test(str)) return null;
  return str;
}

const reg = /^((0|[1-9]\d*)?(?:\.\d*)?(?:e[\+\-]\d*)?|0b[01]+|0o[0-7]+|0x[0-9a-f]+)$/i;

const match = str => resolveLeaddingZero(str) && resolveLeaddingZero(str).match(reg)

console.log(match("0b123"))