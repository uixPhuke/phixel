const { get } = require('mongoose');
const ConversionRate = require('../models/conversionRateSchema');



// Get a single conversion rate by fromCurrency and toCurrency (via params)
const getConversionRate = async (req, res) => {
    const { fromCurrency, toCurrency } = req.params;

    if (!fromCurrency || !toCurrency) {
        return res.status(400).json({
            success: false,
            message: 'Both fromCurrency and toCurrency are required.',
        });
    }

    try {
        const rate = await ConversionRate.findOne({ fromCurrency, toCurrency });

        if (!rate) {
            return res.status(404).json({
                success: false,
                message: 'Conversion rate not found.',
            });
        }

        res.status(200).json({
            success: true,
            conversionRate: rate,
        });
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Update or insert a conversion rate
const updateConversionRate = async (req, res) => {
    const { fromCurrency, toCurrency, rate } = req.body;

    if (!fromCurrency || !toCurrency || rate == null) {
        return res.status(400).json({
            success: false,
            message: 'fromCurrency, toCurrency, and rate are required.',
        });
    }

    try {
        const updatedRate = await ConversionRate.findOneAndUpdate(
            { fromCurrency, toCurrency },
            { rate, updatedAt: Date.now() },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Conversion rate updated successfully.',
            conversionRate: updatedRate,
        });
    } catch (error) {
        console.error('Error updating conversion rate:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get all conversion rates
 const getAllConversionRates = async (req, res) => {
    try {
        const rates = await ConversionRate.find();
        res.status(200).json({
            success: true,
            rates,
        });
    } catch (error) {
        console.error('Error fetching conversion rates:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
module.exports = {
    getConversionRate,
    updateConversionRate,
    getAllConversionRates,
} 