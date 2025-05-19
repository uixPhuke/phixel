const express = require('express');
const router = express.Router();

const { createAddress, getAddresses, updateAddress, deleteAddress } = require('../controllers/addressCtrl');
const { isAuthenticated } = require('../middlewares/auth');
// Route to add a new address
router.post('/add', isAuthenticated, createAddress);
// Route to get all addresses for a user
router.get('/', isAuthenticated, getAddresses);   
// Route to update an address by ID
router.put('/:id', isAuthenticated, updateAddress);
// Route to delete an address by ID
router.delete('/:id', isAuthenticated, deleteAddress);
// Export the router
module.exports = router;