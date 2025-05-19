const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {createToken} = require("../middlewares/auth");

// Register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, phone, dob, password,isAdmin } = req.body;

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
      message: "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long",
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
   const token= createToken(newUser._id, newUser.email, res);
     res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//login user
const loginUser=async(req,res)=>{
    const {emailOrUsername,password}=req.body;
    if(!emailOrUsername || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }
    try{
        const user=await User.findOne({
          $or: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ]});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token=createToken(user._id,user.email,res);
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user,
            token
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })
    }
}

module.exports = { registerUser,loginUser };
