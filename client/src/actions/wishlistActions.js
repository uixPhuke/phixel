import axios from 'axios';
import {
  wishlistRequest,
  getWishlistSuccess,
  addToWishlistSuccess,
  removeFromWishlistSuccess,
  syncWishlistSuccess,
  wishlistFail
} from '../slices/wishlistSlice';
import { setShowLoginModalTrue } from "../slices/userSlice";
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_KEY;

// Helper function to get auth config
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
});

// Action to get user's wishlist
export const getWishlist = () => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(wishlistFail('No authentication token found'));
      return;
    }

    const { data } = await axios.get(`${API_URL}/wishlist`, getAuthConfig());
    dispatch(getWishlistSuccess(data));
  } catch (err) {
    console.error('Get Wishlist Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to fetch wishlist. Please try again later.';
    
    dispatch(wishlistFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};

// Action to add item to wishlist
export const addToWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(wishlistFail('No authentication token found'));
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to add items to your wishlist");
      return;
    }

    const { data } = await axios.post(
      `${API_URL}/wishlist/add`,
      { productId },
      getAuthConfig()
    );

    dispatch(addToWishlistSuccess(data.products));
    
    if (data.message === 'Product already in wishlist') {
      toast.success('Product is already in your wishlist!');
    } else {
      toast.success('Product added to wishlist successfully!');
    }
  } catch (err) {
    console.error('Add to Wishlist Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to add item to wishlist. Please try again.';
    
    dispatch(wishlistFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to add items to your wishlist");
    } else if (err.response?.status === 404) {
      toast.error('Product not found');
    } else {
      toast.error(errorMessage);
    }
  }
};

// Action to remove item from wishlist
export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(wishlistFail('No authentication token found'));
      return;
    }

    const { data } = await axios.delete(
      `${API_URL}/wishlist/${productId}`,
      getAuthConfig()
    );

    dispatch(removeFromWishlistSuccess(data.products));
    toast.success('Product removed from wishlist successfully!');
  } catch (err) {
    console.error('Remove from Wishlist Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to remove item from wishlist. Please try again.';
    
    dispatch(wishlistFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    } else if (err.response?.status === 404) {
      toast.error('Wishlist not found');
    }
  }
};

// Action to sync guest wishlist with user wishlist
export const syncGuestWishlist = (guestWishlistItems) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(wishlistFail('No authentication token found'));
      return;
    }

    const { data } = await axios.post(
      `${API_URL}/wishlist/sync`,
      { guestWishlist: guestWishlistItems },
      getAuthConfig()
    );

    dispatch(syncWishlistSuccess(data.products));
    
    if (guestWishlistItems.length > 0) {
      toast.success('Wishlist synced successfully!');
    }
  } catch (err) {
    console.error('Sync Wishlist Error:', err);
    
    const errorMessage = err.response?.data?.message || 
                         'Failed to sync wishlist. Please try again.';
    
    dispatch(wishlistFail(errorMessage));
    
    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};

// Action to check if a product is in wishlist
export const isInWishlist = (productId) => (_, getState) => {
  const { wishlistItems } = getState().wishlist;
  return wishlistItems.some(item => item._id === productId);
};

// Action to toggle wishlist item (add if not present, remove if present)
export const toggleWishlistItem = (productId) => async (dispatch, getState) => {
  const { wishlistItems } = getState().wishlist;
  const isCurrentlyInWishlist = wishlistItems.some(item => item._id === productId);
  
  if (isCurrentlyInWishlist) {
    await dispatch(removeFromWishlist(productId));
  } else {
    await dispatch(addToWishlist(productId));
  }
};