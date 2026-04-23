import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { clearCart } from '../redux/cartSlice';
import api from '../utils/api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const Checkout = () => {
    const { userInfo } = useSelector(state => state.user);
    const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: userInfo?.mobile || '',
        address: userInfo?.shippingAddress?.addressLine || '',
        city: userInfo?.shippingAddress?.city || '',
        state: userInfo?.shippingAddress?.state || '',
        postalCode: userInfo?.shippingAddress?.pincode || '',
        country: 'India'
    });

    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentConfig, setPaymentConfig] = useState({
        cashOnDelivery: true,
        onlinePayment: false,
    });

    React.useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const { data } = await api.get('/api/home/payment');
                if (data?.data) {
                    setPaymentConfig(data.data);
                    // Set default payment method based on availability
                    if (data.data.cashOnDelivery) {
                        setPaymentMethod('COD');
                    } else if (data.data.onlinePayment) {
                        setPaymentMethod('Online');
                    }
                } else {
                    setPaymentMethod('COD'); // Fallback
                }
            } catch (error) {
                console.error('Error fetching payment settings:', error);
                setPaymentMethod('COD');
            }
        };
        fetchPaymentSettings();
        
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || userInfo.name || '',
                email: prev.email || userInfo.email || '',
                phone: prev.phone || userInfo.mobile || '',
                address: prev.address || userInfo.shippingAddress?.addressLine || '',
                city: prev.city || userInfo.shippingAddress?.city || '',
                state: prev.state || userInfo.shippingAddress?.state || '',
                postalCode: prev.postalCode || userInfo.shippingAddress?.pincode || ''
            }));
        }
    }, [userInfo]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderDate, setOrderDate] = useState(null);

    // Calculate totals
    const shipping = totalAmount > 999 ? 0 : 50;
    const itemsPrice = totalAmount;
    const taxPrice = 0; 
    const finalTotal = itemsPrice + shipping + taxPrice;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderData = {
            orderItems: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
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
                phone: formData.phone
            },
            paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment',
            itemsPrice,
            taxPrice,
            shippingPrice: shipping,
            totalPrice: finalTotal,
            user: userInfo ? userInfo._id : null
        };

        try {
            if (paymentMethod === 'Online') {
                const res = await loadRazorpay();
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setIsProcessing(false);
                    return;
                }

                // 1. Create order on backend (Razorpay Order)
                const { data: rzpOrder } = await api.post('/api/orders/razorpay', { amount: finalTotal });

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Feather White",
                    description: "Skincare Purchase",
                    image: "/logo_dark.png", 
                    order_id: rzpOrder.id,
                    handler: async function (response) {
                        try {
                            // 2. Once payment done, create the actual order in DB
                            const { data: createdOrder } = await api.post('/api/orders', {
                                ...orderData,
                                razorpayOrderId: rzpOrder.id
                            });

                            // 3. Verify payment on backend
                            const { data: verification } = await api.post('/api/orders/razorpay/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: createdOrder._id
                            });

                            if (verification.success) {
                                setOrderId(`FW-${createdOrder._id.toString().slice(-6).toUpperCase()}`);
                                setOrderDate(new Date().toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }));
                                setOrderPlaced(true);
                                dispatch(clearCart());
                            }
                        } catch (err) {
                            console.error("Verification Error:", err);
                            alert("Payment verification failed. Please contact support.");
                        }
                    },
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone
                    },
                    notes: {
                        address: formData.address
                    },
                    theme: {
                        color: "#C5A059" // Feather White Gold
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setIsProcessing(false);

            } else {
                // Cash on Delivery Logic
                const { data } = await api.post('/api/orders', orderData);
                setOrderId(`FW-${data._id.toString().slice(-6).toUpperCase()}`);
                setOrderDate(new Date().toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                }));
                setOrderPlaced(true);
                dispatch(clearCart());
            }
        } catch (error) {
            console.error('Error placing order:', error);
            const serverError = error.response?.data?.error;
            const errorMsg = serverError ? JSON.stringify(serverError) : (error.response?.data?.message || error.message || 'Unknown error');
            alert('Failed to place order: ' + errorMsg);
        } finally {
            if (paymentMethod !== 'Online') {
                setIsProcessing(false);
            }
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
                                {paymentConfig.cashOnDelivery && (
                                    <label className="flex items-center space-x-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all group">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-gold-500 focus:ring-gold-500 bg-navy-900 border-white/30 transition-all cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <span className="block font-bold text-cream-100">Cash on Delivery (COD)</span>
                                            <span className="text-xs text-gray-500">Pay when your order arrives.</span>
                                        </div>
                                    </label>
                                )}

                                {paymentConfig.onlinePayment ? (
                                    <label className="flex items-center space-x-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all group">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Online"
                                            checked={paymentMethod === 'Online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-gold-500 focus:ring-gold-500 bg-navy-900 border-white/30 transition-all cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <span className="block font-bold text-cream-100">Online Payment</span>
                                            <span className="text-xs text-gray-500">Secure payment via Cards, UPI, or Net Banking.</span>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="flex items-center space-x-3 p-4 border border-white/5 rounded-xl opacity-30 cursor-not-allowed">
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                                        <div className="flex-1">
                                            <span className="block font-bold">Online Payment</span>
                                            <span className="text-xs">Temporarily unavailable</span>
                                        </div>
                                    </div>
                                )}

                                {!paymentConfig.cashOnDelivery && !paymentConfig.onlinePayment && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold text-center">
                                        No payment methods currently available. Please contact support.
                                    </div>
                                )}
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
                                            <img src={optimizeCloudinaryUrl(item.image, 'w_100,h_100,c_fill,q_auto,f_auto')} alt={item.name} className="w-full h-full object-cover" />
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
