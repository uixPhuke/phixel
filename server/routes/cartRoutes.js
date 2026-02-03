const express=require('express');
const router=express.Router();
const { getDbCart,
    addToDbCart,
    syncGuestCart,
    removeFromCart,
    clearCart } = require('../controllers/cartCtrl');
const { isAuthenticated } = require('../middlewares/auth');
// Route to get user's cart from DB
router.get('/cart', isAuthenticated, getDbCart);
// Route to add item to user's cart in DB
router.post('/cart', isAuthenticated, addToDbCart);
// Route to sync guest cart with user's DB cart
router.post('/cart/sync', isAuthenticated, syncGuestCart);
// Route to remove item from user's cart in DB
router.delete('/cart/:productID', isAuthenticated, removeFromCart);
// Route to clear user's cart in DB
router.delete('/cart', isAuthenticated, clearCart);     

// Export the router
module.exports = router;