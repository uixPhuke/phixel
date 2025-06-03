const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');

// ========================
//  Database Cart (Logged-in Users)
// ========================

// Get user's cart from DB
const getDbCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('products.product', 'name price images stock');
      
    res.json(cart?.products || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Add to DB cart
const addToDbCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Stock validation
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    // Update existing or add new item
    const itemIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// ========================
//  Guest Cart Sync (On Login)
// ========================

const syncGuestCart = async (req, res) => {
  const { guestCart } = req.body;
  
  try {
    let cart = await Cart.findOne({ user: req.user._id }) || 
               new Cart({ user: req.user._id, products: [] });

    // Merge guest cart with DB cart
    for (const guestItem of guestCart) {
      const product = await Product.findById(guestItem.productId);
      if (!product || product.stock < 1) continue;

      const existingItem = cart.products.find(
        item => item.product.toString() === guestItem.productId
      );

      if (existingItem) {
        // Don't exceed available stock
        const newQty = Math.min(
          existingItem.quantity + guestItem.quantity,
          product.stock
        );
        existingItem.quantity = newQty;
      } else {
        cart.products.push({
          product: guestItem.productId,
          quantity: Math.min(guestItem.quantity, product.stock)
        });
      }
    }

    await cart.save();
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: 'Sync failed', error });
  }
};

// ========================
//  Common Cart Actions
// ========================

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: { product: req.params.productId } } },
      { new: true }
    ).populate('products.product', 'name price images');

    res.json(cart?.products || []);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { products: [] }
    );
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};

module.exports = {
  getDbCart,
  addToDbCart,
  syncGuestCart,
  removeFromCart,
  clearCart
};