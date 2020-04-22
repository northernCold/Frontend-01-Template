// 输入只能包含数字 "." "e" "E" "o" "O" "x" "X" "b" "B"
// 其他返回null

// 严格模式下不允许0开头的数字，否则程序报错
// 在非严格模式下，以0开头的数字的情况(排除0x,0o,0b)
// 1. 后面的数字小于8，程序认为是8进制数
// 2. 后面的数字至少有一个数字大于等于8，则认为是10进制数返回忽略前面0的数

// 此方法模拟严格模式下的解析数字，
// 0开头的数字的情况下，且后面是数字(除了0b,0o,ox)，则应该忽略0，直到以非0开头的数字
// 像00x01,不认为这位八进制数，应该返回null
// 1. 00000 = null
// 2. 00123 = null
// 3. 000.12 = null
const resolveLeaddingZero = str => {
  if (/^0[^box.]\d*/i.test(str)) return null;
  return str;
}

const reg = /^((?:0|[1-9]\d*)?(?:\.\d*)?(?:e[\+\-]\d*)?|0b[01]+|0o[0-7]+|0x[0-9a-f]+)$/i;

const match = str => resolveLeaddingZero(str) && resolveLeaddingZero(str).match(reg)
module.exports = match
