const Wishlist = require('../models/wishlistSchema');
const Product = require('../models/productSchema');

// Get user's wishlist (logged-in)
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products',
        select: '_id name price images slug stock',
        match: { isActive: true } // Only return active products
      });
    
    // Filter out null products (if any were deleted)
    const validProducts = wishlist?.products.filter(p => p) || [];
    
    res.status(200).json(validProducts);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message 
    });
  }
};

// Add to wishlist (logged-in)
const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(200).json({
        success: true,
        message: 'Product already in wishlist',
        products: wishlist.products
      });
    }

    // Add to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      products: wishlist.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

// Remove from wishlist (logged-in)
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });       
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      products: wishlist.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

// Sync guest wishlist (on login)
const syncGuestWishlist = async (req, res) => {
  const { guestWishlist } = req.body;

  try {
    // Verify all products exist
    const validProducts = await Product.find({
      _id: { $in: guestWishlist },
      isActive: true
    }).select('_id');

    const validProductIds = validProducts.map(p => p._id);

    // Get or create user wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ 
        user: req.user._id, 
        products: validProductIds 
      });
    } else {
      // Merge without duplicates
      const newProducts = validProductIds.filter(
        id => !wishlist.products.includes(id)
      );
      wishlist.products.push(...newProducts);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist synced successfully',
      products: wishlist.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to sync wishlist',
      error: error.message
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  syncGuestWishlist
};