const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Skincare', 'Makeup', 'Fragrance', 'Haircare'],
    },
    skinType: {
        type: String,
        enum: ['All', 'Dry', 'Oily', 'Sensitive', 'Combination'],
        default: 'All',
    },
    image: {
        type: String, // URL to image
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
