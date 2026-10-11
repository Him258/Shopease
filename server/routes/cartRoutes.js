const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes are protected and strictly scoped to req.user._id
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQty);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/sync', syncCart);

module.exports = router;
