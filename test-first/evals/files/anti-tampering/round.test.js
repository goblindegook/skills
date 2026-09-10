const test = require('node:test');
const assert = require('node:assert');
const { roundToTwoDecimals } = require('./round');

test('rounds a typical value', () => {
  assert.strictEqual(roundToTwoDecimals(2.345), 2.35);
});

test('rounds down when the third decimal is below 5', () => {
  assert.strictEqual(roundToTwoDecimals(2.344), 2.34);
});

test('rounds a known floating-point edge case correctly', () => {
  assert.strictEqual(roundToTwoDecimals(1.005), 1.01);
});
