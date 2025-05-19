const express = require('express');
const router = express.Router();
const { registerUser,loginUser,updateUser } = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');


router.post('/register',registerUser);
router.post('/login',loginUser);
router.route('/update').put(isAuthenticated,updateUser);

module.exports = router;


