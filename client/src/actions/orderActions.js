import axios from 'axios';
import {
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
  orderFail
} from '../slices/orderSlice';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_KEY;

// Helper function to get auth config
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
});

// Action to create order (Razorpay integration)
export const createOrder = (cartId, addressId, paymentData) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.post(
      `${API_URL}/order/${cartId}/${addressId}`,
      paymentData,
      getAuthConfig()
    );

    if (data.razorpayOrder) {
      // Razorpay order created, return order data for payment
      dispatch(createOrderSuccess(data));
      return data.razorpayOrder;
    } else {
      // Order created directly (COD or other methods)
      dispatch(confirmOrderSuccess(data.order));
      toast.success('Order created successfully!');
      return data.order;
    }
  } catch (err) {
    console.error('Create Order Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Failed to create order. Please try again.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
    throw errorMessage;
  }
};

// Action to confirm order after Razorpay payment
export const confirmOrder = (cartId, addressId, razorpayData) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.post(
      `${API_URL}/order/${cartId}/${addressId}`,
      {
        ...razorpayData,
        paymentMethod: 'razorpay'
      },
      getAuthConfig()
    );

    dispatch(confirmOrderSuccess(data.order));
    toast.success('Order confirmed successfully!');
    return data.order;
  } catch (err) {
    console.error('Confirm Order Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to confirm order. Please try again.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
    throw errorMessage;
  }
};

// Action to get user orders
export const getUserOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/user`,
      getAuthConfig()
    );

    dispatch(getUserOrdersSuccess(data.orders));
  } catch (err) {
    console.error('Get User Orders Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch orders. Please try again.';
    
    dispatch(orderFail(errorMessage));
    
    if (err.response?.status !== 404) {
      toast.error(errorMessage);
    }
  }
};

// Action to get specific order by ID
export const getOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/user/${orderId}`,
      getAuthConfig()
    );

    dispatch(getOrderByIdSuccess(data.orders[0]));
  } catch (err) {
    console.error('Get Order By ID Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch order details.';
    
    dispatch(orderFail(errorMessage));
    
    if (err.response?.status === 404) {
      toast.error('Order not found');
    }
  }
};

// Admin: Get all orders
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/admin`,
      getAuthConfig()
    );

    dispatch(getAllOrdersSuccess(data.orders));
  } catch (err) {
    console.error('Get All Orders Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch orders.';
    
    dispatch(orderFail(errorMessage));
    
    if (err.response?.status === 401) {
      toast.error('Unauthorized access');
    }
  }
};

// Admin: Get order by ID
export const getAdminOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/admin/${orderId}`,
      getAuthConfig()
    );

    dispatch(getAdminOrderByIdSuccess(data.order));
  } catch (err) {
    console.error('Get Admin Order Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch order details.';
    
    dispatch(orderFail(errorMessage));
    
    if (err.response?.status === 404) {
      toast.error('Order not found');
    }
  }
};

// Admin: Update order status
export const updateOrderStatus = (orderId, statusData) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/admin/status/${orderId}`,
      statusData,
      getAuthConfig()
    );

    dispatch(updateOrderStatusSuccess(data.order));
    toast.success('Order status updated successfully!');
  } catch (err) {
    console.error('Update Order Status Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to update order status.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to cancel order
export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/cancel/${orderId}`,
      {},
      getAuthConfig()
    );

    dispatch(cancelOrderSuccess(data.order));
    toast.success('Order cancelled successfully!');
  } catch (err) {
    console.error('Cancel Order Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to cancel order.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to request return
export const requestReturn = (orderId, returnReason) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/return/${orderId}`,
      { returnReason },
      getAuthConfig()
    );

    dispatch(requestReturnSuccess(data.order));
    toast.success('Return request submitted successfully!');
  } catch (err) {
    console.error('Request Return Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to submit return request.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin: Update return status
export const updateReturnStatus = (orderId, returnStatus) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/admin/return/${orderId}`,
      { returnStatus },
      getAuthConfig()
    );

    dispatch(updateReturnStatusSuccess(data.order));
    toast.success(`Return request ${returnStatus} successfully!`);
  } catch (err) {
    console.error('Update Return Status Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to update return status.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin: Process refund
export const processRefund = (orderId, refundStatus) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/admin/refund/${orderId}`,
      { refundStatus },
      getAuthConfig()
    );

    dispatch(processRefundSuccess(data.order));
    toast.success(`Refund ${refundStatus} successfully!`);
  } catch (err) {
    console.error('Process Refund Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to process refund.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Action to get user return orders
export const getUserReturnOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/user/returns`,
      getAuthConfig()
    );

    dispatch(getUserReturnOrdersSuccess(data.returnOrders));
  } catch (err) {
    console.error('Get User Return Orders Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch return orders.';
    
    dispatch(orderFail(errorMessage));
  }
};

// Admin: Get all return orders
export const getAllReturnOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API_URL}/order/admin/returns/all`,
      getAuthConfig()
    );

    dispatch(getAllReturnOrdersSuccess(data.returnOrders));
  } catch (err) {
    console.error('Get All Return Orders Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to fetch return orders.';
    
    dispatch(orderFail(errorMessage));
  }
};

// Action to delete order
export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.delete(
      `${API_URL}/order/${orderId}`,
      getAuthConfig()
    );

    dispatch(deleteOrderSuccess(orderId));
    toast.success('Order deleted successfully!');
  } catch (err) {
    console.error('Delete Order Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to delete order.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Admin: Process cancelled refund
export const processCancelledRefund = (orderId, refundStatus) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API_URL}/order/admin/refund/cancelled/${orderId}`,
      { refundStatus },
      getAuthConfig()
    );

    dispatch(processCancelledRefundSuccess(data.order));
    toast.success(`Refund ${refundStatus} successfully!`);
  } catch (err) {
    console.error('Process Cancelled Refund Error:', err);
    
    const errorMessage = err.response?.data?.error || 
                         'Failed to process refund.';
    
    dispatch(orderFail(errorMessage));
    toast.error(errorMessage);
  }
};

// Helper action to clear order state
export const clearOrder = () => (dispatch) => {
  dispatch(clearOrderState());
};

// Helper action to clear orders list
export const clearOrders = () => (dispatch) => {
  dispatch(clearOrdersState());
};

// Helper action to clear admin orders
export const clearAdminOrders = () => (dispatch) => {
  dispatch(clearAdminOrdersState());
};