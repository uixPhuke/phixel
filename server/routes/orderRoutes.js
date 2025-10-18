const express= require('express');
const orderCtrl =require("../controllers/orderCtrl.js");
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// USER ROUTES (Require authentication)
router.post("/:cartId/:addressId", isAuthenticated, orderCtrl.createOrder);
router.get("/user", isAuthenticated, orderCtrl.getOrdersByUser);
//router.get("/user/:orderId?", isAuthenticated, orderCtrl.getOrderById);

// Get specific order by ID
router.get("/user/:orderId", isAuthenticated, orderCtrl.getOrderById);

router.put("/cancel/:orderId", isAuthenticated, orderCtrl.cancelOrder);
router.put("/return/:orderId", isAuthenticated, orderCtrl.requestReturn);
router.get("/user/returns", isAuthenticated, orderCtrl.getUserReturnOrders);
router.delete("/:orderId", isAuthenticated, orderCtrl.deleteOrder); 

//  ADMIN ROUTES (Require authentication + admin privileges)
router.get("/admin", isAuthenticated, isAdmin, orderCtrl.getAllOrders);
router.get("/admin/:orderId", isAuthenticated, isAdmin, orderCtrl.getOrderAdminById);
router.put("/admin/status/:orderId", isAuthenticated, isAdmin, orderCtrl.updateOrderStatus);
router.put("/admin/return/:orderId", isAuthenticated, isAdmin, orderCtrl.updateReturnStatus);
router.put("/admin/refund/:orderId", isAuthenticated, isAdmin, orderCtrl.processRefund);
router.put("/admin/refund/cancelled/:orderId", isAuthenticated, isAdmin, orderCtrl.processCancelledRefund); 
router.get("/admin/returns/all", isAuthenticated, isAdmin, orderCtrl.getAllReturnOrders);

module.exports = router;