import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export const Login = () => {
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedFields, setFocusedFields] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loginData);
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
  };

  return (
    <div className="min-h-screen pt-30 flex justify-center items-center pb-24 font-primary">
      <form
        onSubmit={handleSubmit}
        className="md:w-1/3 w-full md:mx-0 mx-6 md:mt-8 flex flex-col p-8 rounded-xl"
      >
        <p className="text-center text-lg font-secondary mb-8">Login to Your Account</p>

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
            {showPassword ? <FaEyeSlash className="h-8 w-8" /> : <FaEye className="h-8 w-8" />}
          </button>
        </div>

        <div className="flex justify-end mt-2">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-primary w-full mt-6 text-sm rounded-lg  text-secondary hover:bg-accent px-3 py-3 transition-colors"
        >
          LOGIN
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
                      className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
                      aria-label="Continue with Google"
                    >
                      <FcGoogle className="text-primary text-lg" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
                      aria-label="Continue with Facebook"
                    >
                      <FaFacebookF className="text-blue-600 text-lg" />
                    </button>
                  </div>
        <div className="mt-6 text-center">
          <p className="text-accent">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary underline hover:text-accent">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};