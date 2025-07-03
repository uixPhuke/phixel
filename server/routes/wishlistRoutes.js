const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  syncGuestWishlist
} = require('../controllers/wishlistCtrl');
const {isAuthenticated } = require('../middlewares/auth');

// Protected routes (require login)
router.get('/', isAuthenticated, getWishlist);
router.post('/add', isAuthenticated, addToWishlist);
router.delete('/:productId', isAuthenticated, removeFromWishlist);
router.post('/sync', isAuthenticated, syncGuestWishlist);

module.exports = router;