import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    loading: false,
    error: null,
    cartItems: [],
    totalCartPrice: 0,
    cartStatus: 'active',
    updatedAt: null,
    itemCount: 0, // New field to track the number of items
  },
  reducers: {
    // Actions to handle adding/updating/removing items from the cart
    updateCartRequest: (state) => {
      state.loading = true;
    },
    updateCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = [...action.payload.items]; // Ensure immutability by spreading new items
      state.totalCartPrice = action.payload.totalCartPrice;
      state.updatedAt = action.payload.updatedAt;
      
      
      // Update itemCount based on the quantity of items
      state.itemCount = action.payload.items.reduce(
        (count, item) => count + (item.quantity > 0 ? 1 : 0),
        0
      );
    },
    updateCartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions to handle fetching the cart
    getCartRequest: (state) => {
      state.loading = true;
    },
    getCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = [...action.payload.items]; // Ensure immutability
      state.totalCartPrice = action.payload.totalCartPrice;
      state.afterDiscountCartPrice = action.payload.afterDiscountCartPrice;
      state.cartStatus = action.payload.cartStatus;
      state._id = action.payload._id;
      state.updatedAt = action.payload.updatedAt;
      state.deliveryCharge = action.payload.deliveryCharge; // Store deliveryCharge
      // Update itemCount based on the quantity of items
      state.itemCount = action.payload.items.reduce(
        (count, item) => count + (item.quantity > 0 ? 1 : 0),
        0
      );
    },
    
    getCartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalCartPrice = 0;
      state.itemCount = 0; // Reset the item count
    },
  },
});

export const {
  updateCartRequest,
  updateCartSuccess,
  updateCartFail,
  getCartRequest,
  getCartSuccess,
  getCartFail,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
