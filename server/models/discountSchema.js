const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1,
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        validate: {
            validator: function(value) {
                // Only validate if discountType is 'percentage'
                return this.discountType !== 'percentage' || (value >= 0 && value <= 100);
            },
            message: 'Hi ,Percentage must be between 0-100 when discountType is percentage'
        }
    },
    discountValue: {
        type: Number,
        min: 0,
        validate: {
            validator: function(value) {
                // Only validate if discountType is 'fixed'
                return this.discountType !== 'fixed' || value >= 0;
            },
            message: 'Fixed value must be positive when discountType is fixed'
        }
    },
    isActive: {
        type: Boolean,
        default: true,
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

// Pre-save hook to ensure only one discount field is set
discountSchema.pre('save', function(next) {
    if (this.discountType === 'percentage' && this.discountValue !== undefined) {
        this.discountValue = undefined; // Clear fixed value if percentage is set
    } else if (this.discountType === 'fixed' && this.discountPercentage !== undefined) {
        this.discountPercentage = undefined; // Clear percentage if fixed is set
    }
    next();
});

// Compound index
discountSchema.index({ code: 1, startDate: 1, endDate: 1 }, { unique: true });

module.exports = mongoose.model('Discount', discountSchema);