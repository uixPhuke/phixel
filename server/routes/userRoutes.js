const express = require('express');
const router = express.Router();
const { testUserRoute } = require('../controllers/userCtrl'); 

router.get('/test', testUserRoute);

module.exports = router;


