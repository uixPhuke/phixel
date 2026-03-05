const express = require('express');
const router = express.Router();
const {registerUser, loginUser, updateUser ,getUsers,getUserById,deleteUser,logoutUser,
  verifyUserOtp, resendOtp, forgetPassword, resetPassword, firebaseAuth, verifyAuth} = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');
const {verifyFirebaseToken} = require('../middlewares/verifyFirebaseToken');

//auth
router.post('/auth/register',registerUser);
router.post('/auth/login',loginUser);

//auth verification and password reset
router.post('/auth/verify-otp',verifyUserOtp);
router.post('/auth/resend-otp',resendOtp);
router.post('/auth/forget-password',forgetPassword);
router.post('/auth/reset-password',resetPassword);

//firebase auth
router.post('/auth/firebase',verifyFirebaseToken,firebaseAuth);

//user verify in frontend
// This route is used to verify the user in the frontend after firebase authentication
router.get('/auth/verify',isAuthenticated,verifyAuth);

//user routes

router.route('/update').put(isAuthenticated,updateUser);
router.route('/users').get(isAuthenticated,getUsers);
router.route('/user/:id').get(isAuthenticated,getUserById).delete(isAuthenticated,deleteUser);
router.post('/auth/logout',logoutUser);


module.exports = router;

