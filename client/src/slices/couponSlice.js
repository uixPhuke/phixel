import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
  name: "coupon",

  initialState: {
    loading: false,
    error: null,
    coupon: null,
    coupons: [], 
    appliedCoupon: JSON.parse(localStorage.getItem("appliedCoupon")) || null,
    success: false,
  },

  reducers: {

    couponRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    getCouponsSuccess: (state, action) => {
  state.loading = false;
  state.coupons = action.payload;
},

    createCouponSuccess: (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
      state.success = true;
      
    },

    applyCouponSuccess: (state, action) => {
      state.loading = false;
      state.appliedCoupon = action.payload;
      state.success = true;
      localStorage.setItem("appliedCoupon", JSON.stringify(action.payload));
    },

    removeCouponSuccess: (state) => {
      state.loading = false;
      state.appliedCoupon = null;
      state.success = true;
      localStorage.removeItem("appliedCoupon");
    },

    checkCouponSuccess: (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
       state.appliedCoupon = action.payload;
  localStorage.setItem("appliedCoupon", JSON.stringify(action.payload));

    },

    couponFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    clearCouponState: (state) => {
      state.error = null;
      state.success = false;
    }

  }
});

export const {
  couponRequest,
  createCouponSuccess,
   getCouponsSuccess,
  applyCouponSuccess,
  removeCouponSuccess,
  checkCouponSuccess,
  couponFail,
  clearCouponState
} = couponSlice.actions;

export default couponSlice.reducer;