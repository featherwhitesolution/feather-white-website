const express = require('express');
const router = express.Router();
const { checkServiceability, getTrackingData, generateLabel } = require('../services/shiprocketService');

// @desc    Check Serviceability & Rates
// @route   POST /api/shipping/check-serviceability
// @access  Public
router.post('/check-serviceability', async (req, res) => {
    const { pickupPostcode, deliveryPostcode, weight, cod } = req.body;

    // Basic validation
    if (!deliveryPostcode) {
        return res.status(400).json({ message: 'Delivery pincode is required' });
    }

    try {
        // Default pickup postcode if not provided (e.g., your warehouse)
        const pickup = pickupPostcode || '110001'; // Default Delhi
        const w = weight || 0.5; // Default 0.5kg
        const c = cod || 0; // Default Not COD

        const data = await checkServiceability(pickup, deliveryPostcode, w, c);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate Label
// @route   POST /api/shipping/generate-label
// @access  Public (Should be Admin only)
router.post('/generate-label', async (req, res) => {
    const { shipmentId } = req.body;
    try {
        const data = await generateLabel(shipmentId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Track Shipment
// @route   GET /api/shipping/track/:shipmentId
// @access  Public
router.get('/track/:shipmentId', async (req, res) => {
    try {
        const data = await getTrackingData(req.params.shipmentId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
