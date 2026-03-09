import axios from "axios";
import {
  couponRequest,
  getCouponsSuccess,
  createCouponSuccess,
  applyCouponSuccess,
  removeCouponSuccess,
  checkCouponSuccess,
  couponFail
} from "../slices/couponSlice";

import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_KEY;

const config = {
  withCredentials: true
};


// =========================
// CREATE COUPON (ADMIN)
// =========================

export const createCoupon = (couponData) => async (dispatch) => {

  try {

    dispatch(couponRequest());

    const { data } = await axios.post(
      `${API}/api/v5/discount/create`,
      couponData,
      config
    );

    dispatch(createCouponSuccess(data.discount));

    toast.success(data.message || "Coupon created successfully");

  } catch (err) {

    const message =
      err.response?.data?.message ||
      "Failed to create coupon";

    dispatch(couponFail(message));

    toast.error(message);

  }

};



// =========================
// APPLY COUPON
// =========================

export const applyCoupon = (code) => async (dispatch) => {

  try {

    dispatch(couponRequest());

    const { data } = await axios.post(
      `${API}/api/v5/discount/apply`,
      { code: code },
      config
    );

    dispatch(applyCouponSuccess(data.discount));

    toast.success(data.message || "Coupon applied");

  } catch (err) {

    const message =
      err.response?.data?.message ||
      "Failed to apply coupon";

    dispatch(couponFail(message));

    toast.error(message);

  }

};

// =========================
// GET ALL COUPONS
// =========================  
export const getAllCoupons = () => async (dispatch) => {

  try {

    dispatch(couponRequest());

    const { data } = await axios.get(
      `${API}/api/v5/discount`,
      config
    );

    dispatch(getCouponsSuccess(data.discounts));

  } catch (err) {

    dispatch(couponFail("Failed to fetch coupons"));

  }

};



export const removeAppliedCoupon = () => (dispatch) => {

  dispatch(removeCouponSuccess());
  localStorage.removeItem("appliedCoupon");

  toast.success("Coupon removed");
};
// =========================
// REMOVE COUPON
// =========================

export const removeCoupon = () => async (dispatch) => {

  try {

    dispatch(couponRequest());

    const { data } = await axios.post(
      `${API}/api/v5/discount/remove`,
      {},
      config
    );

    dispatch(removeCouponSuccess());

    toast.success(data.message || "Coupon removed");

  } catch (err) {

    const message =
      err.response?.data?.message ||
      "Failed to remove coupon";

    dispatch(couponFail(message));

    toast.error(message);

  }

};



// =========================
// CHECK COUPON
// =========================

export const checkCoupon = (code) => async (dispatch) => {

  try {

    dispatch(couponRequest());

    const { data } = await axios.post(
      `${API}/api/v5/discount/check`,
      { code },
      config
    );

    dispatch(checkCouponSuccess(data.discount));

  } catch (err) {

    const message =
      err.response?.data?.message ||
      "Coupon not valid";

    dispatch(couponFail(message));

  }

};