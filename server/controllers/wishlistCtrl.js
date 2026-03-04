const Wishlist = require("../models/wishlistSchema");
const Product = require("../models/productSchema");


// ================= GET WISHLIST =================
const getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: "products",
        select:
          "_id title description sellingPrice totalPrice images sizes color stock",
        match: { active: "active" }
      });

    const products = wishlist?.products.filter(p => p) || [];

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message
    });

  }
};



// ================= ADD TO WISHLIST =================
const addToWishlist = async (req, res) => {

  const { productID } = req.body;

  try {

    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: []
      });
    }

    // safer ObjectId comparison
    const exists = wishlist.products.some(
      id => id.toString() === productID
    );

    if (exists) {

      wishlist = await wishlist.populate({
        path: "products",
        select:
          "_id title description sellingPrice totalPrice images sizes color stock"
      });

      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        products: wishlist.products
      });
    }

    wishlist.products.push(productID);

    await wishlist.save();

    wishlist = await wishlist.populate({
      path: "products",
      select:
        "_id title description sellingPrice totalPrice images sizes color stock"
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      products: wishlist.products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message
    });

  }
};



// ================= REMOVE FROM WISHLIST =================
const removeFromWishlist = async (req, res) => {

  const { productID } = req.params;

  try {

    let wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productID } },
      { new: true }
    ).populate({
      path: "products",
      select:
        "_id title description sellingPrice totalPrice images sizes color stock"
    });

    if (!wishlist) {

      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      products: wishlist.products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message
    });

  }
};



// ================= SYNC GUEST WISHLIST =================
const syncGuestWishlist = async (req, res) => {

  const { guestWishlist } = req.body;

  try {

    const validProducts = await Product.find({
      _id: { $in: guestWishlist },
      active: "active"
    }).select("_id");

    const validIds = validProducts.map(p => p._id);

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {

      wishlist = new Wishlist({
        user: req.user._id,
        products: validIds
      });

    } else {

      const newProducts = validIds.filter(
        id => !wishlist.products.some(
          existing => existing.toString() === id.toString()
        )
      );

      wishlist.products.push(...newProducts);

    }

    await wishlist.save();

    wishlist = await wishlist.populate({
      path: "products",
      select:
        "_id title description sellingPrice totalPrice images sizes color stock"
    });

    res.status(200).json({
      success: true,
      message: "Wishlist synced successfully",
      products: wishlist.products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to sync wishlist",
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