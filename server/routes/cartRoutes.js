const express = require('express');
const router = express.Router();

const {
  getDbCart,
  addToDbCart,
  syncGuestCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartCtrl');

const { isAuthenticated } = require('../middlewares/auth');

// ========================
//  Logged-in User Cart
// ========================

// Route to get user's cart from DB
router.get('/', isAuthenticated, getDbCart);

// Route to add item to user's cart in DB
router.post('/', isAuthenticated, addToDbCart);

// Route to remove item from user's cart in DB (by productID + size via query)
router.delete('/:productID', isAuthenticated, removeFromCart);

// Route to clear user's cart in DB
router.delete('/', isAuthenticated, clearCart);

// ========================
//  Guest → User Cart Sync
// ========================

// Route to sync guest cart with user's DB cart (ON LOGIN)
router.post('/sync', isAuthenticated, syncGuestCart);

// Export the router
module.exports = router;
