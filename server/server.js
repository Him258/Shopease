const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(async () => {
  // Ensure exactly one admin user exists on startup (from ADMIN_MOBILE env)
  try {
    const User = require('./models/User');
    const adminMobile = process.env.ADMIN_MOBILE;
    if (adminMobile && /^[6-9]\d{9}$/.test(adminMobile)) {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        await User.create({
          name: process.env.ADMIN_NAME || 'Admin',
          mobile: adminMobile,
          role: 'admin',
          isVerified: true,
        });
        console.log('Admin user initialized.');
      }
    }
  } catch (err) {
    // Non-fatal: admin may already exist or env not configured yet
  }
});

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Parse incoming JSON payloads
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Base Routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to ShopEase API',
    status: 'Running',
    endpoints: {
      auth: `http://localhost:${PORT}/api/auth`,
      products: `http://localhost:${PORT}/api/products`,
      cart: `http://localhost:${PORT}/api/cart`,
      payment: `http://localhost:${PORT}/api/payment`,
      orders: `http://localhost:${PORT}/api/orders`,
      admin: `http://localhost:${PORT}/api/admin`,
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 ShopEase Backend Server is running!`);
  console.log(`📡 Local:    http://localhost:${PORT}`);
  console.log(`🛍️ Products: http://localhost:${PORT}/api/products`);
  console.log(`🔐 Auth:     http://localhost:${PORT}/api/auth`);
  console.log(`========================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 Solution: Stop the running process using Ctrl + C or change PORT in server/.env\n`);
  } else {
    console.error('Server error:', err);
  }
});

// Clean termination handling
const shutdown = () => {
  console.log('\nGracefully shutting down server...');
  server.close(() => {
    console.log('Server closed. Port released.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
