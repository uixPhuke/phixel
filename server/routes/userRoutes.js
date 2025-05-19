const express = require('express');
const router = express.Router();
const { registerUser,loginUser,updateUser,getUsers } = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');


router.post('/register',registerUser);
router.post('/login',loginUser);
router.route('/update').put(isAuthenticated,updateUser);
router.route('/users').get(isAuthenticated,getUsers);

module.exports = router;


