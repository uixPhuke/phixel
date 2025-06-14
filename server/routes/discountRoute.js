const express = require('express');
const router = express.Router();
const { createDiscount, applyDiscount,removeDiscount,checkDiscount} = require('../controllers/discountCtrl');
const { isAuthenticated,isAdmin } = require('../middlewares/auth');
// Route to create a new discount
router.post('/discount', isAuthenticated,isAdmin, createDiscount);
// Route to apply a discount to the user's cart
router.post('/discount/apply', isAuthenticated, applyDiscount);
// Route to remove a discount from the user's cart
router.post('/discount/remove', isAuthenticated,isAdmin, removeDiscount);
// Route to check if a discount is valid
router.post('/discount/check', isAuthenticated, checkDiscount);
// Export the router
module.exports = router;
