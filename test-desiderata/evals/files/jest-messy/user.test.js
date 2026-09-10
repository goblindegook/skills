const { UserService } = require('../src/userService');
const db = require('../src/db');

// shared state — not reset between tests
let service;
let testUser;

beforeAll(async () => {
  await db.connect();
  service = new UserService(db);
  testUser = await service.create({ name: 'Alice', email: 'alice@example.com' });
});

afterAll(async () => {
  await db.disconnect();
});

test('1', async () => {
  const user = await service.findById(testUser.id);
  expect(user).toBeTruthy();
  expect(user.name).toBe('Alice');
  expect(user.email).toBe('alice@example.com');
  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
});

test('2', async () => {
  // depends on test 1 having run first
  const updated = await service.update(testUser.id, { name: 'Alice Updated' });
  expect(updated.name).toBe('Alice Updated');
  testUser = updated; // mutate shared state
});

test('3', async () => {
  // depends on test 2
  await service.delete(testUser.id);
  const found = await service.findById(testUser.id);
  expect(found).toBeNull();
});

test('calls _fetchFromDb with correct id', async () => {
  const spy = jest.spyOn(service, '_fetchFromDb');
  await service.findById(42);
  expect(spy).toHaveBeenCalledWith(42);
  spy.mockRestore();
});

test('email validation', async () => {
  await expect(service.create({ name: 'Bob', email: 'not-an-email' }))
    .rejects.toThrow();
});
