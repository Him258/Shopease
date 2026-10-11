const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { cashfreeClient } = require('../config/cashfree');
const { getRazorpayInstance } = require('../config/razorpay');

/**
 * @desc    Create Payment Order (Cashfree preferred, with Razorpay support)
 * @route   POST /api/payment/create-order
 * @access  Private
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const { items, gateway = 'cashfree' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required to create an order',
      });
    }

    // Validate products from DB and calculate total from DB prices (never trust client)
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.productId || item.product || item._id;
      const qty = parseInt(item.qty, 10) || 1;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product reference provided in cart',
        });
      }

      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Item quantity must be at least 1',
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`,
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${qty}`,
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        qty: qty,
      });

      calculatedTotal += product.price * qty;
    }

    if (calculatedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order total amount must be greater than zero',
      });
    }

    // Cashfree Gateway Order Creation
    if (process.env.CASHFREE_APP_ID || gateway === 'cashfree') {
      const uniqueOrderId = `CF_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

      const cashfreePayload = {
        order_id: uniqueOrderId,
        order_amount: Math.round(calculatedTotal * 100) / 100,
        order_currency: 'INR',
        customer_details: {
          customer_id: req.user._id.toString(),
          customer_name: req.user.name || 'Customer',
          customer_email: req.user.email,
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `http://localhost:5173/orders?cf_order_id=${uniqueOrderId}`,
        },
      };

      const cfResponse = await cashfreeClient.createOrder(cashfreePayload);

      const newOrder = await Order.create({
        user: req.user._id,
        items: orderItems,
        amount: calculatedTotal,
        gateway: 'cashfree',
        gatewayOrderId: cfResponse.order_id,
        paymentSessionId: cfResponse.payment_session_id,
        status: 'pending',
      });

      return res.status(200).json({
        success: true,
        gateway: 'cashfree',
        paymentSessionId: cfResponse.payment_session_id,
        orderId: cfResponse.order_id,
        amount: calculatedTotal,
        currency: 'INR',
        dbOrderId: newOrder._id,
      });
    }

    // Razorpay Fallback Order Creation
    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(calculatedTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const newOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      amount: calculatedTotal,
      gateway: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    });

    return res.status(200).json({
      success: true,
      gateway: 'razorpay',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error('Payment order creation error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to create payment gateway order',
    });
  }
};

/**
 * @desc    Verify Payment Status (Supports Cashfree and Razorpay)
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const cfOrderId = order_id || req.body.cf_order_id;

    // --- Cashfree Verification ---
    if (cfOrderId) {
      const order = await Order.findOne({
        $or: [{ gatewayOrderId: cfOrderId }, { _id: cfOrderId }],
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found in database',
        });
      }

      // Check if already paid
      if (order.status === 'paid') {
        return res.status(200).json({
          success: true,
          message: 'Payment already verified',
          order,
        });
      }

      // Check status with Cashfree Server
      const cfOrder = await cashfreeClient.getOrder(order.gatewayOrderId || cfOrderId);

      if (cfOrder.order_status === 'PAID') {
        order.status = 'paid';
        order.gatewayOrderId = cfOrder.order_id;
        await order.save();

        // Decrement product inventory atomically
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty },
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully with Cashfree!',
          order,
        });
      } else {
        order.status = 'failed';
        await order.save();

        return res.status(400).json({
          success: false,
          message: `Cashfree payment status: ${cfOrder.order_status}`,
        });
      }
    }

    // --- Razorpay Verification ---
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found for given Razorpay ID',
        });
      }

      if (order.status === 'paid') {
        return res.status(200).json({
          success: true,
          message: 'Payment already verified',
          order,
        });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        order.status = 'failed';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Invalid Razorpay payment signature',
        });
      }

      order.status = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully!',
        order,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Missing order_id or Razorpay signature details for verification',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
