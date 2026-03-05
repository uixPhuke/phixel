import axios from "axios";
import {
  registerRequest,
  registerSuccess,
  registerFail,
  loginRequest,
  loginSuccess,
  loginFail,
  verifyLoginRequest,
  verifyLoginSuccess,
  verifyLoginFail,
  getUserRequest,
  getUserSuccess,
  getUserFail,
  editUserRequest,
  editUserSuccess,
  editUserFail,
  setShowLoginModalTrue,
  getUsersRequest,
  getUsersSuccess,
  getUsersFail,
} from "../slices/userSlice";
import { toast } from "react-hot-toast";
import { signInSignUpWithFacebook, signInSignUpWithGoogle } from "../firebase";

const API_KEY = import.meta.env.VITE_API_KEY;

/* =========================
   LOGIN
========================= */
export const login = (userData, callback) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    await axios.post(
      `${API_KEY}/api/v1/user/auth/login`,
      userData,
      { withCredentials: true }
    );

    dispatch(loginSuccess());
    dispatch(verify());

    toast.success("Login successful");

    if (typeof callback === "function") {
      callback(true);
    }
  } catch (err) {
    const message =
      err.response?.data?.message || "Login failed";
    dispatch(loginFail(message));

    if (typeof callback === "function") {
      callback(false, message);
    }
  }
};

/* =========================
   REGISTER
========================= */
export const register =
  (userData, setOtpToggle, setUserId) => async (dispatch) => {
    try {
      dispatch(registerRequest());

      const { data } = await axios.post(
        `${API_KEY}/api/v1/user/auth/register`,
        userData
      );

      setUserId(data.userId);
      setOtpToggle(true);

      toast.success("OTP sent to your email");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed";
      dispatch(registerFail(message));
      toast.error(message);
    }
  };

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp =
  (userId, otp, setSuccessToggle) => async (dispatch) => {
    try {
      await axios.post(
        `${API_KEY}/api/v1/user/auth/verify-otp`,
        { userId, otp }
      );

      dispatch(registerSuccess());
      dispatch(verify());

      toast.success("Account verified successfully");
      setSuccessToggle(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "OTP verification failed";
      dispatch(loginFail(message));
      toast.error(message);
    }
  };

  /* =========================
   LOGOUT
========================= */
export const logout = () => async (dispatch) => {
  try {

    await axios.post(
      `${API_KEY}/api/v1/user/auth/logout`,
      {},
      { withCredentials: true }
    );

    dispatch(verifyLoginFail());

    localStorage.removeItem("token");

    toast.success("Logged out successfully");

  } catch {
    toast.error("Logout failed");
  }
};

/* =========================
   VERIFY AUTH (COOKIE)
========================= */
export const verify = () => async (dispatch) => {
  try {
    dispatch(verifyLoginRequest());

    const { data } = await axios.get(
      `${API_KEY}/api/v1/user/auth/verify`,
      { withCredentials: true }
    );

    dispatch(verifyLoginSuccess(data));
  } catch {
    dispatch(verifyLoginFail());
  }
};

/* =========================
   GOOGLE AUTH
========================= */
export const googleAuth = (callback) => async (dispatch) => {
  try {
    const token = await signInSignUpWithGoogle();

    await axios.post(
      `${API_KEY}/api/v1/user/auth/firebase`,
      { token },
      { withCredentials: true }
    );

    dispatch(loginSuccess());
    dispatch(verify());

    toast.success("Google login successful");
    callback?.(true);
  } catch {
    toast.error("Google authentication failed");
    callback?.(false);
  }
};

/* =========================
   RESEND OTP
========================= */
export const resendOtp = (username, password) => async (dispatch) => {
  try {
    await axios.post(
      `${API_KEY}/api/v1/user/auth/resend-otp`,
      { username, password }
    );

    toast.success("OTP has been resent successfully");
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to resend OTP";
    toast.error(message);
  }
};

/* =========================
   FACEBOOK AUTH
========================= */
export const facebookAuth = (callback) => async (dispatch) => {
  try {
    const token = await signInSignUpWithFacebook();

    await axios.post(
      `${API_KEY}/api/v1/user/auth/firebase`,
      { token },
      { withCredentials: true }
    );

    dispatch(loginSuccess());
    dispatch(verify());

    toast.success("Facebook login successful");
    callback?.(true);
  } catch {
    toast.error("Facebook authentication failed");
    callback?.(false);
  }
};

/* =========================
   GET USER
========================= */
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());

    const { data } = await axios.get(
      `${API_KEY}/api/v1/user/user`,
      { withCredentials: true }
    );

    dispatch(getUserSuccess(data.user));
  } catch {
    dispatch(getUserFail());
  }
};

/* =========================
   GET ALL USERS (ADMIN)
========================= */
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersRequest());

    const { data } = await axios.get(
      `${API_KEY}/api/v1/user/users`,
      { withCredentials: true }
    );

    dispatch(getUsersSuccess(data.users));
  } catch {
    dispatch(getUsersFail());
  }
};

/* =========================
   EDIT PROFILE
========================= */
export const editProfile =
  (updatedUserData) => async (dispatch) => {
    try {
      dispatch(editUserRequest());

      await axios.put(
        `${API_KEY}/api/v1/user/user/update`,
        updatedUserData,
        { withCredentials: true }
      );

      dispatch(editUserSuccess());
      dispatch(getUser());

      toast.success("Profile updated successfully");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Profile update failed";
      dispatch(editUserFail(message));
      toast.error(message);
    }
  };