const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');
const { createShiprocketOrder } = require('../services/shiprocketService');
const Razorpay = require('razorpay');
const crypto = require('crypto');

router.get('/test', (req, res) => res.send('Order Router Signal Active'));

const razorpay = new Razorpay({
    key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
    key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
router.post('/razorpay', async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100), // Ensure it's a number
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        console.log('Attempting Razorpay Order with Options:', options);
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('FULL Razorpay Error:', error);
        res.status(500).json({ 
            message: error.description || error.message || 'Error creating Razorpay order',
            error: error
        });
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/razorpay/verify
router.post('/razorpay/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.razorpayOrderId = razorpay_order_id;
                order.razorpayPaymentId = razorpay_payment_id;
                order.razorpaySignature = razorpay_signature;
                await order.save();
                res.json({ message: "Payment verified successfully", success: true });
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
            user, // optional
            razorpayOrderId // optional (sent if online payment)
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user: user || null,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                razorpayOrderId
            });

            const createdOrder = await order.save();

            // Integrating Shiprocket
            try {
                const shiprocketResponse = await createShiprocketOrder(createdOrder);

                if (shiprocketResponse && shiprocketResponse.order_id) {
                    createdOrder.shiprocketOrderId = shiprocketResponse.order_id;
                    createdOrder.shipmentId = shiprocketResponse.shipment_id;
                    await createdOrder.save();
                }
            } catch (srError) {
                console.error("Shiprocket Order Creation Failed:", srError.message);
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort('-createdAt').populate('user', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const { status, isPaid, isDelivered } = req.body;
            
            if (status) order.status = status;
            if (typeof isPaid !== 'undefined') order.isPaid = isPaid;
            if (typeof isDelivered !== 'undefined') {
                order.isDelivered = isDelivered;
                if (isDelivered) order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
