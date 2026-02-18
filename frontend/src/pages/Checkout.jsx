import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { clearCart } from '../redux/cartSlice';
import axios from 'axios';

const Checkout = () => {
    const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderDate, setOrderDate] = useState(null);

    // Calculate totals
    const shipping = totalAmount > 999 ? 0 : 50;
    const itemsPrice = totalAmount;
    const taxPrice = 0; // Assuming inclusive for simplicity or 0
    const finalTotal = itemsPrice + shipping + taxPrice;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Generate a random Order ID (Mock)
        const newOrderId = `FW-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const orderData = {
            orderItems: items.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item.id
            })),
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
                state: formData.state,
                phone: formData.phone // Adding phone here as valuable info
            },
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice: shipping,
            totalPrice: finalTotal,
            user: null // Guest checkout for now
        };

        try {
            // Attempt to send to backend
            // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // const response = await axios.post(`${API_URL}/api/orders`, orderData);

            // For now, simulate success after delay since backend might not be ready
            await new Promise(resolve => setTimeout(resolve, 1500));

            setOrderId(newOrderId);
            setOrderDate(new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
            setOrderPlaced(true);
            dispatch(clearCart());
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-navy-900 text-cream-100 flex flex-col items-center justify-center p-4">
                <div className="bg-navy-800 p-8 rounded-2xl border border-gold-500/30 text-center max-w-md w-full shadow-2xl">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-serif text-gold-500 mb-6">Order Confirmed!</h2>

                    <div className="space-y-3 text-left w-full mb-8 bg-navy-900/50 p-6 rounded-lg border border-white/10 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Order ID:</span>
                            <span className="text-gold-500 font-bold">{orderId}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Payment Confirmed:</span>
                            <span className="text-cream-100">{orderDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Payment Method:</span>
                            <span className="text-cream-100">{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Shipping Method:</span>
                            <span className="text-cream-100">Standard Delivery</span>
                        </div>
                        <div className="pt-1">
                            <span className="text-gray-400 block mb-1">Billing Address:</span>
                            <p className="text-gray-300 leading-relaxed font-light">
                                {formData.fullName}<br />
                                {formData.address}<br />
                                {formData.city}, {formData.postalCode}<br />
                                {formData.country}
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-8">Thank you for your purchase. We've received your order and will begin processing it shortly.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-navy-900 text-cream-100 flex flex-col items-center justify-center p-4">
                <p className="text-xl mb-4">Your cart is empty.</p>
                <Link to="/products" className="text-gold-500 hover:underline">Go to Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-900 text-cream-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/cart" className="inline-flex items-center text-gold-500 hover:text-cream-100 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Cart
                </Link>

                <h1 className="text-3xl md:text-4xl font-serif text-gold-500 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Form */}
                    <div className="space-y-8">
                        {/* Shipping Details */}
                        <div className="bg-navy-800/50 p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-serif text-cream-100 mb-4">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Example: +91...</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-navy-800/50 p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-serif text-cream-100 mb-4">Payment Method</h2>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-gold-500 focus:ring-gold-500 bg-navy-900 border-white/30"
                                    />
                                    <span>Cash on Delivery (COD)</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors opacity-60">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        disabled
                                        className="text-gold-500 focus:ring-gold-500 bg-navy-900 border-white/30"
                                    />
                                    <span>Online Payment (Coming Soon)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-serif text-cream-100 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <span className="absolute top-0 right-0 bg-gold-500 text-navy-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-bl-md">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-cream-100 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gold-500">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold text-gold-500">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing}
                                className={`w-full py-4 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                            >
                                {isProcessing ? 'Processing...' : `Place Order (₹${finalTotal.toLocaleString('en-IN')})`}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                By placing this order, you agree to our <Link to="/policies/terms" className="text-gold-500 hover:underline">Terms of Service</Link> and <Link to="/policies/privacy" className="text-gold-500 hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
