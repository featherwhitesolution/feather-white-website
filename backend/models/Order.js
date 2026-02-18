const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Can be guest checkout for now, or required if we enforce login
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cash on Delivery', // or 'PayPal', 'Stripe'
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    // Shiprocket Integration
    shiprocketOrderId: { type: String },
    shipmentId: { type: String },
    awbCode: { type: String },
    courierName: { type: String },
    trackingUrl: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
