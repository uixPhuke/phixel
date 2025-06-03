const mongoose=require('mongoose')

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppecase:true, // Store discount codes in uppercase
        trim: true, // Remove leading and trailing whitespace
        unique: true, // Ensure discount codes are unique
    },
    description: {
        type: String,
        required: true,
    },
    
    usageLimit: {
        type: Number,
        required: true,
        min: 1, // Ensure usage limit is at least 1
    },
    usedCount: {
        type: Number,
        default: 0, // Default to 0, indicating no usage yet
        min: 0, // Ensure used count is non-negative
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }],
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // Only allow percentage or fixed discounts
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0, // Ensure discount percentage is non-negative
        max: 100, // Ensure discount percentage does not exceed 100%
        default: 0, // Default to 0 if not specified
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0, // Ensure discount value is non-negative
    },
    isActive: {
        type: Boolean,
        default: true, // Default to active
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

discountSchema.index({ code: 1, startDate: 1, endDate: 1 }, { unique: true }); // Ensure unique combination of code and date range

const Discount = mongoose.model('Discount', discountSchema);
module.exports = Discount;
