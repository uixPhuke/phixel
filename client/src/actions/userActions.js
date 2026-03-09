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
  getUsersRequest,
  getUsersSuccess,
  getUsersFail,
} from "../slices/userSlice";

import { toast } from "react-hot-toast";
import { signInSignUpWithFacebook, signInSignUpWithGoogle } from "../firebase";
import {
  getCart,
  
 
} from "./cartActions";
const API = import.meta.env.VITE_API_KEY;

const config = {
  withCredentials: true,
};

/* =========================
   LOGIN
========================= */
export const login = (userData, callback) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    await axios.post(`${API}/api/v1/user/auth/login`, userData, config);

    dispatch(loginSuccess());
    dispatch(verify());
    
dispatch(getCart()); 
    toast.success("Login successful");

    callback?.(true);
  } catch (err) {
    const message = err.response?.data?.message || "Login failed";

    dispatch(loginFail(message));
    callback?.(false, message);
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
        `${API}/api/v1/user/auth/register`,
        userData
      );
      

      setUserId(data.userId);
      setOtpToggle(true);

      toast.success("OTP sent to email");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";

      dispatch(registerFail(message));
      toast.error(message);
    }
  };


  /* =========================
   RESEND OTP
========================= */

export const resendOtp = (username, password) => async () => {
  try {
    await axios.post(
      `${API}/api/v1/user/auth/resend-otp`,
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
   VERIFY OTP
========================= */

export const verifyOtp =
  (userId, otp, setSuccessToggle) => async (dispatch) => {
    try {
      await axios.post(`${API}/api/v1/user/auth/verify-otp`, { userId, otp });

      dispatch(registerSuccess());
      dispatch(verify());

      toast.success("Account verified successfully");
      setSuccessToggle(true);
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";

      dispatch(loginFail(message));
      toast.error(message);
    }
  };

/* =========================
   LOGOUT
========================= */

export const logout = () => async (dispatch) => {
  try {
    await axios.post(`${API}/api/v1/user/auth/logout`, {}, config);

    dispatch(verifyLoginFail());

    toast.success("Logged out successfully");
  } catch {
    toast.error("Logout failed");
  }
};

/* =========================
   VERIFY AUTH
========================= */

export const verify = () => async (dispatch) => {
  try {
    dispatch(verifyLoginRequest());

    const { data } = await axios.get(
      `${API}/api/v1/user/auth/verify`,
      config
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
      `${API}/api/v1/user/auth/firebase`,
      { token },
      config
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
   FACEBOOK AUTH
========================= */

export const facebookAuth = (callback) => async (dispatch) => {
  try {
    const token = await signInSignUpWithFacebook();

    await axios.post(
      `${API}/api/v1/user/auth/firebase`,
      { token },
      config
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
      `${API}/api/v1/user/auth/verify`,
      config
    );
console.log("Verify API response:", data);
    dispatch(getUserSuccess(data.user));
  } catch {
    dispatch(getUserFail());
  }
};

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersRequest());

    const { data } = await axios.get(
      `${API}/api/v1/user/users`,
      config
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
        `${API}/api/v1/user/update`,
        updatedUserData,
        config
      );

      dispatch(editUserSuccess());
      dispatch(getUser());

      toast.success("Profile updated successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || "Profile update failed";

      dispatch(editUserFail(message));
      toast.error(message);
    }
  };