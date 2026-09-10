const assert = require('assert');
const { AuthService } = require('../auth');

// No test framework — just raw Node assertions
// Run manually: node auth.test.js

const auth = new AuthService({ secret: 'test-secret' });

// Test 1: login with valid credentials
const token = auth.login('admin', 'password123');
assert(token, 'should return a token');
assert.strictEqual(typeof token, 'string');

// Test 2: login with wrong password
let threw = false;
try {
  auth.login('admin', 'wrong');
} catch (e) {
  threw = true;
}
assert(threw, 'should throw on wrong password');

// Test 3: token expiry — relies on real clock
const shortAuth = new AuthService({ secret: 'test-secret', expiresInMs: 100 });
const expiredToken = shortAuth.login('admin', 'password123');
setTimeout(() => {
  assert(!shortAuth.verify(expiredToken), 'should reject expired token');
  console.log('All tests passed');
}, 200);

// Test 4: verify valid token
const validToken = auth.login('admin', 'password123');
const verified = auth.verify(validToken);
assert.strictEqual(verified.username, 'admin');

// Test 5: admin role check
const adminToken = auth.login('admin', 'password123');
assert(auth.hasRole(adminToken, 'admin'), 'admin should have admin role');
assert(!auth.hasRole(adminToken, 'superuser'), 'admin should not have superuser role');
