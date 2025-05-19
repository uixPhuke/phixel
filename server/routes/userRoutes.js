const express = require('express');
const router = express.Router();
const { testUserRoute } = require('../controllers/userCtrl'); 
const { registerUser } = require('../controllers/userCtrl');
const {isAuthenticated}= require('../middlewares/auth');


router.get('/test', testUserRoute);
router.post('/register',registerUser);

module.exports = router;


