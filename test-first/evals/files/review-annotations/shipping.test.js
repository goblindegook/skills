const { test } = require('node:test');
const assert = require('node:assert');
const { shippingFee } = require('./shipping');

test('a standard order under the free-shipping threshold is charged the flat fee', () => {
  assert.strictEqual(shippingFee({ subtotal: 40, express: false }), 5);
});

// REVIEW: an order exactly at 50 should be free too — this says 51. Which is it?
test('an order over the free-shipping threshold ships free', () => {
  assert.strictEqual(shippingFee({ subtotal: 51, express: false }), 0);
});

// REVIEW: missing the case I care about most — express delivery is never free,
// even above the threshold. Add it.
test('express delivery is charged the express fee', () => {
  assert.strictEqual(shippingFee({ subtotal: 40, express: true }), 15);
});
