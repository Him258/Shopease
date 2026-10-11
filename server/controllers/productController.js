const Product = require('../models/Product');

/**
 * @desc    Fetch all public active products with optional search query and category filtering
 * @route   GET /api/products
 * @access  Public
 * @query   q, category, sort, page, limit
 */
const getProducts = async (req, res, next) => {
  try {
    const { q, category, sort, page = 1, limit = 50 } = req.query;
    const filter = { isActive: { $ne: false } };

    // Case-insensitive search keyword in title or description
    if (q && q.trim() !== '') {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Fetch all products (including inactive & low stock)
 * @route   GET /api/products/admin/all
 * @access  Private/Admin
 */
const getAdminProducts = async (req, res, next) => {
  try {
    const { q, category, status, stockStatus, sort } = req.query;
    const filter = {};

    if (q && q.trim() !== '') {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    if (stockStatus === 'out') filter.stock = { $lte: 0 };
    if (stockStatus === 'low') filter.stock = { $gt: 0, $lte: 5 };
    if (stockStatus === 'in') filter.stock = { $gt: 5 };

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'stock-low') sortOption = { stock: 1 };
    if (sort === 'stock-high') sortOption = { stock: -1 };

    const products = await Product.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, image, stock, isActive } = req.body;

    if (!title || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, category, and image URL',
      });
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image: image.trim(),
      stock: numericStock,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, image, stock, isActive } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) {
      const p = parseFloat(price);
      if (isNaN(p) || p < 0) {
        return res.status(400).json({ success: false, message: 'Invalid price' });
      }
      product.price = p;
    }
    if (category !== undefined) product.category = category.trim();
    if (image !== undefined) product.image = image.trim();
    if (stock !== undefined) {
      const s = parseInt(stock, 10);
      if (isNaN(s) || s < 0) {
        return res.status(400).json({ success: false, message: 'Invalid stock count' });
      }
      product.stock = s;
    }
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product inventory / stock directly
 * @route   PATCH /api/products/:id/stock
 * @access  Private/Admin
 */
const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative stock number required',
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: numericStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Stock updated to ${numericStock}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle product active/inactive listing status
 * @route   PATCH /api/products/:id/status
 * @access  Private/Admin
 */
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product is now ${product.isActive ? 'Active' : 'Deactivated'}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
};
