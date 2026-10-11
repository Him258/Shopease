const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc    Admin Overview Dashboard Statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ status: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: { $ne: false } });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStockProducts = await Product.countDocuments({ stock: { $lte: 0 } });

    const totalCustomers = await User.countDocuments({ role: 'user' });

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'title image price')
      .sort({ createdAt: -1 })
      .limit(6);

    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });
    const processingFulfillmentCount = await Order.countDocuments({ fulfillmentStatus: 'Processing' });

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        pendingOrdersCount,
        processingFulfillmentCount,
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalCustomers,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Customer Management List
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
const getAdminCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { role: 'user' };

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { mobile: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const customers = await User.find(filter).sort({ createdAt: -1 });

    // Aggregate orders and spend per customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const userOrders = await Order.find({ user: customer._id });
        const paidOrders = userOrders.filter((o) => o.status === 'paid');
        const totalSpent = paidOrders.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        return {
          _id: customer._id,
          name: customer.name,
          mobile: customer.mobile,
          email: customer.email,
          role: customer.role,
          createdAt: customer.createdAt,
          totalOrders: userOrders.length,
          paidOrders: paidOrders.length,
          totalSpent: Math.round(totalSpent * 100) / 100,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminCustomers,
};
