import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    loading: false,
    error: null,
    wishlistItems: [],
    itemCount: 0,
  },

  reducers: {
    wishlistRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getWishlistSuccess: (state, action) => {
      state.loading = false;
      const items = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.wishlistItems = items;
      state.itemCount = items.length;
    },

    addToWishlistSuccess: (state, action) => {
      state.loading = false;
      const items = Array.isArray(action.payload)
        ? action.payload
        : state.wishlistItems;
      state.wishlistItems = items;
      state.itemCount = items.length;
    },

    removeFromWishlistSuccess: (state, action) => {
      state.loading = false;
      const items = Array.isArray(action.payload)
        ? action.payload
        : state.wishlistItems;
      state.wishlistItems = items;
      state.itemCount = items.length;
    },

    syncWishlistSuccess: (state, action) => {
      state.loading = false;
      const items = Array.isArray(action.payload)
        ? action.payload
        : state.wishlistItems;
      state.wishlistItems = items;
      state.itemCount = items.length;
    },

    wishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearWishlistState: (state) => {
      state.wishlistItems = [];
      state.itemCount = 0;
      state.error = null;
    },

    clearWishlistError: (state) => {
      state.error = null;
    },
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
  clearWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;