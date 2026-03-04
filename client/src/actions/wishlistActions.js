import axios from "axios";
import {
  wishlistRequest,
  getWishlistSuccess,
  addToWishlistSuccess,
  removeFromWishlistSuccess,
  syncWishlistSuccess,
  wishlistFail,
} from "../slices/wishlistSlice";
import { setShowLoginModalTrue } from "../slices/userSlice";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_KEY;


// ==============================
// GET WISHLIST
// ==============================
export const getWishlist = () => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const { data } = await axios.get(
      `${API_URL}/api/v8/wishlist`,
      { withCredentials: true }
    );

    dispatch(getWishlistSuccess(data.products));

  } catch (err) {
    console.error("Get Wishlist Error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to fetch wishlist.";

    dispatch(wishlistFail(message));

    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};


// ==============================
// ADD TO WISHLIST
// ==============================
export const addToWishlist = (productID) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const { data } = await axios.post(
      `${API_URL}/api/v8/wishlist/add`,
      { productID },
      { withCredentials: true }
    );

    dispatch(addToWishlistSuccess(data.products));

    //  refresh wishlist so UI gets full products
    dispatch(getWishlist());

    if (data.message === "Product already in wishlist") {
      toast.success("Product already in wishlist!");
    } else {
      toast.success("Product added to wishlist!");
    }

  } catch (err) {
    console.error("Add Wishlist Error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to add product to wishlist.";

    dispatch(wishlistFail(message));

    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
      toast.error("Please login to add items to wishlist");
    } else {
      toast.error(message);
    }
  }
};


// ==============================
// REMOVE FROM WISHLIST
// ==============================
export const removeFromWishlist = (productID) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const { data } = await axios.delete(
      `${API_URL}/api/v8/wishlist/${productID}`,
      { withCredentials: true }
    );

    dispatch(removeFromWishlistSuccess(data.products));

    // 🔥 refresh wishlist so UI updates instantly
    dispatch(getWishlist());

    toast.success("Product removed from wishlist!");

  } catch (err) {
    console.error("Remove Wishlist Error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to remove product from wishlist.";

    dispatch(wishlistFail(message));

    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    } else {
      toast.error(message);
    }
  }
};


// ==============================
// SYNC GUEST WISHLIST
// ==============================
export const syncGuestWishlist = (guestWishlistItems) => async (dispatch) => {
  try {
    dispatch(wishlistRequest());

    const { data } = await axios.post(
      `${API_URL}/api/v8/wishlist/sync`,
      { guestWishlist: guestWishlistItems },
      { withCredentials: true }
    );

    dispatch(syncWishlistSuccess(data.products));

    if (guestWishlistItems.length > 0) {
      toast.success("Wishlist synced successfully!");
    }

  } catch (err) {
    console.error("Sync Wishlist Error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to sync wishlist.";

    dispatch(wishlistFail(message));

    if (err.response?.status === 401) {
      dispatch(setShowLoginModalTrue());
    }
  }
};


// ==============================
// CHECK IF PRODUCT IN WISHLIST
// ==============================
export const isInWishlist = (productID) => (_, getState) => {
  const { wishlistItems } = getState().wishlist;
  return wishlistItems.some((item) => item._id === productID);
};


// ==============================
// TOGGLE WISHLIST ITEM
// ==============================
export const toggleWishlistItem = (productID) => async (dispatch, getState) => {

  const { wishlistItems } = getState().wishlist;

  const exists = wishlistItems.some(
    (item) => item._id === productID
  );

  if (exists) {
    await dispatch(removeFromWishlist(productID));
  } else {
    await dispatch(addToWishlist(productID));
  }
};