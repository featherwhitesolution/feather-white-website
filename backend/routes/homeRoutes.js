const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');

// Handle BOTH /api/home (no slash) and /api/home/ (with slash)
router.route('/')
    .get(async (req, res) => {
        try {
            const content = await HomeContent.find({});
            res.json(content);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const { section, data } = req.body;
            if (!section || !data) {
                return res.status(400).json({ message: 'Section name and data are required' });
            }
            const content = await HomeContent.findOneAndUpdate(
                { section },
                { section, data },
                { new: true, upsert: true }
            );
            res.json(content);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

// @desc    Get home page content by section
// @route   GET /api/home/:section
router.get('/:section', async (req, res) => {
    try {
        const content = await HomeContent.findOne({ section: req.params.section });
        if (content) {
            res.json(content);
        } else {
            res.status(404).json({ message: 'Content segment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
