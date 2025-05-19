const express = require('express');
const router = express.Router();
const { registerUser,loginUser,updateUser,getUsers ,getUserById,deleteUser,logoutUser} = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');


router.post('/register',registerUser);
router.post('/login',loginUser);
router.route('/update').put(isAuthenticated,updateUser);
router.route('/users').get(isAuthenticated,getUsers);
router.route('/user/:id').get(isAuthenticated,getUserById).delete(isAuthenticated,deleteUser);
router.get('/logout',logoutUser);


module.exports = router;


