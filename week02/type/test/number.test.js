const assert = require("assert");
const match = require("../number");

describe("DecimalLiter", function () {
  describe("DecimalIntegerLiter . [DecimalDigits] [ExponentPart]", function () {
    it("000 => null", function() {
      assert.equal(match("000"), null)
    })
    it("0.", function() {
      assert.equal(match("0.")[0], "0.")
    })
    it("0.adf => null", function() {
      assert.equal(match("0.adf"), null)
    })
    it("02.1312 => null", function() {
      assert.equal(match("02.1312"), null)
    })
  })
  describe(". DecimalDigits [ExponentPart]", () => {
    it(".0123", () => {
      assert.equal(match(".0123")[0], ".0123")
    })
    it(".2121e-4", () => {
      assert.equal(match(".2121e-4")[0], ".2121e-4")
    })
  })
  describe("DecimalIntegerLiter [ExponentPart]", () => {
    it("12.1312E-5", function () {
      assert.equal(match("12.1312E-5")[0], "12.1312E-5")
    })
  })
})

describe("BinaryIntegerLiteral", () => {
  it("0b12348 => null", function () {
    assert.equal(match("0b12348"), null)
  })
  it("00b01 => null", function () {
    assert.equal(match("00b01"), null)
  })
  it("0b0101", function () {
    assert.equal(match("0b0101")[0], "0b0101")
  })
})
describe("OctalIntegerLiteral", () => {
  it("0o12348 => null", function () {
    assert.equal(match("0o12348"), null)
  })
  it("00o1245 => null", function () {
    assert.equal(match("00o1245"), null)
  })
  it("0o01245", function () {
    assert.equal(match("0o01245")[0], "0o01245")
  })
})
describe("HexIntegetLiteral", () => {
  it("0x12adfz => null", function () {
    assert.equal(match("0x12adfz"), null)
  })
  it("00x12adf => null", function () {
    assert.equal(match("00x12adf"), null)
  })
  it("0x12adf", function () {
    assert.equal(match("0x12adf")[0], "0x12adf")
  })
})