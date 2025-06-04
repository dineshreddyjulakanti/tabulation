const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected for seeding...');
    return seedProducts();
  })
  .catch(err => console.error(err));

async function seedProducts() {
  await Product.deleteMany({});
  
  const categories = ['Electronics', 'Books', 'Clothing', 'Toys'];
  const products = Array.from({ length: 100 }, (_, i) => ({
    name: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
    category: categories[Math.floor(Math.random() * categories.length)],
    inStock: Math.random() > 0.3,
  }));

  await Product.insertMany(products);
  console.log('Seeded 100 products');
  mongoose.disconnect();
}
