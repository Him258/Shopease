const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateFulfillmentStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Customer Protected Routes
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Protected Routes
router.get('/', protect, admin, getAllOrders);
router.patch('/:id/fulfillment', protect, admin, updateFulfillmentStatus);

module.exports = router;
