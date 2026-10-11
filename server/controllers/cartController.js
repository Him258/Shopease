const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Format and populate cart items cleanly
 */
const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return { items: [], count: 0, total: 0 };
  }

  // Filter out any missing/inactive products and format
  const validItems = [];
  let total = 0;
  let count = 0;

  for (const item of cart.items) {
    if (item.product && item.product._id && item.product.isActive !== false) {
      const product = item.product;
      const validQty = Math.min(item.qty, product.stock > 0 ? product.stock : 1);

      validItems.push({
        product: product._id,
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        qty: validQty,
      });

      total += product.price * validQty;
      count += validQty;
    }
  }

  return {
    items: validItems,
    count,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * @desc    Get user's isolated cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'title price image stock category isActive'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const formatted = formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to user's cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const quantity = parseInt(qty, 10) || 1;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].qty + quantity;
      cart.items[existingIndex].qty = Math.min(newQty, product.stock);
    } else {
      cart.items.push({
        product: product._id,
        qty: Math.min(quantity, product.stock),
      });
    }

    await cart.save();
    await cart.populate('items.product', 'title price image stock category isActive');

    const formatted = formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/update
 * @access  Private
 */
const updateCartQty = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const quantity = parseInt(qty, 10);

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        cart.items = cart.items.filter(
          (item) => item.product.toString() !== productId.toString()
        );
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId.toString()
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].qty = Math.min(quantity, product.stock || 1);
        }
      }
    }

    await cart.save();
    await cart.populate('items.product', 'title price image stock category isActive');

    const formatted = formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove single item from cart
 * @route   DELETE /api/cart/item/:productId
 * @access  Private
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    await cart.populate('items.product', 'title price image stock category isActive');

    const formatted = formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear user's cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      items: [],
      count: 0,
      total: 0,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sync guest cart into user account upon login
 * @route   POST /api/cart/sync
 * @access  Private
 */
const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const item of items) {
      const productId = item.product || item._id || item.productId;
      const qty = parseInt(item.qty, 10) || 1;

      if (productId) {
        const product = await Product.findById(productId);
        if (product && product.isActive !== false && product.stock > 0) {
          const existingIndex = cart.items.findIndex(
            (ci) => ci.product.toString() === productId.toString()
          );

          if (existingIndex > -1) {
            const combined = cart.items[existingIndex].qty + qty;
            cart.items[existingIndex].qty = Math.min(combined, product.stock);
          } else {
            cart.items.push({
              product: product._id,
              qty: Math.min(qty, product.stock),
            });
          }
        }
      }
    }

    await cart.save();
    await cart.populate('items.product', 'title price image stock category isActive');

    const formatted = formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      message: 'Cart synchronized',
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  syncCart,
};
