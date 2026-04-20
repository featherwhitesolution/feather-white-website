import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Package, Truck, User, CreditCard, ChevronDown, CheckCircle, Clock, ExternalLink, Search, Mail, Phone, MapPin, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const AdminOrders = () => {
    const { userInfo } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('/api/orders', config);
            console.log("Admin API Success: Fetching all orders", data);
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error("Admin API Error: Fetching orders failed", err);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        }
    }, [userInfo]);

    const handleUpdateStatus = async (orderId, updates) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`/api/orders/${orderId}/status`, updates, config);
            fetchOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                // Update selected order view
                setSelectedOrder({ ...selectedOrder, ...updates });
            }
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'Shipped': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    if (loading && orders.length === 0) return (
        <div className="h-60 flex flex-col items-center justify-center animate-pulse">
            <Clock className="animate-spin text-gold-500 mb-2" />
            <p className="text-gold-500/60">Loading Order History...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            
            {/* Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Customer Name..."
                        className="w-full bg-navy-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-gold-500 transition-all font-medium shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <select 
                        className="w-full bg-navy-800 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white appearance-none focus:outline-none focus:border-gold-500 shadow-xl cursor-pointer font-bold"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-navy-800/80 text-[10px] uppercase tracking-[0.2em] font-black text-cream-100/40">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </td>
                                    <td className="px-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-cream-100/40 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6">
                                        <div className="flex flex-col">
                                            <span className="text-gold-500 font-bold text-sm">{order.user?.name || 'Guest User'}</span>
                                            <span className="text-cream-100/40 text-xs">{order.user?.email || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6">
                                        <span className="text-white font-black">₹{order.totalPrice.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-gold-600/20 hover:bg-gold-600/40 text-gold-500 p-2.5 rounded-xl transition-all border border-gold-500/20"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center opacity-30 flex flex-col items-center">
                        <Package size={48} className="mb-4" />
                        <p className="font-serif">No orders match your filters</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-navy-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="bg-navy-800 p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-2xl font-serif text-white font-bold">Order Details</h3>
                                    <p className="text-xs text-gold-500 font-bold uppercase tracking-widest mt-1">ID: #{selectedOrder._id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-cream-100/40 hover:text-white transition-colors">Close ×</button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto space-y-8 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Info Block 1 */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                                            <h4 className="flex items-center space-x-2 text-gold-500 text-sm font-black uppercase tracking-widest">
                                                <User size={16} />
                                                <span>Customer Information</span>
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="text-lg font-serif font-bold text-white">{selectedOrder.user?.name || 'Guest'}</p>
                                                <div className="flex items-center space-x-2 text-sm text-cream-100/60">
                                                    <Mail size={14} /> <span>{selectedOrder.user?.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-cream-100/60">
                                                    <Phone size={14} /> <span>{selectedOrder.shippingAddress?.mobile || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                                            <h4 className="flex items-center space-x-2 text-gold-500 text-sm font-black uppercase tracking-widest">
                                                <MapPin size={16} />
                                                <span>Shipping Address</span>
                                            </h4>
                                            <p className="text-sm text-cream-100/70 leading-relaxed font-medium">
                                                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, 
                                                {selectedOrder.shippingAddress?.pincode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="space-y-6">
                                        <div className="bg-navy-800/80 p-6 rounded-2xl border-2 border-gold-600/20 space-y-6 shadow-2xl">
                                            <h4 className="text-gold-500 text-sm font-black uppercase tracking-widest">Manage Status</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, { isPaid: !selectedOrder.isPaid })}
                                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase transition-all border ${
                                                        selectedOrder.isPaid ? 'bg-green-600 text-white border-green-500' : 'bg-white/5 text-cream-100/40 border-white/10'
                                                    }`}
                                                >
                                                    {selectedOrder.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(selectedOrder._id, { isDelivered: !selectedOrder.isDelivered })}
                                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase transition-all border ${
                                                        selectedOrder.isDelivered ? 'bg-green-600 text-white border-green-500' : 'bg-white/5 text-cream-100/40 border-white/10'
                                                    }`}
                                                >
                                                    {selectedOrder.isDelivered ? 'Mark Undelivered' : 'Mark Delivered'}
                                                </button>
                                            </div>
                                            <select 
                                                className="w-full bg-black/80 border-2 border-gold-400/40 rounded-xl px-4 py-3.5 text-gold-500 font-black text-sm focus:border-gold-500 shadow-2xl hover:bg-black transition-all"
                                                value={selectedOrder.status || 'Processing'}
                                                onChange={(e) => handleUpdateStatus(selectedOrder._id, { status: e.target.value })}
                                            >
                                                <option value="Processing" className="bg-navy-900">🕒 Processing</option>
                                                <option value="Shipped" className="bg-navy-900">📦 Shipped</option>
                                                <option value="Delivered" className="bg-navy-900">✅ Delivered</option>
                                                <option value="Cancelled" className="bg-navy-900">❌ Cancelled</option>
                                            </select>
                                        </div>

                                        {selectedOrder.shiprocketOrderId && (
                                            <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center space-x-3 text-blue-400">
                                                    <Truck size={20} />
                                                    <span className="text-sm font-bold">Shiprocket Active</span>
                                                </div>
                                                <span className="text-xs font-black font-mono text-blue-300">#{selectedOrder.shiprocketOrderId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="space-y-4">
                                    <h4 className="text-white font-serif text-xl border-b border-white/5 pb-2">Order Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                                <img src={optimizeCloudinaryUrl(item.image, 'w_100,h_100,c_fill,q_auto,f_auto')} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-black" />
                                                <div className="flex-grow">
                                                    <p className="font-serif font-bold text-white uppercase tracking-tight">{item.name}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm bg-white/5 px-2 py-1 rounded text-cream-100/60 font-medium">Qty: {item.quantity || item.qty || 0}</span>
                                                        <span className="text-gold-500 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-gold-500 font-black">
                                                    ₹{(item.price * (item.quantity || item.qty || 0)).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-navy-800 p-6 border-t border-white/5 flex justify-between items-center shrink-0">
                                <div className="text-cream-100/40 text-xs font-bold uppercase tracking-widest">Payment: {selectedOrder.paymentMethod}</div>
                                <div className="text-2xl font-black text-white">₹{selectedOrder.totalPrice.toLocaleString()}</div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminOrders;
