const express = require('express');
const router = express.Router();

const {
  createProductAdmin,
  editProductAdmin,
  deleteProductAdmin,
  getProductsAdmin,
  getProductAdmin,
  getAllProducts,
  getProduct
} = require('../controllers/productCtrl');

const uploadMiddleware = require('../middlewares/upload.middleware'); // ✅ now a real middleware
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
// Route to create a new product (admin only)

router
  .route('/admin/product/create')
  .post(isAuthenticated, isAdmin, uploadMiddleware, createProductAdmin);
// Route to edit an existing product (admin only)
router
  .route('/admin/product/:id')
  .put(isAuthenticated, isAdmin, uploadMiddleware, editProductAdmin);

router.get('/admin/products', isAuthenticated, isAdmin, getProductsAdmin);
router.delete('/admin/product/delete/:productID', isAuthenticated, isAdmin, deleteProductAdmin);
router.get('/admin/product/:productID', isAuthenticated, isAdmin, getProductAdmin);

router.get('/product/:productID', isAuthenticated, getProduct);
router.get('/products', isAuthenticated, getAllProducts);

module.exports = router;

