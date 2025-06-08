const Discount = require('../models/discountModel');
const Cart = require('../models/cartSchema');

// Create a new discount
const createDiscount = async (req, res) => {
   try {
    const { code, description, usageLimit, discountType, discountPercentage, discountValue, startDate, endDate } = req.body;
    // Validate required fields
    if (!code || !description || !usageLimit || !discountType || (!discountPercentage && !discountValue) || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    //validate the input types
    if (typeof code !== 'string' || typeof description !== 'string' || typeof discountType !== 'string' || typeof startDate !== 'string' || typeof endDate !== 'string') {
      return res.status(400).json({ message: 'Invalid input types' });
    }
    // Validate discount values based on type
    if (discountType === 'percentage') {
      if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
        return res.status(400).json({ message: 'Invalid percentage value' });
      }
    }
    if (discountType === 'fixed') {
      if (typeof discountValue !== 'number' || discountValue < 0) {
        return res.status(400).json({ message: 'Invalid fixed value' });
      }
    }
    //check if discount code already exists
    const existingDiscount=await Discount.findOne({ code: code.toUpperCase()});
    if (existingDiscount) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }
    // Create new discount
    const newDiscount = new Discount({
      code: code.toUpperCase(),
      description,
      usageLimit,
      discountType,
      discountPercentage,
      discountValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    // Save discount to database
    const savedDiscount = await newDiscount.save();
    res.status(201).json({
      message: 'Discount created successfully',
      discount: savedDiscount,
    });
   
   
  } catch (error) {
    res.status(500).json({ message: 'Error creating discount', error });
  }
};

const applyDiscount = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Invalid discount code' });
    }

    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (
      !discount ||
      !discount.isActive ||
      (discount.usageLimit && discount.usedCount >= discount.usageLimit)
    ) {
      return res.status(404).json({ message: 'Discount not found or inactive' });
    }

    const now = new Date();
    if (
      (discount.startDate && now < discount.startDate) ||
      (discount.endDate && now > discount.endDate)
    ) {
      return res.status(400).json({ message: 'Discount is not valid at this time' });
    }

    if (discount.usedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'Discount code already used by this user' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No cart found to apply discount' });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = (cart.totalPrice * discount.discountPercentage) / 100;
    } else if (discount.discountType === 'fixed') {
      discountAmount = discount.discountValue;
    }

    if (discountAmount > cart.totalPrice) {
      discountAmount = cart.totalPrice;
    }

    const finalPrice = cart.totalPrice - discountAmount;

    // Update cart
    cart.totalPrice = finalPrice;
    cart.discountApplied = {
      code: discount.code,
      amount: discountAmount,
      type: discount.discountType,
    };

    await cart.save();

    // Update discount usage
    discount.usedBy.push(req.user._id);
    discount.usedCount += 1;
    await discount.save();

    res.json({
      message: 'Discount applied successfully',
      cart,
      discount,
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ message: 'Error applying discount', error });
  }
};
