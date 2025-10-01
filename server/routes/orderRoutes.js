import express from "express";
import OrderController from "../controllers/orderController.js";
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// USER ROUTES (Require authentication)
router.post("/:cartId/:addressId", isAuthenticated, OrderController.createOrder);
router.get("/user", isAuthenticated, OrderController.getOrdersByUser);
router.get("/user/:orderId?", isAuthenticated, OrderController.getOrderById);
router.put("/cancel/:orderId", isAuthenticated, OrderController.cancelOrder);
router.put("/return/:orderId", isAuthenticated, OrderController.requestReturn);
router.get("/user/returns", isAuthenticated, OrderController.getUserReturnOrders);
router.delete("/:orderId", isAuthenticated, OrderController.deleteOrder); 

//  ADMIN ROUTES (Require authentication + admin privileges)
router.get("/admin", isAuthenticated, isAdmin, OrderController.getAllOrders);
router.get("/admin/:orderId", isAuthenticated, isAdmin, OrderController.getOrderAdminById);
router.put("/admin/status/:orderId", isAuthenticated, isAdmin, OrderController.updateOrderStatus);
router.put("/admin/return/:orderId", isAuthenticated, isAdmin, OrderController.updateReturnStatus);
router.put("/admin/refund/:orderId", isAuthenticated, isAdmin, OrderController.processRefund);
router.put("/admin/refund/cancelled/:orderId", isAuthenticated, isAdmin, OrderController.processCancelledRefund); 
router.get("/admin/returns/all", isAuthenticated, isAdmin, OrderController.getAllReturnOrders);

export default router;