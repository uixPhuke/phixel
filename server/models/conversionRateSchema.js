const mongoose = require('mongoose');
const conversionRateSchema = new mongoose.Schema({
    fromCurrency: {
        type: String,
        required: true
    },
    toCurrency: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const ConversionRate = mongoose.model('ConversionRate', conversionRateSchema);
module.exports = ConversionRate;
// This schema defines a conversion rate between two currencies.