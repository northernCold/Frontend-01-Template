const assert = require("assert");
const { encodeA, encodeB} = require("../utf-8_encode");

describe("首先设 w1是16位数，w2是 w1下一个16位数", function () {
  it("w1小于0xD800 或者 大于 0xDFFF", function () {
    assert.equal(encodeB("\uD750"), encodeA("\uD750"))
  })
  it("w1如果在0xD800和0xDBFF之间", function () {
    assert.equal(encodeB("\uC110\uDEFF"), null)
  })
  it("如果没有w2的值", function () {
    assert.equal(encodeB("\uD888"), null)
  })
  it("w2的值不在0xDC00和0xDFFF之间", function () {
    assert.equal(encodeB("\uD888\uC110"), null)
  })
  it("正常情况", function () {
    assert.equal(encodeB("😁🤩"), encodeA("😁🤩"))
  })
})