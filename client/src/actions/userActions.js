import axios from 'axios';

import {registerRequest,
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
    setShowLoginModalFalse,
    getUsersRequest,
    getUsersSuccess,
    getUsersFail} from '../slices/userSlice';

import {toast}  from 'react-hot-toast';

import { signInSignUpWithFacebook, signInSignUpWithGoogle } from '../firebase';


const API_KEY = import.meta.env.VITE_API_KEY;


export const login = (userData, setSuccessToggle, callback) => async (dispatch) => {

    // const navigate = useNavigate()

    try {
        dispatch(loginRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${API_KEY}/api/v1/user/auth/login`, userData, config);

        localStorage.setItem('token', data.token);
        dispatch(loginSuccess());
        setSuccessToggle(true)
        dispatch(verify())
        toast.success("Login Successful!", {
            className: 'custom-toast-enter',
        });
        callback(true, null); // Success callback
        // navigate('/')
    } catch (err) {
        dispatch(loginFail(err.response.data.message));
        console.log(err);
        // toast.error(err.response.data.message, {
        //     className: 'custom-toast-enter',
        // });
        callback(false, err.response.data.message); // Error callback
    }
};

export const register = (userData, setSuccessToggle, setOtpToggle, setUserId, setToken, setErrorMessage) => async (dispatch) => {
    try {

        dispatch(registerRequest())


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${API_KEY}/api/v1/user/auth/register`, userData, config)


        const userId = data.userId || data.user?._id || data.user?.id;
        const token = data.token;

        if (!userId) {
            throw new Error("User ID not received from server");
        }
        //localStorage.setItem('token', data.token);
        

        
        setUserId(data.userId); // Save userId for OTP verification
        setToken(token); 

        //dispatch(registerSuccess());
        //dispatch(verify())
        toast.success("OTP has been sent to your email. Please check your inbox!", {
            className: 'custom-toast-enter',
        });
        setOtpToggle(true);

    } catch (err) {
        const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
        dispatch(registerFail(err.response.data.message));
        console.log(err.response.data.message)
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
        setErrorMessage(errorMsg); // Error callback
    }
}

export const verifyOtp = (userId, otp, token, setSuccessToggle) => async (dispatch) => {
    try {
         console.log("Verifying OTP with:", { userId, otp, token }); 
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${API_KEY}/api/v1/user/auth/verify-otp`, { userId, otp }, config);

        
        localStorage.setItem('token', token);

        toast.success("OTP Verified Successfully!", {
            className: 'custom-toast-enter',
        });
        dispatch(registerSuccess());
        dispatch(verify())
        //dispatch(loginSuccess());
        toast.success("Register Successful !", {
            className: 'custom-toast-enter',
        });
        setSuccessToggle(true);
        //dispatch(setShowLoginModalTrue());
    } catch (err) {
        dispatch(loginFail(err.response.data.message));
        console.log(err.response.data.message);
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
    }
};

//Resend OTP
export const resendOtp = (username, password) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_KEY}/api/v1/user/auth/resend-otp`,
      { username, password },
      config
    );

    toast.success("OTP has been resent successfully. Please check your email!", {
      className: "custom-toast-enter",
    });
  } catch (err) {
    console.log(err.response?.data?.message || "Something went wrong!");
    toast.error(err.response?.data?.message || "Failed to resend OTP.", {
      className: "custom-toast-enter",
    });
  }
};

export const verify = () => async (dispatch) => {
    try {

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        const { data } = await axios.get(`${API_KEY}/api/v1/user/auth/verify`, config);


        dispatch(verifyLoginSuccess(data))


    } catch (err) {
        dispatch(verifyLoginFail())
    }
}

export const googleAuth = (setSuccessToggle) => async (dispatch) => {

    try {

        const token = await signInSignUpWithGoogle();
        console.log("token from auth of frontend", token);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const { data } = await axios.post(`${API_KEY}/api/v1/user/auth/firebase`, { token }, config);

            localStorage.setItem('token', data.token);

            dispatch(loginSuccess());
            setSuccessToggle(true)
            dispatch(verify())
            toast.success("Authentication Successful!", {
                className: 'custom-toast-enter',
            });

        } catch (err) {
            console.error("error from userAction", err);
            dispatch(loginFail(err.response.data.message));
        }
    } catch (err) {
        console.error(err);
    }

}

export const facebookAuth = (setSuccessToggle) => async (dispatch) => {

    try {
        const token = await signInSignUpWithFacebook();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const { data } = await axios.post(`${API_KEY}/api/v1/user/auth/firebase`, { token }, config);

            localStorage.setItem('token', data.token);

            dispatch(loginSuccess());
            setSuccessToggle(true)
            dispatch(verify())
            toast.success("Authentication Successful!", {
                className: 'custom-toast-enter',
            });

        } catch (err) {
            console.error(err);
            dispatch(loginFail(err.response.data.message));
        }
    } catch (err) {
        console.error(err);
    }

}




export const getUser = () => async (dispatch) => {
    try {

        dispatch(getUserRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        const { data } = await axios.get(`${API_KEY}/api/v1/user/user`, config);

        // console.log("data", data.user)

        dispatch(getUserSuccess(data.user))



    } catch (err) {
        dispatch(getUserFail());
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch(getUsersRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };

        const { data } = await axios.get(`${API_KEY}/api/v1/user/users`, config);

        dispatch(getUsersSuccess(data.users));
    } catch (err) {
        dispatch(getUsersFail(err.message || 'Failed to fetch users'));
    }
};


export const editProfile = (updatedUserData) => async (dispatch) => {
    try {

        dispatch(editUserRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        const { data } = await axios.put(`${API_KEY}/api/v1/user/user/update`, updatedUserData, config);

        dispatch(editUserSuccess())
        dispatch(getUser())

        toast.success("Profile Updated Successfully!", {
            className: 'custom-toast-enter',
        });


    } catch (err) {
        dispatch(editUserFail(err.response.data.message));
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
    }
}

// 
   
    