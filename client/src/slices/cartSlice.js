import { createSlice } from "@reduxjs/toolkit";

const calculateTotals = (items = []) => {
  if (!Array.isArray(items)) {
    console.error("calculateTotals expected array, got:", items);
    return {
      itemCount: 0,
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
    };
  }

  const itemCount = items.length;
  

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.priceSnapshot || item.product?.sellingPrice || 0;

    return sum + price * item.quantity;
  }, 0);

  return {
    itemCount,
    totalQuantity,
    subtotal,
    total: subtotal,
  };
};
const saveGuestCart = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: null,

    cartItems: [], // DB cart
    guestCartItems: [],

    itemCount: 0,
    totalQuantity: 0,

    subtotal: 0,
    total: 0,
    guestCartItems: JSON.parse(localStorage.getItem("guestCart")) || [],

  },

  reducers: {
    // ======================
    // REQUEST
    // ======================
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ======================
    // SUCCESS HANDLERS
    // ======================
    getCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;

      const totals = calculateTotals(action.payload);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },

    addToCartSuccess: (state, action) => {
      console.log("CART PAYLOAD:", action.payload);
      state.loading = false;
      state.cartItems = action.payload;

      const totals = calculateTotals(action.payload);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },

    syncCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      state.guestCartItems = [];

      const totals = calculateTotals(action.payload);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },

    removeFromCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;

      const totals = calculateTotals(action.payload);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;
    },

    clearCartSuccess: (state) => {
      state.loading = false;
      state.cartItems = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.total = 0;
    },

    // ======================
    // FAILURE
    // ======================
    cartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ======================
    // LOCAL RESET (LOGOUT)
    // ======================
    clearCartState: (state) => {
      state.cartItems = [];
      state.guestCartItems = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.total = 0;
    },
    // ======================
    // GUEST CART (NO LOGIN)
    // ======================
    addToGuestCart: (state, action) => {
      const { productID, quantity, size, priceSnapshot, product } =
        action.payload;

      const existingIndex = state.guestCartItems.findIndex(
        (item) => item.productID === productID && item.size === size,
      );

      if (existingIndex > -1) {
        state.guestCartItems[existingIndex].quantity += quantity;
      } else {
        state.guestCartItems.push({
          productID,
          quantity,
          size,
          priceSnapshot,
          product,
        });
      }

      const totals = calculateTotals(state.guestCartItems);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;

      saveGuestCart(state.guestCartItems);
    },

    removeFromGuestCart: (state, action) => {
      const { productID, size } = action.payload;

      state.guestCartItems = state.guestCartItems.filter(
        (item) => !(item.productID === productID && item.size === size),
      );

      const totals = calculateTotals(state.guestCartItems);
      state.itemCount = totals.itemCount;
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.total = totals.total;

      saveGuestCart(state.guestCartItems);
    },

    clearGuestCart: (state) => {
      state.guestCartItems = [];
      localStorage.removeItem("guestCart");
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.total = 0;
    },

    updateGuestQuantity: (state, action) => {
  const { productID, size, quantity } = action.payload;

  const item = state.guestCartItems.find(
    (i) => i.productID === productID && i.size === size
  );

  if (item) {
    item.quantity = quantity;
  }

  const totals = calculateTotals(state.guestCartItems);
  state.itemCount = totals.itemCount;
  state.totalQuantity = totals.totalQuantity;
  state.subtotal = totals.subtotal;
  state.total = totals.total;

  localStorage.setItem("guestCart", JSON.stringify(state.guestCartItems));
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

  addToGuestCart,
  removeFromGuestCart,
  clearGuestCart,
  updateGuestQuantity
} = cartSlice.actions;

export default cartSlice.reducer;
