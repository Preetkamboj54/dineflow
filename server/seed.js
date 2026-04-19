const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    const r1 = await Restaurant.create({
      name: 'Pizza Palace',
      cuisine: 'Italian',
      address: '123 Cheese St',
      phone: '555-PIZZA',
      rating: 4.5,
      isOpen: true,
    });

    const r2 = await Restaurant.create({
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      address: '456 Fish Ln',
      phone: '555-SUSHI',
      rating: 4.8,
      isOpen: true,
    });

    await MenuItem.create([
      { restaurantId: r1._id, name: 'Margherita Pizza', price: 12, category: 'Pizza', description: 'Classic tomato and mozzarella' },
      { restaurantId: r1._id, name: 'Pepperoni Pizza', price: 14, category: 'Pizza', description: 'Spicy pepperoni' },
      { restaurantId: r1._id, name: 'Tiramisu', price: 6, category: 'Dessert', description: 'Coffee flavored cake' },
      { restaurantId: r2._id, name: 'Salmon Nigiri', price: 5, category: 'Sushi', description: 'Fresh salmon' },
      { restaurantId: r2._id, name: 'Dragon Roll', price: 15, category: 'Sushi', description: 'Avocado and eel' },
      { restaurantId: r2._id, name: 'Miso Soup', price: 4, category: 'Starter', description: 'Traditional miso' },
    ]);

    console.log('Database seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
