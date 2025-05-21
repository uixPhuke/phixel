const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

//Create Token
const createToken = (userID, email, res) => {
  const token = jwt.sign({ userID, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  //set Cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return token;
};

//Check is AUTHENTICATED
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Please login to access this resource",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "User not found, please login again",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      isLogin: false,
      message: "Invalid token, please login again",
    });
  }
};

//isAdmin
const isAdmin = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Please login to access this resource",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "User not found, please login again",
      });
    }
    if (user.isAdmin === false) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource , Forbidden Access",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      isLogin: false,
      message: "Invalid token, please login again",
    });
  }
}

module.exports = { createToken, isAuthenticated ,isAdmin};
