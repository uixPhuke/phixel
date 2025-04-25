const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    console.log('userRoutes.js loaded');
    res.send('User route is working');
}
);

module.exports = router;


