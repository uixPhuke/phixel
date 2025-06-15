const mongoose=require('mongoose');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Simple validation for 10 digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;