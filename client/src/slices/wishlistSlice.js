import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    loading: false,
    error: null,
    wishlistItems: [], // Array of product objects
    itemCount: 0, // Number of items in wishlist
  },
  reducers: {
    // Request actions
    wishlistRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Get wishlist success
    getWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      state.itemCount = action.payload.length;
    },
    
    // Add to wishlist success
    addToWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      state.itemCount = action.payload.length;
    },
    
    // Remove from wishlist success
    removeFromWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      state.itemCount = action.payload.length;
    },
    
    // Sync wishlist success
    syncWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      state.itemCount = action.payload.length;
    },
    
    // Failure action
    wishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear wishlist state
    clearWishlistState: (state) => {
      state.wishlistItems = [];
      state.itemCount = 0;
      state.error = null;
    },
    
    // Clear wishlist error
    clearWishlistError: (state) => {
      state.error = null;
    }
  },
});

export const {
  wishlistRequest,
  getWishlistSuccess,
  addToWishlistSuccess,
  removeFromWishlistSuccess,
  syncWishlistSuccess,
  wishlistFail,
  clearWishlistState,
  clearWishlistError
} = wishlistSlice.actions;

export default wishlistSlice.reducer;