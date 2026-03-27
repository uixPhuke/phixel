import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { Country } from "country-state-city";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useDispatch, useSelector } from "react-redux";
import { register, resendOtp, verifyOtp, googleAuth, facebookAuth } from "../../actions/userActions";

export const Register = ({ setToggleAuth, handleOnClose }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dob: "",
    country: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  
  const [focusedFields, setFocusedFields] = useState({});
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpToggle, setOtpToggle] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  
  const allCountries = Country.getAllCountries();
  const { authLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Country and Phone Number Handling
  const handleCountryChange = (e) => {
    const selectedIsoCode = e.target.value;
    const country = allCountries.find((c) => c.isoCode === selectedIsoCode);

    if (country) {
      setSelectedCountry(country);
      setUserData({
        ...userData,
        country: country.name,
        countryCode: `+${country.phonecode}`,
      });
    }
  };

  const validatePhoneNumber = (number) => {
    if (!selectedCountry) return "Please select a country first.";
    const parsedNumber = parsePhoneNumberFromString(number, selectedCountry.isoCode);
    if (!parsedNumber || !parsedNumber.isValid()) {
      return "Invalid phone number.";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value;
    setUserData(prev => ({
      ...prev,
      mobile: number,
    }));
    setPhoneNumberError(validatePhoneNumber(number));
  };

  // Validation Functions
  const validateFirstName = (value) => {
    if (value.length < 3) return "First name must be at least 3 characters long.";
    return "";
  };

  const validateLastName = (value) => {
    if (value.length < 3) return "Last name must be at least 3 characters long.";
    return "";
  };

  const validateUsername = (value) => {
    if (value.length < 3) return "Username must be at least 3 characters long.";
    return "";
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(value)) {
      return "Password must be at least 6 characters with one uppercase letter and one special character.";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (value !== userData.password) return "Passwords do not match.";
    return "";
  };

  const validateDOB = (value) => {
    if (!value) return "Date of birth is required.";
    const selectedDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

    if (age < 18) return "You must be at least 18 years old.";
    return "";
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
    
    // Additional validation on blur
    let error = "";
    switch (field) {
      case "firstName": error = validateFirstName(value); break;
      case "lastName": error = validateLastName(value); break;
      case "username": error = validateUsername(value); break;
      case "email": error = validateEmail(value); break;
      case "password": error = validatePassword(value); break;
      case "confirmPassword": error = validateConfirmPassword(value); break;
      case "dob": error = validateDOB(value); break;
      case "mobile": error = validatePhoneNumber(value); break;
      default: break;
    }
    setInputErrors(prev => ({ ...prev, [field]: error }));
  };

  // OTP Handling
  const handleResendOtp = () => {
    if (resendDisabled) return;
    setResendDisabled(true);
    setResendTimer(30);

    dispatch(resendOtp(userData.username, userData.password));

    const interval = setInterval(() => {
      setResendTimer(prev => prev === 1 ? (clearInterval(interval), setResendDisabled(false), 0 ): prev - 1);
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!agreeToPrivacy) {
      setErrorMessage("You must agree to the privacy policy");
      return;
    }

    // Validate all fields
    const fieldsToValidate = [
      "firstName", "lastName", "username", "email", 
      "password", "confirmPassword", "dob", "mobile", "country"
    ];
    
    fieldsToValidate.forEach(field => {
      if (field === "dob") {
        handleBlur(field, userData.dob);
      } else if (field === "mobile") {
        handleBlur(field, userData.mobile);
      } else if (field === "country") {
        setInputErrors(prev => ({
          ...prev,
          country: userData.country ? "" : "Country is required."
        }));
      } else {
        handleBlur(field, userData[field]);
      }
    });

    // Check for errors
    const hasErrors = Object.values(inputErrors).some(error => error) || 
                     !userData.mobile || 
                     !userData.country;

    if (hasErrors) {
      setInputErrors(prev => ({
        ...prev,
        phone: userData.mobile ? "" : "Phone number is required.",
        country: userData.country ? "" : "Country is required.",
      }));
      return;
    }

    const formData = {
      ...userData,
      phone: userData.mobile,
    };
    delete formData.countryCode;

    dispatch(register(
  formData, 
  setOtpToggle,   // correct
  setUserId       // correct
));
  };
//  dispatch(register(
//       formData, 
//       () => setOtpToggle(true), 
//       setOtpToggle, 
//       setUserId, 
//       setToken, 
//       setErrorMessage
//     ));
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp(userId, otp, () => {
      if (handleOnClose) {
        handleOnClose();
      } else {
        navigate("/");
      }
    }));
  };

  const handleContinueWithGoogle = () => {
    dispatch(googleAuth(() => {
      if (handleOnClose) {
        handleOnClose();
      } else {
        navigate("/profile");
      }
    }));
  };

  const handleContinueWithFacebook = () => {
    dispatch(facebookAuth(() => {
      if (handleOnClose) {
        handleOnClose();
      } else {
        navigate("/profile");
      }
    }));
  };

  const handleChangeToLogin = (e) => {
    e.preventDefault();
    setUserData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      dob: "",
      country: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setInputErrors({});
    setErrorMessage("");
    if (setToggleAuth) {
      setToggleAuth("login");
    } else {
      navigate("/login");
    }
  };

  if (otpToggle) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center pb-24 font-primary">
        <form
          onSubmit={handleVerifyOtp}
          className="md:w-1/3 w-full md:mx-0 mx-6 md:mt-8 flex flex-col p-8 rounded-xl"
        >
          <p className="text-center text-lg font-secondary mb-8">
            Verify Your Account
          </p>
          
          <div className="relative mt-5">
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter OTP"
            />
          </div>
          
          <button
            type="submit"
            className="cursor-pointer bg-primary w-full mt-6 text-sm rounded-lg text-secondary hover:bg-accent px-3 py-3 transition-colors"
          >
            VERIFY OTP
          </button>
          
          <div className="mt-3 flex flex-col items-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`text-sm ${
                resendDisabled
                  ? "text-gray-400"
                  : "text-primary hover:underline"
              }`}
            >
              {resendDisabled
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex justify-center items-center pb-24 font-primary">
      <form
        onSubmit={handleRegister}
        className="md:w-1/3 w-full md:mx-0 mx-6 md:mt-8 flex flex-col p-8 rounded-xl"
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
            onBlur={(e) => {
              handleBlur("firstName", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                firstName: validateFirstName(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.firstName || userData.firstName
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            First Name
          </label>
          {inputErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.firstName}</p>
          )}
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
            onBlur={(e) => {
              handleBlur("lastName", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                lastName: validateLastName(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.lastName || userData.lastName
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Last Name
          </label>
          {inputErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.lastName}</p>
          )}
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
            onBlur={(e) => {
              handleBlur("username", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                username: validateUsername(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.username || userData.username
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Username
          </label>
          {inputErrors.username && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.username}</p>
          )}
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
            onBlur={(e) => {
              handleBlur("email", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                email: validateEmail(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.email || userData.email
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Email
          </label>
          {inputErrors.email && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.email}</p>
          )}
        </div>

        {/* Country and Phone */}
        <div className="flex gap-4 mt-5">
          <div className="relative flex-1">
            <select
              onChange={handleCountryChange}
              onFocus={() => handleFocus("country")}
              onBlur={() => handleBlur("country", userData.country)}
              className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer appearance-none"
            >
              {/*<option value="">Select Country</option>*/}
              <option value=""></option>
              {allCountries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.country || userData.country
                  ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                  : "top-4 text-accent text-xs"
              }`}
            >
              Country
            </label>
            {inputErrors.country && (
              <p className="text-red-500 text-xs mt-1">{inputErrors.country}</p>
            )}
          </div>
          
          <div className="relative flex-1">
            <div className="flex items-center border text-sm rounded-lg border-primary focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
              <span className="px-3 py-3  border-r border-primary">
                {selectedCountry ? `+${selectedCountry.phonecode}` : "+XX"}
              </span>
              <input
                type="tel"
                required
                onChange={handlePhoneChange}
                onFocus={() => handleFocus("mobile")}
                onBlur={(e) => {
                  handleBlur("mobile", e.target.value);
                  setPhoneNumberError(validatePhoneNumber(e.target.value));
                }}
                className="w-full py-3 px-4 focus:outline-none bg-transparent"
              />
            </div>
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focusedFields.mobile || userData.mobile
                  ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                  : "top-4 text-accent text-xs"
              }`}
              style={{ left: '60px' }}
            >
              Phone
            </label>
            {(phoneNumberError || inputErrors.mobile) && (
              <p className="text-red-500 text-xs mt-1">
                {phoneNumberError || inputErrors.mobile}
              </p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="relative mt-5">
          <div className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer">
            <DatePicker
              selected={userData.dob}
              onChange={(date) => {
                setUserData({
                  ...userData,
                  dob: date,
                });
                setInputErrors(prev => ({
                  ...prev,
                  dob: validateDOB(date)
                }));
              }}
              onFocus={() => handleFocus("dob")}
              onBlur={() => handleBlur("dob", userData.dob)}
              placeholderText=""
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.dob || userData.dob
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Date of Birth
          </label>
          {inputErrors.dob && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.dob}</p>
          )}
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
            onBlur={(e) => {
              handleBlur("password", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                password: validatePassword(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer pr-10"
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
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
          {inputErrors.password && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.password}</p>
          )}
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
            onBlur={(e) => {
              handleBlur("confirmPassword", e.target.value);
              setInputErrors(prev => ({
                ...prev,
                confirmPassword: validateConfirmPassword(e.target.value)
              }));
            }}
            className="border text-sm rounded-lg py-3 px-4 w-full border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedFields.confirmPassword || userData.confirmPassword
                ? "top-0 bg-secondary px-1 -translate-y-1/2 text-accent"
                : "top-4 text-accent text-xs"
            }`}
          >
            Confirm Password
          </label>
          {inputErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{inputErrors.confirmPassword}</p>
          )}
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

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={authLoading}
          className="cursor-pointer bg-primary w-full mt-6 text-sm rounded-lg text-secondary hover:bg-accent px-3 py-3 transition-colors flex justify-center items-center"
        >
          {authLoading ? (
            <CgSpinnerTwoAlt className="animate-spin h-5 w-5" />
          ) : (
            "REGISTER"
          )}
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
            onClick={handleContinueWithGoogle}
            className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
            aria-label="Continue with Google"
          >
            <FcGoogle className="text-primary text-lg" />
          </button>
          <button
            type="button"
            onClick={handleContinueWithFacebook}
            className="flex items-center justify-center w-24 h-24 rounded-lg border border-accent hover:bg-primary transition-colors"
            aria-label="Continue with Facebook"
          >
            <FaFacebookF className="text-blue-600 text-lg" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-accent">
            Already have an account?{" "}
            <button
              onClick={handleChangeToLogin}
              className="text-primary underline hover:text-accent"
            >
              Login
            </button>{" "}
            here.
          </p>
        </div>
      </form>
    </div>
  );
};