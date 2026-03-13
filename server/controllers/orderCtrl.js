const mongoose=require('mongoose')
const Order= require("../models/orderSchema.js");
const User =require("../models/userSchema.js");
const Cart =require("../models/cartSchema.js");
const Address =require("../models/addressSchema.js");
const Razorpay =require("../config/razorpay.js");
const crypto =require("crypto");
const Discount =require("../models/discountSchema.js");
const Product =require("../models/productSchema.js");

const {
    sendOrderCancellationEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendReturnRequestEmailToAdmin,
    sendReturnStatusEmailToUser,
    sendRefundStatusEmailToUser,
} =require("../services/orderEmailService.js");

// Utility functions
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class orderCtrl {
    // Create order with Razorpay integration
    createOrder = async (req, res) => {
        try {
            const userId = req.user._id;
            const {
                paymentMethod,
                razorpayPaymentId,
                razorpayOrderId,
                razorpaySignature,
            } = req.body;
            const { cartId, addressId } = req.params;

            const conversionRate = req.conversionRate;
            const currency = req.currency;

            // Validate IDs
            if (!isValidObjectId(cartId) || !isValidObjectId(addressId)) {
                return res.status(400).json({ error: "Invalid cart or address ID" });
            }

            // Fetch cart and address
            const cart = await Cart.findById(cartId).populate("items.productID");
            if (!cart || cart.items.length === 0) {
                return res.status(404).json({ error: "Cart not found or is empty" });
            }

            const address = await Address.findById(addressId);
            if (!address) {
                return res.status(404).json({ error: "Address not found" });
            }

            // Calculate amounts
            let totalAmount = cart.totalCartPrice * conversionRate;
            let deliveryCharge = totalAmount > 500 ? 0 : 10;
            let finalAmount = totalAmount + deliveryCharge;

            let discount = null;

            // Check discount application
            if (cart.discountApplied && cart.discountApplied.code) {
                const { code, discountPercentage, discountAmount } = cart.discountApplied;

                const existingOrderWithDiscount = await Order.findOne({
                    userId,
                    "discount.code": code,
                });

                if (existingOrderWithDiscount) {
                    return res.status(400).json({ error: "You have already used this discount code." });
                }

                discount = {
                    code,
                    discountPercentage,
                    discountAmount: (discountAmount * conversionRate).toFixed(2),
                };
            }

            // Create Razorpay order if not already created
            if (!razorpayOrderId) {
                const razorpayOrder = await Razorpay.orders.create({
                    amount: Math.round(finalAmount * 100),
                    currency,
                    receipt: `order_${Date.now()}`,
                    payment_capture: 1,
                });

                if (!razorpayOrder) {
                    return res.status(500).json({ error: "Failed to create Razorpay order" });
                }

                return res.status(201).json({
                    message: "Razorpay order created successfully. Please proceed with the payment.",
                    razorpayOrder,
                });
            }

            // Verify payment
            const paymentDetails = await Razorpay.payments.fetch(razorpayPaymentId);
            if (!paymentDetails || paymentDetails.status !== "captured" || paymentDetails.order_id !== razorpayOrderId) {
                return res.status(400).json({ error: "Payment verification failed" });
            }

            // Verify signature
            const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex");

            if (generatedSignature !== razorpaySignature) {
                return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
            }

            // Create order
            const newOrder = new Order({
                userId,
                cart: cartId,
                shippingAddress: addressId,
                items: cart.items.map((item) => ({
                    product: item.productID._id,
                    quantity: item.quantity,
                    price: (item.productID.sellingPrice * conversionRate).toFixed(2),
                })),
                totalAmount: totalAmount.toFixed(2),
                isPaymentDone: true,
                orderStatus: "processing",
                paymentMethod,
                paymentId: razorpayPaymentId,
                estimateDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            });

            const savedOrder = await newOrder.save();

            // Update product stock
            for (const item of cart.items) {
                const product = await Product.findById(item.productID._id);
                if (!product) continue;

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        error: `Insufficient stock for product: ${product.title}`,
                    });
                }

                product.stock -= item.quantity;
                await product.save();
            }

            // Send confirmation email
            await sendOrderConfirmationEmail(req.user.email, savedOrder);

            // Clear cart
            cart.items = [];
            cart.totalCartPrice = 0;
            cart.discountApplied = null;
            await cart.save();

            // Mark discount as used
            if (discount) {
                const discountRecord = await Discount.findOne({ code: discount.code });
                if (discountRecord) {
                    discountRecord.usedBy.push(userId);
                    await discountRecord.save();
                }
            }

            res.status(201).json({
                message: "Order created successfully",
                order: savedOrder,
            });
        } catch (error) {
            console.error("Create order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Get user orders
    getOrdersByUser = async (req, res) => {
        try {
            const userId = req.user._id;
            const orders = await Order.find({ userId })
                .populate("userId")
                .populate("shippingAddress");

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Get user orders error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Get specific user order
    getOrderById = async (req, res) => {
        try {
            const userId = req.user._id;
            const orderId = req.params.orderId;

            let query = { userId };
            if (orderId) query._id = orderId;

            const orders = await Order.find(query)
                .populate("userId")
                .populate("shippingAddress");

            if (!orders.length) {
                return res.status(404).json({ message: "No orders found" });
            }

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Get order by ID error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Admin: Get all orders
    getAllOrders = async (req, res) => {
        try {
            const orders = await Order.find({})
                .populate("userId")
                .populate("shippingAddress");

            res.status(200).json({ orders });
        } catch (error) {
            console.error("Get all orders error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Admin: Get order by ID
    getOrderAdminById = async (req, res) => {
        try {
            const { orderId } = req.params;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            const order = await Order.findById(orderId)
                .populate("userId")
                .populate("shippingAddress");

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            res.status(200).json({ order });
        } catch (error) {
            console.error("Get admin order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Admin: Update order status
    updateOrderStatus = async (req, res) => {
        try {
            const { orderId } = req.params;
            const { orderStatus, trackingNumber, estimateDeliveryDate } = req.body;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            const user = await User.findById(order.userId);
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            // Update fields
            if (orderStatus) order.orderStatus = orderStatus;
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (estimateDeliveryDate) {
                const parsedDate = new Date(estimateDeliveryDate);
                if (isNaN(parsedDate.getTime())) {
                    return res.status(400).json({ error: "Invalid date format" });
                }
                order.estimateDeliveryDate = parsedDate;
            }

            // Auto-update delivery status
            if (orderStatus === "delivered") {
                order.isDelivered = true;
            }

            const updatedOrder = await order.save();

            // Send status update email
            await sendOrderStatusUpdateEmail(user.email, updatedOrder);

            res.status(200).json({
                message: "Order updated successfully",
                order: updatedOrder,
            });
        } catch (error) {
            console.error("Update order status error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Cancel order
    cancelOrder = async (req, res) => {
        try {
            const userId = req.user._id;
            const { orderId } = req.params;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            if (order.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            if (order.orderStatus === "cancelled") {
                return res.status(400).json({ error: "Order already cancelled" });
            }

            if (!["pending", "processing"].includes(order.orderStatus)) {
                return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
            }

            order.orderStatus = "cancelled";
            order.refundStatus = "pending";

            await order.save();
            await sendOrderCancellationEmail(req.user.email, order);

            res.status(200).json({
                message: "Order cancelled successfully",
                order,
            });
        } catch (error) {
            console.error("Cancel order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Request return
    requestReturn = async (req, res) => {
        try {
            const userId = req.user._id;
            const { orderId } = req.params;
            const { returnReason } = req.body;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            if (!returnReason?.trim()) {
                return res.status(400).json({ error: "Return reason is required" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            if (order.userId.toString() !== userId.toString()) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            if (order.orderStatus !== "delivered") {
                return res.status(400).json({ error: "Order must be delivered to request return" });
            }

            const deliveredDate = new Date(order.updatedAt);
            const daysSinceDelivery = (new Date() - deliveredDate) / (1000 * 60 * 60 * 24);

            if (daysSinceDelivery > 7) {
                return res.status(400).json({ error: "Return period (7 days) has expired" });
            }

            if (order.returnStatus && order.returnStatus !== "none") {
                return res.status(400).json({ error: "Return request already submitted" });
            }

            order.returnReason = returnReason;
            order.returnRequestedAt = new Date();
            order.returnStatus = "pending";

            await order.save();

            const user = await User.findById(userId);
            if (user) {
                await sendReturnRequestEmailToAdmin(user, order);
            }

            res.status(200).json({
                message: "Return request submitted successfully",
                order,
            });
        } catch (error) {
            console.error("Request return error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Admin: Update return status
    updateReturnStatus = async (req, res) => {
        try {
            const { orderId } = req.params;
            const { returnStatus } = req.body;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            if (!["approved", "rejected"].includes(returnStatus)) {
                return res.status(400).json({ error: "Invalid return status" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            if (order.returnStatus !== "pending") {
                return res.status(400).json({ error: "Return request already processed" });
            }

            order.returnStatus = returnStatus;

            if (returnStatus === "approved") {
                order.orderStatus = "cancelled";
                order.refundStatus = "pending";
                order.refundAmount = order.totalAmount;
            }

            await order.save();

            const user = await User.findById(order.userId);
            if (user) {
                await sendReturnStatusEmailToUser(user, order);
            }

            res.status(200).json({
                message: `Return request ${returnStatus} successfully`,
                order,
            });
        } catch (error) {
            console.error("Update return status error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Process refund
    processRefund = async (req, res) => {
        try {
            const { orderId } = req.params;
            const { refundStatus } = req.body;

            if (!isValidObjectId(orderId)) {
                return res.status(400).json({ error: "Invalid order ID" });
            }

            if (!["processed", "failed"].includes(refundStatus)) {
                return res.status(400).json({ error: "Invalid refund status" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            if (order.returnStatus !== "approved") {
                return res.status(400).json({ error: "Return not approved" });
            }

            if (order.refundStatus !== "pending") {
                return res.status(400).json({ error: "Refund already processed" });
            }

            order.refundStatus = refundStatus;
            await order.save();

            const user = await User.findById(order.userId);
            if (user) {
                await sendRefundStatusEmailToUser(user, order);
            }

            res.status(200).json({
                message: `Refund ${refundStatus} successfully`,
                order,
            });
        } catch (error) {
            console.error("Process refund error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Get user return orders
    getUserReturnOrders = async (req, res) => {
        try {
            const userId = req.user._id;

            const returnOrders = await Order.find({
                userId,
                returnStatus: { $in: ["pending", "approved", "rejected"] },
            }).sort({ returnRequestedAt: -1 });

            if (!returnOrders.length) {
                return res.status(404).json({ message: "No return orders found" });
            }

            res.status(200).json({ returnOrders });
        } catch (error) {
            console.error("Get user return orders error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Admin: Get all return orders
    getAllReturnOrders = async (req, res) => {
        try {
            const returnOrders = await Order.find({
                returnStatus: { $in: ["pending", "approved", "rejected"] },
            })
                .populate("userId", "name email")
                .sort({ returnRequestedAt: -1 });

            if (!returnOrders.length) {
                return res.status(404).json({ message: "No return orders found" });
            }

            res.status(200).json({ returnOrders });
        } catch (error) {
            console.error("Get all return orders error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
    // Add these methods to the OrderController class

    // Delete order
    deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!isValidObjectId(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ 
            message: "Order deleted successfully", 
            order: deletedOrder 
        });
    } catch (error) {
        console.error("Delete order error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    };

        // Process refund for cancelled orders (specific to cancelled orders)
    processCancelledRefund = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { refundStatus } = req.body;

        if (!isValidObjectId(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        if (!["processed", "failed"].includes(refundStatus)) {
            return res.status(400).json({ error: "Invalid refund status" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.refundStatus && order.refundStatus !== "pending") {
            return res.status(400).json({ error: "Refund is already processed or failed" });
        }

        // Update refund status
        order.refundStatus = refundStatus;
        await order.save();

        // Fetch user details and send email
        const user = await User.findById(order.userId);
        if (user) {
            await sendRefundStatusEmailToUser(user, order);
        }

        res.status(200).json({
            message: `Refund ${refundStatus} successfully`,
            order,
        });
    } catch (error) {
        console.error("Process cancelled refund error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    };
}

module.exports = new orderCtrl();