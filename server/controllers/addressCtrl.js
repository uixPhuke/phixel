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
