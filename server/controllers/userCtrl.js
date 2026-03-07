const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../middlewares/auth");
const { get } = require("mongoose");
const {sendOtpEmail} = require("../services/emailService");

// Register a new user
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    dob,
    password,
    confirmPassword,
    isAdmin,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !phone ||
    !dob ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  //validate the fields (email,phone,password)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }
  //phone no validation
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid phone number",
    });
  }
  // Check if password is at least 8 characters long and contains at least 1 uppercase letter, 1 number, and 1 special character
  if (
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long",
    });
  }

 // Check if password is at least 6 characters long
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password does not match!',
      });
    }
  try {
    // check username if already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    // check email if already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    // check phone
    const existingPhoneNo = await User.findOne({ phone });
    if (existingPhoneNo) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    
    
    //expire the OTP after 5 minutes
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    //Hashed the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user but not verified yet
    
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      dob,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      otp, // Store the OTP
      otpExpiration, // Store the OTP expiration time
      isVerified: false, // Initially set to false
    });
// Send OTP to user's email
    try {
      await sendOtpEmail(email, otp, "verification");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: error.message,
      });
    }

   
    const token = createToken(newUser._id, newUser.email, res);
    res.status(201).json({
      success: true,
      message: "User registered successfully, Please verify your email using you email",
      user: newUser,
      token,
      userId: newUser._id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//verify user OTP
const verifyUserOtp = async (req, res) => {
  const { userId, otp } = req.body;
  //validate input
  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId and OTP",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
    // Check if user exists
  if(user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User is already verified",
    });
  }
  //check if OTP matches hasn't expired
  if (user.otp !== otp || new Date() > user.otpExpiration) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }
 

  //OTP is valid, update user status
  user.isVerified = true;
  user.otp = null; // Clear OTP after verification
  user.otpExpiration = null; // Clear OTP expiration after verification
  await user.save();
  res.status(200).json({
    success: true,
    message: "User Email verified successfully",
    user,
    
  });
   console.log("Current time:", new Date());
console.log("OTP Expiry:", user.otpExpiration);
}

//resend otp if user miss the verification email
const resendOtp = async (req, res,next) => {
  try {
    const {emailOrUsername,password} = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide emailOrUsername and password",
      });
    }
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
   {/* // Check if the OTP is still valid
    if (user.otp && user.otpExpiration && new Date() < user.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "OTP is still valid, please check your email",
      });
    }
    // If OTP is expired or not set, generate a new OTP
    if (!user.otp || !user.otpExpiration || new Date() > user.otpExpiration) {
      // Generate a new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      user.otp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();
    }
    // Send the OTP to the user's email
    try {
      await sendOtpEmail(user.email, user.otp, "verification");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "OTP resent successfully to your email",
    });
  } catch (error) {
    return next(error);
  }*/}
// Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();
    // Send the OTP to the user's email
    try {
      await sendOtpEmail(user.email, otp, "verification");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "OTP resent successfully to your email",
    });
  } catch (error) {
    return next(error);
    
  }
}


//forget password-send OTP to user's email
const forgetPassword = async (req, res,next) => {
  try{
    const {email}= req.body;
    //validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    // Update the user with the new OTP and expiration
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();
    // Send the OTP to the user's email
    try {
      await sendOtpEmail(user.email, otp, "verification");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return next(error);
  }
}

//verify otp and reset password
const resetPassword = async (req, res) => {
  const { userId, otp, newPassword,confirmPassword } = req.body;
  //validate input
  if (!userId || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId, OTP, new password and confirm password",
    });
  }
//check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }
  // Check if password is at least 6 characters long
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false, 
        message: "User not found",
      });
    }
    // Check if the OTP matches and hasn't expired
    if (user.otp !== otp || new Date() > user.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update the user's password and clear the OTP
    user.password = hashedPassword;
    user.otp = null; // Clear OTP after password reset
    user.otpExpiration = null; // Clear OTP expiration after password reset
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

//login user
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  //validate input
  if (!emailOrUsername || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  // Check if password is at least 6 characters long
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if(!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "User is not verified",
      });
    }
    if(user.isFirebaseAuth){
      return res.status(403).json({
        success: false,
        message: "User is not authenticated with Firebase",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //Generate a token
    const token = createToken(user._id, user.email, res);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

//update User
const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, dob } = req.body;
    if (!firstName || !lastName || !username || !email || !phone || !dob) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the username is already taken by another user
    const usernameExists = await User.findOne({
      username,
      _id: { $ne: user._id },
    });

    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Check if the email is already taken by another user
    const emailExists = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken",
      });
    }
    // Check if the phone number is already taken by another user
    const phoneExists = await User.findOne({
      phone,
      _id: { $ne: user._id },
    });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already taken",
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.dob = dob;

    const updateUser = await user.save();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get users
const getUsers = async (req, res,next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return next(error);
  }
};

//Google and facebook Auth through Firebase
const firebaseAuth=async(req,res,next)=>{
  try{
    const {uid, email,name} = req.body;
    //validate input
    if (!uid || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide uid, email and name",
      });
    }
    //check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      user= await User.Create({
        isFirebaseAuth: true,
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        username: uid,
        isVerified: true
      })
    }

    //generate a token
    const token = createToken(user._id, user.email, res);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  }catch (error) {
    return next(error); 
  
  }
}

//Auth Verify
const verifyAuth = async (req, res, next) => {
  try {
     const user = await User.findById(req.user._id).select("-password");
    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true,
        user
      });
    }
    if (!user) {
      return res.status(200).json({
        success: true,
        isLogin: false
      });
    }
  } catch (err) {
    return next(err);
  }
};

//get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await user.remove();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//logout user
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, updateUser ,getUsers,getUserById,deleteUser,logoutUser,
  verifyUserOtp, resendOtp, forgetPassword, resetPassword, firebaseAuth, verifyAuth };
