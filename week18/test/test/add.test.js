const assert = require("assert");
import { add } from "../src/add.js";


describe('add', function () {
  it ('add(3, 4) should be 7', function () {
    assert.equal(add(3,4), 7);
  })
})