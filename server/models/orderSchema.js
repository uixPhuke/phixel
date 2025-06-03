const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    items:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Ensure quantity is at least 1
        },
        price: {
            type: Number,
            required: true,
        },
    

    }],
    isPaymentDone: {
        type: Boolean,
        default: false, // Default to false, indicating payment not done
    },
    paymentId: {
        type: String,
        required: false, // Optional, only if payment is done
    },
    totalAmount: {
        type: Number,
        required: true, // Total amount for the order
        min: 0, // Ensure total amount is non-negative
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending', // Default to pending status
    },
    orderDate: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
    trackingNumber: {
        type: String,
        required: false, // Optional, can be set later
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'debit card', 'UPI', 'net banking', 'cash on delivery', 'razorpay'],
        required: true, // Specify the payment method
        default: 'cash on delivery', // Default to cash on delivery
    },
    estimateDeliveryDate: {
        type: Date,
        required: false, // Optional, can be set later
    },
    isDelivered: {
        type: Boolean,
        default: false, // Default to false, indicating not delivered
    },
      //  New Fields for Return & Refund
      returnReason: { type: String }, // Store reason for return
      returnRequestedAt: { type: Date }, // Timestamp when return was requested
      returnStatus: {
          type: String,
          enum: ['pending', 'approved', 'rejected', 'completed'],
          default: null, // No return by default
          index: true,
      },
      refundStatus: {
          type: String,
          enum: ['pending', 'processed', 'failed'],
          default: null,
      },
      refundAmount: { type: Number }, // Amount to be refunded (if applicable)
    }, {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        versionKey: false, // Disable versioning (__v field)
    
    })
  
  orderSchema.index({ userId: 1, orderStatus: 1 });
  orderSchema.index({ orderStatus: 1, placedAt: -1 });
  orderSchema.index({ deliveryStatus: 1 });
  orderSchema.index({ placedAt: 1 });
  orderSchema.index({ returnStatus: 1 }); // Faster return queries
