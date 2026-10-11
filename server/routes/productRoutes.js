const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public Product Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Protected Product Routes
router.get('/admin/all', protect, admin, getAdminProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, updateProductStock);
router.patch('/:id/status', protect, admin, toggleProductStatus);

module.exports = router;
