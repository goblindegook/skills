const { placeOrder, getOrder } = require('./orderService');

function handleRequest(method, path) {
  const match = path.match(/^\/orders\/([^/]+)$/);
  if (method === 'GET' && match) {
    const order = getOrder(match[1]);
    return order ? { status: 200, body: order } : { status: 404, body: null };
  }
  if (method === 'POST' && path === '/orders') {
    return { status: 201, body: placeOrder(`ord_${Date.now()}`) };
  }
  return { status: 404, body: null };
}

module.exports = { handleRequest };
