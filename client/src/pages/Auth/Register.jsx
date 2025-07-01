import { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Register = () => {
  const [userData, setUserData] = useState({});
  const [focusedFields, setFocusedFields] = useState({});
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const register = (e) => {
    e.preventDefault();
    console.log(userData);
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
    <>
      <div className="min-h-screen pt-20 flex justify-center items-center pb-24 font-primary">
        <form
          onSubmit={register}
          className="md:w-1/3 w-full md:mx-0 mx-6 md:mt-8 flex flex-col  p-8 rounded-xl "
        >
          <p className="text-center text-lg font-secondary mb-8">
            Create Account
          </p>

          {/* First Name */}
          <div className="relative mt-5">
            <input
              type="text"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  firstName: e.target.value,
                });
              }}
              onFocus={() => handleFocus("firstName")}
              onBlur={(e) => handleBlur("firstName", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.firstName || userData.firstName
                  ? "top-0  bg-secondary px-1 -translate-y-1/2 text-accent"
                  : "top-4 text-accent text-xs "
              }`}
            >
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative mt-5">
            <input
              type="text"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  lastName: e.target.value,
                });
              }}
              onFocus={() => handleFocus("lastName")}
              onBlur={(e) => handleBlur("lastName", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.lastName || userData.lastName
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Last Name
            </label>
          </div>

          {/* Username */}
          <div className="relative mt-5">
            <input
              type="text"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  username: e.target.value,
                });
              }}
              onFocus={() => handleFocus("username")}
              onBlur={(e) => handleBlur("username", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.username || userData.username
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Username
            </label>
          </div>

          {/* Email */}
          <div className="relative mt-5">
            <input
              type="text"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  email: e.target.value,
                });
              }}
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.email || userData.email
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Email
            </label>
          </div>

          {/* phone */}
          <div className="relative mt-5">
            <input
              type="text"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  email: e.target.value,
                });
              }}
              onFocus={() => handleFocus("phone")}
              onBlur={(e) => handleBlur("phone", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.phone || userData.phone
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Phone
            </label>
          </div>

          {/* Date of Birth */}
          <div className="relative mt-5">
            <div className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer">
            <DatePicker
              
              selected={userData.dob}
              onChange={(date) =>
                setUserData({
                  ...userData,
                  dob: date,
                })
              }
              onFocus={() => handleFocus("dob")}
              onBlur={() => handleBlur("dob", userData.dob)}
              placeholderText=""
            />
            </div>
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.dob || userData.dob
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Date of Birth
            </label>
          </div>

          {/* Password */}



<div className="relative mt-5">
  <input
    type={showPassword ? "text" : "password"}
    required
    onChange={(e) => {
      setUserData({
        ...userData,
        password: e.target.value,
      });
    }}
    onFocus={() => handleFocus("password")}
    onBlur={(e) => handleBlur("password", e.target.value)}
    className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer pr-10" // Added pr-10
  />
  <label
    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
      focusedFields.password || userData.password
        ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
        : "top-4 text-accent text-xs"
    }`}
  >
    Password
  </label>
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? <FaEyeSlash className="h-8 w-8" /> : <FaEye className="h-8 w-8" />}
  </button>
</div>



         {/* Confirm Password */}
          <div className="relative mt-5">
            <input
              type="password"
              required
              onChange={(e) => {
                setUserData({
                  ...userData,
                  confirmPassword: e.target.value,
                });
              }}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.confirmPassword || userData.confirmPassword
                  ? "top-0  bg-secondary px-1 -translate-y-1/2  text-accent"
                  : "top-4  text-accent text-xs"
              }`}
            >
              Confirm Password
            </label>
          </div>

          {/* Privacy Consent */}
          <div className="mt-4 flex items-start">
            <input
              type="checkbox"
              id="privacyConsent"
              required
              checked={agreeToPrivacy}
              onChange={(e) => setAgreeToPrivacy(e.target.checked)}
              className="mt-1 mr-2 rounded focus:ring-primary"
            />
            <label htmlFor="privacyConsent" className="text-xs">
              By creating an account, I consent to the processing of my personal
              data in accordance with the{" "}
              <Link
                to="/privacy-policy"
                className="font-semibold text-xs underline text-primary"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-primary w-full mt-6 text-sm rounded-lg   text-secondary hover:bg-accent px-3 py-3 transition-colors"
          >
            REGISTER
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-primary"></div>
            <span className="mx-4 text-accent">OR</span>
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline hover:text-accent"
              >
                Login
              </Link>{" "}
              here.
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
