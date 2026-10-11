const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminCustomers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All admin dashboard routes require protect & admin
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/customers', getAdminCustomers);

module.exports = router;
