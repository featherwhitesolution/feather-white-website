const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: false, // Changed to false to support legacy users
        unique: true,
        sparse: true // Allows multiple null/undefined values
    },
    password: {
        type: String,
        // Password is now optional for OTP-only users, but required if they want to use password login
        required: false,
    },
    shippingAddress: {
        addressLine: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
