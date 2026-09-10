const { CheckoutService } = require('../src/checkoutService');
const { PaymentAPI } = require('../src/paymentApi');

describe('CheckoutService', () => {
  let checkout;

  beforeEach(() => {
    checkout = new CheckoutService(new PaymentAPI()); // hits real API
  });

  it('processes payment', async () => {
    const result = await checkout.process({
      amount: 99.99,
      card: '4111111111111111',
      currency: 'USD'
    });
    expect(result.status).toBe('success');
    expect(result.transactionId).toBeDefined();
  });

  it('handles declined card', async () => {
    const result = await checkout.process({
      amount: 99.99,
      card: '4000000000000002', // decline card
      currency: 'USD'
    });
    expect(result.status).toBe('declined');
  });

  it('applies discount code', async () => {
    const result = await checkout.process({
      amount: 100,
      card: '4111111111111111',
      currency: 'USD',
      discountCode: 'SAVE10'
    });
    expect(result.chargedAmount).toBe(90);
  });

  it('x42 edge case', async () => {
    const result = await checkout.process({
      amount: 42,
      card: '4111111111111111',
      currency: 'USD'
    });
    expect(result).toBeTruthy();
  });
});
