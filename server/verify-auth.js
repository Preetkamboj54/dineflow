const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { register, login } = require('./src/controllers/authController');
const { verifyToken, verifyRole } = require('./src/middleware/authMiddleware');
const http = require('http');

dotenv.config({ path: './server/.env' });

// --- MOCK USER MODEL ---
// Since we might not have a live MongoDB instance, we mock the User model
const mockUsers = new Map();
const MockUser = {
  findOne: async ({ email }) => {
    return mockUsers.get(email) || null;
  },
  create: async (userData) => {
    const user = { ...userData, _id: Math.random().toString(36).substr(2, 9) };
    mockUsers.set(user.email, user);
    return user;
  },
  deleteMany: async () => {
    mockUsers.clear();
  }
};

// We override the User model in the controllers by using a proxy or simply 
// injecting it if we had dependency injection. 
// Since we don't, we'll use a trick: override the require cache.
const UserPath = require.resolve('./models/User');
require.cache[UserPath] = {
  exports: MockUser,
  id: UserPath
};

async function runTests() {
  console.log('🚀 Starting Authentication System Verification (with Mock DB)...');
  
  const app = express();
  app.use(express.json());
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/test/protected', verifyToken, (req, res) => {
    res.json({ success: true, user: req.user });
  });
  app.get('/api/test/admin', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ success: true });
  });

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`✅ Test server running on ${baseUrl}`);

    try {
      await MockUser.deleteMany({});
      
      const testUser = { name: 'Test User', email: 'test@example.com', password: 'Password123!', phoneNumber: '1234567890', role: 'customer' };
      const adminUser = { name: 'Admin User', email: 'admin@example.com', password: 'AdminPassword123!', phoneNumber: '0987654321', role: 'admin' };

      // Test Registration
      const reg = await request(baseUrl, 'POST', '/api/auth/register', testUser);
      if (reg.status !== 201) throw new Error(`Registration failed: ${JSON.stringify(reg.body)}`);
      console.log('✅ Registration successful');

      // Test Login
      const login = await request(baseUrl, 'POST', '/api/auth/login', { email: testUser.email, password: testUser.password });
      if (login.status !== 200) throw new Error(`Login failed: ${JSON.stringify(login.body)}`);
      const token = login.body.token;
      console.log('✅ Login successful');

      // Test Protected Route
      const prot = await request(baseUrl, 'GET', '/api/test/protected', {}, { 'Authorization': `Bearer ${token}` });
      if (prot.status !== 200) throw new Error('Protected route failed');
      console.log('✅ Protected route accessible');

      // Test Admin Route (Customer)
      const adminFail = await request(baseUrl, 'GET', '/api/test/admin', {}, { 'Authorization': `Bearer ${token}` });
      if (adminFail.status !== 403) throw new Error('Customer should not access admin route');
      console.log('✅ Admin route protected from customers');

      // Test Admin Route (Admin)
      await request(baseUrl, 'POST', '/api/auth/register', adminUser);
      const adminLogin = await request(baseUrl, 'POST', '/api/auth/login', { email: adminUser.email, password: adminUser.password });
      const adminToken = adminLogin.body.token;
      const adminSuccess = await request(baseUrl, 'GET', '/api/test/admin', {}, { 'Authorization': `Bearer ${adminToken}` });
      if (adminSuccess.status !== 200) throw new Error('Admin should access admin route');
      console.log('✅ Admin route accessible by admin');

      console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED!');
    } catch (e) {
      console.error('❌ Test failed:', e.message);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

async function request(baseUrl, method, path, body = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = baseUrl.split(':');
    const options = {
      hostname: 'localhost',
      port: urlParts[2],
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

runTests();
