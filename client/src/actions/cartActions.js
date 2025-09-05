import axios from 'axios';
import {
  cartRequest,
  getCartSuccess,
  addToCartSuccess,
  syncCartSuccess,
  removeFromCartSuccess,
  clearCartSuccess,
  cartFail,
} from '../slices/cartSlice';
import { setShowLoginModalTrue } from "../slices/userSlice";
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_KEY;

// Action to get user's cart
export const getCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(cartFail('No authentication token found'));
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/v3/cart`, config);
    dispatch(getCartSuccess(data));
  } catch (err) {
    console.error('Get Cart Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch the cart. Please try again later.';
    
    dispatch(cartFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to view your cart");
    }
  }
};

// Action to add item to cart
export const addToCart = (productData) => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(cartFail('No authentication token found'));
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to add items to your cart");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/api/v3/cart`, productData, config);
    dispatch(addToCartSuccess(data));
    toast.success('Item added to cart successfully!');
  } catch (err) {
    console.error('Add to Cart Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to add item to cart. Please try again.';
    
    dispatch(cartFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to add items to your cart");
    } else if (err.response?.status === 400) {
      // Handle insufficient stock error
      toast.error(errorMessage);
    } else {
      toast.error('Failed to add item to cart. Please try again.');
    }
  }
};

// Action to sync guest cart with user cart
export const syncGuestCart = (guestCartItems) => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(cartFail('No authentication token found'));
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v3/cart/sync`, 
      { guestCart: guestCartItems }, 
      config
    );
    
    dispatch(syncCartSuccess(data));
    if (guestCartItems.length > 0) {
      toast.success('Cart synced successfully!');
    }
  } catch (err) {
    console.error('Sync Cart Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to sync cart. Please try again.';
    
    dispatch(cartFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};

// Action to remove item from cart
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(cartFail('No authentication token found'));
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/v3/cart/${productId}`, 
      config
    );
    
    dispatch(removeFromCartSuccess(data));
    toast.success('Item removed from cart successfully!');
  } catch (err) {
    console.error('Remove from Cart Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to remove item from cart. Please try again.';
    
    dispatch(cartFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};

// Action to clear entire cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(cartFail('No authentication token found'));
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${API_URL}/api/v3/cart`, config);
    dispatch(clearCartSuccess(data));
    toast.success('Cart cleared successfully!');
  } catch (err) {
    console.error('Clear Cart Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to clear cart. Please try again.';
    
    dispatch(cartFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};