import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    error: null,
    orders: [], // User orders
    order: null, // Single order
    adminOrders: [], // All orders (admin)
    adminOrder: null, // Single order (admin)
    returnOrders: [], // User return orders
    adminReturnOrders: [], // All return orders (admin)
    razorpayOrder: null, // Razorpay order data
    success: false,
  },
  reducers: {
    // Generic request action
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    
    // Create order success
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.razorpayOrder = action.payload.razorpayOrder;
      state.success = true;
    },
    
    // Confirm order success (after payment)
    confirmOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
      state.razorpayOrder = null;
    },
    
    // Get user orders success
    getUserOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    
    // Get order by ID success
    getOrderByIdSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    
    // Get all orders success (admin)
    getAllOrdersSuccess: (state, action) => {
      state.loading = false;
      state.adminOrders = action.payload;
    },
    
    // Get order by ID success (admin)
    getAdminOrderByIdSuccess: (state, action) => {
      state.loading = false;
      state.adminOrder = action.payload;
    },
    
    // Update order status success
    updateOrderStatusSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.adminOrder = action.payload;
      state.success = true;
    },
    
    // Cancel order success
    cancelOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
    },
    
    // Request return success
    requestReturnSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.success = true;
    },
    
    // Update return status success
    updateReturnStatusSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.adminOrder = action.payload;
      state.success = true;
    },
    
    // Process refund success
    processRefundSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.adminOrder = action.payload;
      state.success = true;
    },
    
    // Get user return orders success
    getUserReturnOrdersSuccess: (state, action) => {
      state.loading = false;
      state.returnOrders = action.payload;
    },
    
    // Get all return orders success (admin)
    getAllReturnOrdersSuccess: (state, action) => {
      state.loading = false;
      state.adminReturnOrders = action.payload;
    },
    
    // Delete order success
    deleteOrderSuccess: (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter(order => order._id !== action.payload);
      state.adminOrders = state.adminOrders.filter(order => order._id !== action.payload);
      state.success = true;
    },
    
    // Process cancelled refund success
    processCancelledRefundSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.adminOrder = action.payload;
      state.success = true;
    },
    
    // Failure action
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    
    // Clear order state
    clearOrderState: (state) => {
      state.order = null;
      state.error = null;
      state.success = false;
      state.razorpayOrder = null;
    },
    
    // Clear orders state
    clearOrdersState: (state) => {
      state.orders = [];
      state.error = null;
    },
    
    // Clear admin orders state
    clearAdminOrdersState: (state) => {
      state.adminOrders = [];
      state.adminOrder = null;
      state.error = null;
    },
    
    // Clear error
    clearOrderError: (state) => {
      state.error = null;
    }
  },
});

export const {
  orderRequest,
  createOrderSuccess,
  confirmOrderSuccess,
  getUserOrdersSuccess,
  getOrderByIdSuccess,
  getAllOrdersSuccess,
  getAdminOrderByIdSuccess,
  updateOrderStatusSuccess,
  cancelOrderSuccess,
  requestReturnSuccess,
  updateReturnStatusSuccess,
  processRefundSuccess,
  getUserReturnOrdersSuccess,
  getAllReturnOrdersSuccess,
  deleteOrderSuccess,
  processCancelledRefundSuccess,
  orderFail,
  clearOrderState,
  clearOrdersState,
  clearAdminOrdersState,
  clearOrderError
} = orderSlice.actions;

export default orderSlice.reducer;