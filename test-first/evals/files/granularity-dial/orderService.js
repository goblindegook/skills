const { getOrder, saveOrder } = require('./orderStore');

function placeOrder(id) {
  return saveOrder({ id, status: 'placed' });
}

module.exports = { placeOrder, getOrder };
