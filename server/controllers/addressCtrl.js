const Address = require("../models/addressSchema");

// Create a new address
const createAddress = async (req, res) => {
  const { name, mobileNo, address, city, state, pinCode, country, landmark } =
    req.body;
  const userId = req.user._id;

  if (
    !name ||
    !mobileNo ||
    !address ||
    !city ||
    !state ||
    !pinCode ||
    !country ||
    !landmark
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    const newAddress = new Address({
      userId,
      name,
      mobileNo,
      address,
      city,
      state,
      pinCode,
      country,
      landmark,
    });
    const savedAddress = await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: savedAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
  const userId = req.user._id;

  try {
    //fetch all addresses for the user
    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully",
      addresses,
    });
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Update an address
const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;  // Get user ID from the authenticated user
        const addressId = req.params.id; // Get address ID from the request params
        const { name, mobileNo, address, pincode, city, state, country, landmark } = req.body;

        // Validate addressId
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid addressId' });
        }

        // Find the address by ID and ensure it belongs to the authenticated user
        let addressToUpdate = await Address.findOne({ _id: addressId, userId });

        if (!addressToUpdate) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Update the address fields
        addressToUpdate.name = name || addressToUpdate.name;
        addressToUpdate.mobileNo = mobileNo || addressToUpdate.mobileNo;
        addressToUpdate.address = address || addressToUpdate.address;
        addressToUpdate.pincode = pincode || addressToUpdate.pincode;
        addressToUpdate.city = city || addressToUpdate.city;
        addressToUpdate.state = state || addressToUpdate.state;
        addressToUpdate.country = country || addressToUpdate.country;
        addressToUpdate.landmark = landmark || addressToUpdate.landmark;

        // Save the updated address
        const updatedAddress = await addressToUpdate.save();

        return res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//delete address
const deleteAddress = async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;

  try {
    // Validate addressId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid addressId" });
    }

    // Find the address by ID and ensure it belongs to the authenticated user
    const addressToDelete = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!addressToDelete) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Set default address
const setDefaultAddress = async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;

  try {
    // Validate addressId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid addressId" });
    }

    // Find the address by ID and ensure it belongs to the authenticated user
    const addressToUpdate = await Address.findOne({ _id: addressId, userId });

    if (!addressToUpdate) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Set the default address
    await Address.updateMany({ userId }, { isDefault: false });
    addressToUpdate.isDefault = true;
    await addressToUpdate.save();

    return res.status(200).json({ message: "Default address set successfully" });
  } catch (error) {
    console.error("Error setting default address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Export the functions
module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
