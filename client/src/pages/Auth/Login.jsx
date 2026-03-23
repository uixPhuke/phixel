import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { login, googleAuth, facebookAuth, } from "../../actions/userActions";
import { setShowLoginModalFalse } from "../../slices/userSlice"
import { syncGuestCart, getCart } from "../../actions/cartActions";
export const Login = ({ setToggleAuth, handleOnClose }) => {
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedFields, setFocusedFields] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const isModal = !!handleOnClose;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authLoading, user } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    dispatch(
  login(loginData, (success, error) => {
    if (success) {
      if (handleOnClose) handleOnClose();

      if (user?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
       const guestCart =
  JSON.parse(localStorage.getItem("guestCart")) || [];

if (guestCart.length > 0) {
  dispatch(syncGuestCart(guestCart));
} else {
  dispatch(getCart());
}
        //navigate("/");
      }
    } else {
      setErrorMessage(error || "Invalid email/username or password");
    }
  })
);
  };

  const handleContinueWithGoogle = () => {
    dispatch(googleAuth((success) => {
      if (success) {
        if (handleOnClose) {
          handleOnClose();
        }
        if (user?.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      }
    }));
  };

  const handleContinueWithFacebook = () => {
    dispatch(facebookAuth((success) => {
      if (success) {
        if (handleOnClose) {
          handleOnClose();
        }
        if (user?.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      }
    }));
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
  };

  const handleForgotPassword = () => {
    if (handleOnClose) {
      dispatch(setShowLoginModalFalse());
    }
    navigate("/forgot-password");
  };

  const handleChangeToRegister = (e) => {
    e.preventDefault();
    setLoginData({
      emailOrUsername: "",
      password: ""
    });
    setErrorMessage("");
    
    // if (setToggleAuth) {
    //   setToggleAuth("register");
    // } else {
    //   navigate("/register");
    // }

    if (handleOnClose) {
  handleOnClose(); 
}

navigate("/register");
  };

  return (
   <div
  className={`flex justify-center font-primary ${
    isModal
      ? "py-8 items-start"
      : "min-h-screen pt-30 pb-24 items-center"
  }`}
>
      <form
        onSubmit={handleSubmit}
        className={`w-full flex flex-col p-8 rounded-xl ${
  isModal
    ? "max-w-lg mx-auto"
    : "md:w-1/3 w-full md:mx-0 mx-6 md:mt-8"
}`}
      >
        <p className="text-center text-lg font-secondary mb-8">Login to Your Account</p>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* Email/Username Input */}
        <div className="relative mt-5">
          <input
            type="text"
            required
            value={loginData.emailOrUsername}
            onChange={(e) => setLoginData({...loginData, emailOrUsername: e.target.value})}
            onFocus={() => handleFocus("emailOrUsername")}
            onBlur={(e) => handleBlur("emailOrUsername", e.target.value)}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.emailOrUsername || loginData.emailOrUsername
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Email or Username
          </label>
        </div>

        {/* Password Field with Toggle */}
        <div className="relative mt-5">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            onFocus={() => handleFocus("password")}
            onBlur={(e) => handleBlur("password", e.target.value)}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer pr-10"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.password || loginData.password
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-primary hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="cursor-pointer bg-primary w-full mt-6 text-sm rounded-lg text-secondary hover:bg-accent px-3 py-3 transition-colors flex justify-center items-center"
        >
          {authLoading ? (
            <CgSpinnerTwoAlt className="animate-spin h-5 w-5" />
          ) : (
            "LOGIN"
          )}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-primary"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-primary"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center space-x-4 my-4">
          <button
            type="button"
            onClick={handleContinueWithGoogle}
            className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
            aria-label="Continue with Google"
            disabled={authLoading}
          >
            <FcGoogle className="text-primary text-lg" />
          </button>
          <button
            type="button"
            onClick={handleContinueWithFacebook}
            className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
            aria-label="Continue with Facebook"
            disabled={authLoading}
          >
            <FaFacebookF className="text-blue-600 text-lg" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-accent">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleChangeToRegister}
              className="text-primary underline hover:text-accent"
            >
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};