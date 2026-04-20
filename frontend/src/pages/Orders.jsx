import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Search, ChevronRight, MapPin, CreditCard, Calendar, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const Orders = () => {
    const { userInfo } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login'); // Redirect to login if not logged in
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userInfo, navigate]);

    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="pt-24 pb-20 px-4 min-h-screen bg-navy-950 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <nav className="text-xs text-cream-100/40 mb-2 flex items-center space-x-2">
                            <Link to="/" className="hover:text-gold-500">Your Account</Link>
                            <ChevronRight size={12} />
                            <span className="text-gold-500 font-bold">Your Orders</span>
                        </nav>
                        <h1 className="text-4xl font-serif text-white font-bold tracking-tight">Your Orders</h1>
                    </div>
                    
                    {/* Search Bar - Amazon Style */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/40 group-focus-within:text-gold-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search all orders..."
                            className="w-full bg-navy-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-200 flex items-center space-x-3 backdrop-blur-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Filter Tabs - Amazon Style */}
                <div className="flex space-x-8 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide">
                    {['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled'].map((tab, i) => (
                        <button key={i} className={`pb-2 whitespace-nowrap text-sm font-bold transition-all ${i === 0 ? 'text-gold-500 border-b-2 border-gold-500' : 'text-cream-100/40 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-navy-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center">
                            <Package className="mx-auto w-16 h-16 text-cream-100/20 mb-4" />
                            <p className="text-cream-100/40 text-lg">No orders found matching your search.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order._id} 
                                className="bg-navy-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-gold-500/30 transition-all group"
                            >
                                {/* Order Header - Amazon Card Style */}
                                <div className="bg-navy-800/80 px-6 py-4 border-b border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-wider">
                                    <div className="space-y-1">
                                        <p className="text-cream-100/40">Order Placed</p>
                                        <p className="text-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-cream-100/40">Total</p>
                                        <p className="text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-cream-100/40">Ship To</p>
                                        <p className="text-gold-500 hover:text-gold-400 cursor-pointer transition-colors truncate">{order.shippingAddress?.name || userInfo.name}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <p className="text-cream-100/40">Order # {order._id.slice(-8).toUpperCase()}</p>
                                        <button className="text-gold-500 hover:underline">View details</button>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6 flex flex-col md:flex-row gap-8 text-left">
                                    <div className="flex-grow space-y-6">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {order.isDelivered ? (
                                                <div className="flex items-center text-green-500 space-x-2">
                                                    <CheckCircle size={18} />
                                                    <span className="font-bold text-lg">Delivered</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-blue-400 space-x-2">
                                                    <Truck size={22} className="animate-pulse" />
                                                    <span className="font-bold text-lg">In Transit</span>
                                                </div>
                                            )}
                                        </div>

                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="flex space-x-6 items-center border-b border-white/5 last:border-0 pb-4 last:pb-0 text-left">
                                                <img src={optimizeCloudinaryUrl(item.image, 'w_200,h_200,c_fill,q_auto,f_auto')} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-black shadow-inner flex-shrink-0" />
                                                <div className="space-y-2">
                                                    <Link to={`/products/${item.product}`} className="text-lg font-serif font-bold text-white hover:text-gold-500 transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm bg-white/5 px-2 py-1 rounded text-cream-100/60 font-medium">Qty: {item.quantity || item.qty || 0}</span>
                                                        <span className="text-gold-500 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <button className="mt-2 px-4 py-1.5 bg-gold-600 text-white text-xs font-black rounded-full hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/10">Buy it again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons - Amazon Sidebar Style */}
                                    <div className="md:w-56 space-y-3 flex flex-col shrink-0">
                                        <button className="w-full py-2.5 bg-gold-600 text-white text-sm font-black rounded-xl hover:bg-gold-500 shadow-xl shadow-gold-600/10 transition-all">Track package</button>
                                        <button className="w-full py-2.5 bg-white/5 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">Return items</button>
                                        <button className="w-full py-2.5 bg-white/5 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">Get product support</button>
                                        <button className="w-full py-2.5 bg-white/5 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">Write a product review</button>
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="bg-navy-800/30 px-6 py-3 flex items-center justify-between text-[10px] text-cream-100/20 uppercase tracking-[0.2em]">
                                    <div className="flex space-x-4">
                                        <span>Payment: {order.paymentMethod}</span>
                                        <span>Status: {order.isPaid ? 'Paid' : 'Pending'}</span>
                                    </div>
                                    <span className="hover:text-gold-500 transition-colors cursor-pointer">Archive Order</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
