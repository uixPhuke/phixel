import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    loading: false,
    error: null,
    cartItems: [], // This will store the products array from your backend
    itemCount: 0, // Number of distinct items in cart
    totalQuantity: 0, // Total quantity of all items
  },
  reducers: {
    // Request actions
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Success actions
    getCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      
      // Calculate derived values
      state.itemCount = action.payload.length;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + item.quantity, 0
      );
    },
    
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      
      // Calculate derived values
      state.itemCount = action.payload.length;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + item.quantity, 0
      );
    },
    
    syncCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      
      // Calculate derived values
      state.itemCount = action.payload.length;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + item.quantity, 0
      );
    },
    
    removeFromCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      
      // Calculate derived values
      state.itemCount = action.payload.length;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + item.quantity, 0
      );
    },
    
    clearCartSuccess: (state) => {
      state.loading = false;
      state.cartItems = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
    },
    
    // Failure action
    cartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear cart in state (without API call)
    clearCartState: (state) => {
      state.cartItems = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const {
  cartRequest,
  getCartSuccess,
  addToCartSuccess,
  syncCartSuccess,
  removeFromCartSuccess,
  clearCartSuccess,
  cartFail,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;