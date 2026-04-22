const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@dineflow.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123456', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@dineflow.com',
      passwordHash,
      phoneNumber: '000-000-0000',
      role: 'admin'
    });

    console.log('Admin user created: admin@dineflow.com / admin123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
