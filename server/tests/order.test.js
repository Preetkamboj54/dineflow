const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Mock the verifyToken middleware to simply set req.user
jest.mock('../src/middleware/authMiddleware', () => {
  const mongoose = require('mongoose');
  const mockUserId = new mongoose.Types.ObjectId().toString();
  return {
    verifyToken: (req, res, next) => {
      req.user = { id: mockUserId, role: 'customer' };
      next();
    },
    verifyRole: (roles) => (req, res, next) => next(),
    _mockUserId: mockUserId // Export it for use in beforeEach
  };
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Order API', () => {
  let testUser, testRestaurant, testMenuItem, authToken;
  const { _mockUserId } = require('../src/middleware/authMiddleware');

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    await User.create({
      _id: _mockUserId,
      name: 'Mock User',
      email: 'mock@example.com',
      phoneNumber: '0000000000',
      passwordHash: 'hash',
      role: 'customer'
    });

    testRestaurant = await Restaurant.create({
      name: 'Test Restaurant',
      cuisine: 'Italian',
      address: '123 Pasta St',
      phone: '0987654321'
    });

    testMenuItem = await MenuItem.create({
      restaurantId: testRestaurant._id,
      name: 'Pizza',
      price: 12.99,
      category: 'Main'
    });

    authToken = 'mock-token';
  });

  it('should create an order successfully', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        items: [{ menuItemId: testMenuItem._id, quantity: 2 }],
        paymentMethod: 'COD'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('orderId');
    expect(res.body.totalAmount).toBe(12.99 * 2);
  });

  it('should fetch user orders successfully', async () => {
    // Create an order first
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        paymentMethod: 'COD'
      });

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a specific order successfully', async () => {
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        paymentMethod: 'COD'
      });

    const orderId = orderRes.body.orderId;
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalAmount');
  });

  it('should reject order with invalid menu item', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        items: [{ menuItemId: new mongoose.Types.ObjectId(), quantity: 1 }],
        paymentMethod: 'COD'
      });
    
    expect(res.status).toBe(404);
  });

  it('should validate price on server and ignore client provided totals', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        paymentMethod: 'COD',
        totalAmount: 0.01
      });
    
    expect(res.status).toBe(201);
    expect(res.body.totalAmount).toBe(testMenuItem.price);
  });
});
