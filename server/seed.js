const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const sampleProducts = [
  // Shoes (4 items)
  {
    title: 'Nike Air Max 270',
    description: 'Boasting the biggest heel Air unit yet, the Nike Air Max 270 delivers unmatched all-day comfort and bold street style.',
    price: 159.99,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stock: 25,
  },
  {
    title: 'Adidas Ultraboost Light',
    description: 'Experience epic energy with the lightest Ultraboost ever made. Built with responsive BOOST cushioning.',
    price: 189.99,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    stock: 18,
  },
  {
    title: 'Puma Classic Suede Sneakers',
    description: 'A street legend since 1968, featuring rich suede upper and timeless low-profile silhouette.',
    price: 75.0,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    stock: 30,
  },
  {
    title: 'New Balance 574 Core',
    description: 'An iconic sneaker with clean lines, premium suede/mesh construction, and supportive ENCAP midsole.',
    price: 89.99,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    stock: 22,
  },

  // T-Shirts (3 items)
  {
    title: 'Classic Crewneck Organic Tee',
    description: 'Crafted from 100% combed organic cotton with a tailored regular fit and soft hand-feel.',
    price: 29.99,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    stock: 50,
  },
  {
    title: 'Vintage Washed Graphic T-Shirt',
    description: 'Heavyweight jersey cotton with a distressed vintage wash and subtle front chest graphic print.',
    price: 34.5,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    stock: 40,
  },
  {
    title: 'Minimalist Oversized Boxy Tee',
    description: 'Contemporary drop-shoulder silhouette made with dense, breathable 240 GSM organic cotton.',
    price: 39.0,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    stock: 35,
  },

  // Accessories (3 items)
  {
    title: 'Minimalist Matte Chrono Watch',
    description: 'Sleek 40mm stainless steel case with sapphire crystal glass and genuine Italian leather strap.',
    price: 129.0,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    stock: 15,
  },
  {
    title: 'Polarized Aviator Sunglasses',
    description: 'Lightweight titanium frame with UV400 polarized gradient lenses for crystal-clear clarity.',
    price: 65.0,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    stock: 28,
  },
  {
    title: 'Full-Grain Leather Bifold Wallet',
    description: 'Slim RFID-blocking bifold wallet with 8 card slots, dual cash compartments, and handcrafted stitching.',
    price: 49.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    stock: 45,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    const adminMobile = process.env.ADMIN_MOBILE;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminMobile || !/^[6-9]\d{9}$/.test(adminMobile)) {
      console.error('ADMIN_MOBILE is missing or invalid in .env. Aborting seed.');
      process.exit(1);
    }

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();

    // Ensure exactly one admin user exists
    await User.create({
      name: adminName,
      mobile: adminMobile,
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin user created.');

    console.log('Inserting 10 sample products...');
    const productsWithActive = sampleProducts.map((p) => ({ ...p, isActive: true }));
    const createdProducts = await Product.insertMany(productsWithActive);
    console.log(`Seeded ${createdProducts.length} products across 3 categories.`);

    console.log('\nSeeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
