const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { keyword, category, skinType, minPrice, maxPrice, isFeatured, limit } = req.query;

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

        if (isFeatured) {
            query.isFeatured = isFeatured === 'true';
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let productQuery = Product.find(query).lean();
        
        if (limit) {
            productQuery = productQuery.limit(Number(limit));
        }
        
        const products = await productQuery;
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

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin (simplified for now)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
            // Update fields
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
