const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");

// ========================
//  Database Cart (Logged-in Users)
// ========================

// Get user's cart from DB
const getDbCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
      "title sellingPrice images stock"
    );

    res.json(cart?.products || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Add to DB cart
const addToDbCart = async (req, res) => {
  const { productID, quantity, size } = req.body;

  try {
    const product = await Product.findById(productID);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [],
        totalPrice: 0
      });
    }

    const itemIndex = cart.products.findIndex(
      (item) =>
        item.product.toString() === productID &&
        item.size === size
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = Math.min(
        cart.products[itemIndex].quantity + quantity,
        product.stock
      );
    } else {
      cart.products.push({
        product: productID,
        quantity,
        size,
        priceSnapshot: product.sellingPrice
      });
    }

    // 🔹 Recalculate cart total
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await cart.populate(
      "products.product",
      "title sellingPrice images stock"
    );

    res.json(populatedCart.products);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// ========================
//  Guest Cart Sync (On Login)
// ========================

const syncGuestCart = async (req, res) => {
  const { guestCart } = req.body;

  try {
    let cart =
      (await Cart.findOne({ user: req.user._id })) ||
      new Cart({ user: req.user._id, products: [], totalPrice: 0 });

    for (const guestItem of guestCart) {
      const product = await Product.findById(guestItem.productID);
      if (!product || product.stock < 1) continue;

      const existingItem = cart.products.find(
        (item) =>
          item.product.toString() === guestItem.productID &&
          item.size === guestItem.size
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + guestItem.quantity,
          product.stock
        );
      } else {
        cart.products.push({
          product: guestItem.productID,
          quantity: Math.min(guestItem.quantity, product.stock),
          size: guestItem.size,
          priceSnapshot: product.sellingPrice
        });
      }
    }

    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await cart.populate(
      "products.product",
      "title sellingPrice images stock"
    );

    res.json(populatedCart.products);
  } catch (error) {
    res.status(500).json({ message: "Sync failed", error });
  }
};

// ========================
//  Common Cart Actions
// ========================

const removeFromCart = async (req, res) => {
  try {
    const { productID, size } = req.query;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: { product: productID, size } } },
      { new: true }
    );

    if (!cart) return res.json([]);

    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await cart.populate(
      "products.product",
      "title sellingPrice images stock"
    );

    res.json(populatedCart.products);
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { products: [], totalPrice: 0 },
      { new: true }
    );

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

module.exports = {
  getDbCart,
  addToDbCart,
  syncGuestCart,
  removeFromCart,
  clearCart
};
