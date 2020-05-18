const assert = require("assert");
const match = require("../demo4");

describe("easy pattern: \"abc\"", function () {
  const pattern = "abc"
  it ("abc => true", function () {
    assert.equal(match(pattern, "abc"), true)
  })
  it ("aabc => true", function () {
    assert.equal(match(pattern, "aabc"), true)
  })
  it ("ababc => true", function () {
    assert.equal(match(pattern, "ababc"), true)
  })
  it ("abababd => false", function () {
    assert.equal(match(pattern, "abababd"), false)
  })
})

describe("complex pattern: \"abababx\"", function () {
  const pattern = "abababx"
  it ("abababx => true", function () {
    assert.equal(match(pattern, "abababx"), true)
  })
  it ("ababababx => true", function () {
    assert.equal(match(pattern, "ababababx"), true)
  })
  it ("aabababx => true", function () {
    assert.equal(match(pattern, "aabababx"), true)
  })
  it ("abababd => false", function () {
    assert.equal(match(pattern, "abababd"), false)
  })
  it ("abaaaaaa234aaaaaaadsfsdfdfgfdgdfgdfgbabd => false", function () {
    assert.equal(match(pattern, "abaaaaaa234aaaaaaadsfsdfdfgfdgdfgdfgbabd"), false)
  })
})

describe("edge case", function () {
  it ("empty pattern => true", function () {
    assert.equal(match("", "abababx"), true)
  })
  it ("empty input => false", function () {
    assert.equal(match("abc", ""), false)
  })
  it ("both empty => true", function () {
    assert.equal(match("", ""), true)
  })

  it ("abc, ab => false", function () {
    assert.equal(match("abc", "ab"), false)
  })
})