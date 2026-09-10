const orders = new Map([
  ['ord_1', { id: 'ord_1', status: 'placed' }],
  ['ord_2', { id: 'ord_2', status: 'shipped' }],
]);

function getOrder(id) {
  return orders.get(id) || null;
}

function saveOrder(order) {
  orders.set(order.id, order);
  return order;
}

module.exports = { getOrder, saveOrder };
