const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { keyword, category, skinType, minPrice, maxPrice } = req.query;

        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (skinType) {
            query.skinType = skinType;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
