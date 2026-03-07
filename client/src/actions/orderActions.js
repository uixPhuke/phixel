import axios from "axios";
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
} from "../slices/orderSlice";

import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_KEY;

const config = {
  withCredentials: true
};


// =========================
// CREATE ORDER
// =========================

export const createOrder = (cartId, addressId, paymentData) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await axios.post(
      `${API}/api/v6/order/${cartId}/${addressId}`,
      paymentData,
      config
    );

    if (data.razorpayOrder) {
      dispatch(createOrderSuccess(data));
      return data.razorpayOrder;
    } else {
      dispatch(confirmOrderSuccess(data.order));
      toast.success("Order created successfully!");
      return data.order;
    }

  } catch (err) {

    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to create order.";

    dispatch(orderFail(message));
    toast.error(message);
    throw message;
  }
};


// =========================
// CONFIRM ORDER (RAZORPAY)
// =========================

export const confirmOrder = (cartId, addressId, razorpayData) => async (dispatch) => {
  try {

    dispatch(orderRequest());

    const { data } = await axios.post(
      `${API}/api/v6/order/${cartId}/${addressId}`,
      {
        ...razorpayData,
        paymentMethod: "razorpay"
      },
      config
    );

    dispatch(confirmOrderSuccess(data.order));

    toast.success("Order confirmed successfully!");

    return data.order;

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to confirm order.";

    dispatch(orderFail(message));
    toast.error(message);
    throw message;
  }
};


// =========================
// GET USER ORDERS
// =========================

export const getUserOrders = () => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/user`,
      config
    );

    dispatch(getUserOrdersSuccess(data.orders));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch orders.";

    dispatch(orderFail(message));

    if (err.response?.status !== 404) {
      toast.error(message);
    }
  }
};


// =========================
// GET ORDER BY ID
// =========================

export const getOrderById = (orderId) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/user/${orderId}`,
      config
    );

    dispatch(getOrderByIdSuccess(data.orders[0]));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch order details.";

    dispatch(orderFail(message));

    if (err.response?.status === 404) {
      toast.error("Order not found");
    }
  }
};


// =========================
// ADMIN: GET ALL ORDERS
// =========================

export const getAllOrders = () => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/admin`,
      config
    );

    dispatch(getAllOrdersSuccess(data.orders));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch orders.";

    dispatch(orderFail(message));

    if (err.response?.status === 401) {
      toast.error("Unauthorized access");
    }
  }
};


// =========================
// ADMIN: GET ORDER BY ID
// =========================

export const getAdminOrderById = (orderId) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/admin/${orderId}`,
      config
    );

    dispatch(getAdminOrderByIdSuccess(data.order));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch order details.";

    dispatch(orderFail(message));

    if (err.response?.status === 404) {
      toast.error("Order not found");
    }
  }
};


// =========================
// ADMIN: UPDATE ORDER STATUS
// =========================

export const updateOrderStatus = (orderId, statusData) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/admin/status/${orderId}`,
      statusData,
      config
    );

    dispatch(updateOrderStatusSuccess(data.order));

    toast.success("Order status updated successfully!");

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to update order status.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// CANCEL ORDER
// =========================

export const cancelOrder = (orderId) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/cancel/${orderId}`,
      {},
      config
    );

    dispatch(cancelOrderSuccess(data.order));

    toast.success("Order cancelled successfully!");

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to cancel order.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// REQUEST RETURN
// =========================

export const requestReturn = (orderId, returnReason) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/return/${orderId}`,
      { returnReason },
      config
    );

    dispatch(requestReturnSuccess(data.order));

    toast.success("Return request submitted successfully!");

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to submit return request.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// USER RETURN ORDERS
// =========================

export const getUserReturnOrders = () => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/user/returns`,
      config
    );

    dispatch(getUserReturnOrdersSuccess(data.returnOrders));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch return orders.";

    dispatch(orderFail(message));
  }
};


// =========================
// ADMIN: GET ALL RETURNS
// =========================

export const getAllReturnOrders = () => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.get(
      `${API}/api/v6/order/admin/returns/all`,
      config
    );

    dispatch(getAllReturnOrdersSuccess(data.returnOrders));

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to fetch return orders.";

    dispatch(orderFail(message));
  }
};


// =========================
// ADMIN: UPDATE RETURN STATUS
// =========================

export const updateReturnStatus = (orderId, returnStatus) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/admin/return/${orderId}`,
      { returnStatus },
      config
    );

    dispatch(updateReturnStatusSuccess(data.order));

    toast.success(`Return request ${returnStatus} successfully!`);

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to update return status.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// ADMIN: PROCESS REFUND
// =========================

export const processRefund = (orderId, refundStatus) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/admin/refund/${orderId}`,
      { refundStatus },
      config
    );

    dispatch(processRefundSuccess(data.order));

    toast.success(`Refund ${refundStatus} successfully!`);

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to process refund.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// ADMIN: PROCESS CANCELLED REFUND
// =========================

export const processCancelledRefund = (orderId, refundStatus) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    const { data } = await axios.put(
      `${API}/api/v6/order/admin/refund/cancelled/${orderId}`,
      { refundStatus },
      config
    );

    dispatch(processCancelledRefundSuccess(data.order));

    toast.success(`Refund ${refundStatus} successfully!`);

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to process refund.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};


// =========================
// DELETE ORDER
// =========================

export const deleteOrder = (orderId) => async (dispatch) => {

  try {

    dispatch(orderRequest());

    await axios.delete(
      `${API}/api/v6/order/${orderId}`,
      config
    );

    dispatch(deleteOrderSuccess(orderId));

    toast.success("Order deleted successfully!");

  } catch (err) {

    const message =
      err.response?.data?.error ||
      "Failed to delete order.";

    dispatch(orderFail(message));
    toast.error(message);
  }
};