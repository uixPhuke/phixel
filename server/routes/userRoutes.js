const express = require('express');
const router = express.Router();
const {registerUser, loginUser, updateUser ,getUsers,getUserById,deleteUser,logoutUser,
  verifyUserOtp, resendOtp, forgetPassword, resetPassword, firebaseAuth, verifyAuth} = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');
const {verifyFirebaseToken} = require('../middlewares/verifyFirebaseToken');

//auth
router.post('/register',registerUser);
router.post('/login',loginUser);

//auth verification and password reset
router.post('/verify-otp',verifyUserOtp);
router.post('/resend-otp',resendOtp);
router.post('/forget-password',forgetPassword);
router.post('/reset-password',resetPassword);

//firebase auth
router.post('/firebase-auth',verifyFirebaseToken,firebaseAuth);
//user verify in frontend
// This route is used to verify the user in the frontend after firebase authentication
router.get('/verify-auth',verifyFirebaseToken,verifyAuth);

//user routes

router.route('/update').put(isAuthenticated,updateUser);
router.route('/users').get(isAuthenticated,getUsers);
router.route('/user/:id').get(isAuthenticated,getUserById).delete(isAuthenticated,deleteUser);
router.get('/logout',logoutUser);


module.exports = router;

