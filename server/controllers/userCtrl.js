
//testing route
// exports.testUserRoute = (req, res) => {
//     console.log('Controller: testUserRoute called');
//     res.send('User Controller is working!');
//   }; 
// Import necessary modules
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, phone, dob, password } = req.body;

  if (!firstName || !lastName || !username || !email || !phone || !dob || !password) {
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
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid phone number",
    });
  }
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "m Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long",
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
  //Hashed the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
//create a new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      dob,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// simple test route
const testUserRoute = (req, res) => {
  console.log("Controller: testUserRoute called");
  res.send("User Controller is working!");
};

module.exports = { registerUser, testUserRoute };