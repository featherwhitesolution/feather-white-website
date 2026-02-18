const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { createShiprocketOrder } = require('../services/shiprocketService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (for now)
router.post('/', async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user // optional
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Integrating Shiprocket
            try {
                // Populate order data if needed (e.g., product details for weight/dims)
                // For now passing createdOrder directly, ensure service handles it
                const shiprocketResponse = await createShiprocketOrder(createdOrder);

                if (shiprocketResponse && shiprocketResponse.order_id) {
                    createdOrder.shiprocketOrderId = shiprocketResponse.order_id;
                    createdOrder.shipmentId = shiprocketResponse.shipment_id;
                    await createdOrder.save();
                }
            } catch (srError) {
                console.error("Shiprocket Order Creation Failed:", srError.message);
                // We don't fail the whole request, but log it. 
                // Admin can retry via a dashboard later.
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
