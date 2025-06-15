const express= require('express');
const router = express.Router();
const { createContact,
    getAllContacts,
    getContactById,
    deleteContact}=require('../controllers/contactCtrl')

 const {isAuthenticated ,isAdmin} = require('../middlewares/auth'); 
// Define routes for contact management
router.post('/contacts', createContact); // Create a new contact
router.get('/contacts', isAdmin,getAllContacts); // Get all contacts
router.get('/contacts/:id', isAdmin,getContactById); // Get contact by ID
router.delete('/contacts/:id', isAdmin,deleteContact); // Delete contact by ID
// Export the router
module.exports = router;