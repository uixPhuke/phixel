import axios from "axios";
import {
  cartRequest,
  getCartSuccess,
  addToCartSuccess,
  syncCartSuccess,
  removeFromCartSuccess,
  clearCartSuccess,
  cartFail,
  clearGuestCart,
} from "../slices/cartSlice";
import { setShowLoginModalTrue } from "../slices/userSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_KEY;

/* ================================
   GET CART (AUTO SYNC ON LOGIN)
================================ */
export const getCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const { data } = await axios.get(`${API_URL}/api/v4/cart`, {
      withCredentials: true,
    });

    dispatch(getCartSuccess(data));
  } catch (err) {
    dispatch(
      cartFail(err.response?.data?.message || "Failed to fetch cart")
    );
  }
};

/* ================================
   ADD TO CART (LOGGED-IN)
================================ */
export const addToCart = (productData) => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
};

    const { data } = await axios.post(
      `${API_URL}/api/v4/cart`,
      productData,
      config
    );

    dispatch(addToCartSuccess(data));
    toast.success("Item added to cart");
  } catch (err) {
    dispatch(
      cartFail(err.response?.data?.message || "Failed to add item")
    );

    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    } else {
      toast.error(err.response?.data?.message || "Add to cart failed");
    }
  }
};

/* ================================
   SYNC GUEST CART (MANUAL)
================================ */
export const syncGuestCart = (guestCartItems) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    console.log("SYNCING CART:", guestCartItems);

    const token = localStorage.getItem("token");
   

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
};

    const { data } = await axios.post(
      `${API_URL}/api/v4/cart/sync`,
      { guestCart: guestCartItems },
      config
    );

    dispatch(syncCartSuccess(data));   // ✅ DB cart updated
    dispatch(clearGuestCart());        // ✅ CLEAR GUEST CART
    
    //localStorage.removeItem("guestCart"); // ✅ SAFETY
 //dispatch(getCart());
  } catch (err) {
    dispatch(cartFail("Failed to sync cart"));
  }
};


/* ================================
   REMOVE ITEM (PRODUCT + SIZE)
================================ */
export const removeFromCart = (productID, size) => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
};

    const { data } = await axios.delete(
      `${API_URL}/api/v4/cart?productID=${productID}&size=${size}`,
      config
    );

    dispatch(removeFromCartSuccess(data));
    toast.success("Item removed from cart");
  } catch (err) {
    dispatch(
      cartFail(err.response?.data?.message || "Remove failed")
    );
  }
};

/* ================================
   CLEAR CART (DB)
================================ */
export const clearCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());

 const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
};
    await axios.delete(`${API_URL}/api/v4/cart`, config);

    dispatch(clearCartSuccess());
    toast.success("Cart cleared");
  } catch (err) {
    dispatch(
      cartFail(err.response?.data?.message || "Clear cart failed")
    );
  }
};
