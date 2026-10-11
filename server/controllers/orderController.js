const Order = require('../models/Order');

/**
 * @desc    Get logged in user orders (newest first)
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title image price category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name mobile email role')
      .populate('items.product', 'title image price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if order belongs to user or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Access restricted to order owner',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all orders across all customers
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, fulfillmentStatus, search, sort = 'newest' } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    if (fulfillmentStatus && fulfillmentStatus !== 'all') {
      filter.fulfillmentStatus = fulfillmentStatus;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'amount-high') sortOption = { amount: -1 };
    if (sort === 'amount-low') sortOption = { amount: 1 };

    let orders = await Order.find(filter)
      .populate('user', 'name mobile email role')
      .populate('items.product', 'title image price category')
      .sort(sortOption);

    // Filter by customer name, mobile, email or order id if search query provided
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      orders = orders.filter((o) => {
        const idMatch = o._id.toString().toLowerCase().includes(q);
        const nameMatch = o.user?.name?.toLowerCase().includes(q);
        const mobileMatch = o.user?.mobile?.includes(q);
        const emailMatch = o.user?.email?.toLowerCase().includes(q);
        const paymentIdMatch = (o.razorpayPaymentId || o.gatewayOrderId || '')
          .toLowerCase()
          .includes(q);
        return idMatch || nameMatch || mobileMatch || emailMatch || paymentIdMatch;
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update order fulfillment status
 * @route   PATCH /api/orders/:id/fulfillment
 * @access  Private/Admin
 */
const updateFulfillmentStatus = async (req, res, next) => {
  try {
    const { fulfillmentStatus } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!fulfillmentStatus || !validStatuses.includes(fulfillmentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid fulfillment status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name mobile email')
      .populate('items.product', 'title image price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update fulfillment status ONLY - Payment status remains unaltered
    order.fulfillmentStatus = fulfillmentStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order fulfillment status updated to ${fulfillmentStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateFulfillmentStatus,
};
