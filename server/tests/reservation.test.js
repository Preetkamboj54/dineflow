const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// Mock the verifyToken middleware
jest.mock('../src/middleware/authMiddleware', () => {
  const mongoose = require('mongoose');
  const mockUserId = new mongoose.Types.ObjectId().toString();
  return {
    verifyToken: (req, res, next) => {
      req.user = { id: mockUserId, role: 'customer' };
      next();
    },
    verifyRole: (roles) => (req, res, next) => next(),
    _mockUserId: mockUserId
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

describe('Reservation API', () => {
  let testRestaurant, authToken;
  const { _mockUserId } = require('../src/middleware/authMiddleware');

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    
    try {
      const Reservation = mongoose.model('Reservation');
      await Reservation.deleteMany({});
    } catch (e) {
      // Model not registered yet, which is fine for RED phase
    }

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

    authToken = 'mock-token';
  });

  it('should create a reservation successfully', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        date: '2026-12-01',
        time: '19:00',
        partySize: 2
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('reservationId');
  });

  it('should fetch user reservations successfully', async () => {
    // Create a reservation first
    await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        date: '2026-12-01',
        time: '19:00',
        partySize: 2
      });

    const res = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should reject reservation for a date in the past', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        date: '2020-01-01',
        time: '19:00',
        partySize: 2
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('future');
  });

  it('should reject reservation when restaurant capacity is exceeded', async () => {
    // Set a low capacity for the test restaurant
    await Restaurant.findByIdAndUpdate(testRestaurant._id, { capacity: 1 });

    // First reservation - should pass
    await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        date: '2026-12-02',
        time: '18:00',
        partySize: 2
      });

    // Second reservation for same slot - should fail
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: testRestaurant._id,
        date: '2026-12-02',
        time: '18:00',
        partySize: 2
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('full');
  });
});
