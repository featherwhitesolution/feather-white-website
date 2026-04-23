import React, { useState } from 'react';
import api from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { Settings, Lock, Mail, User, Store, Percent, Truck, Bell, ShieldCheck, Save, Clock, HelpCircle, AlertCircle, CreditCard } from 'lucide-react';
import { updateUserInfo } from '../../redux/userSlice';

const AdminSettings = () => {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState('Account');
    
    // Account States
    const [accountData, setAccountData] = useState({
        name: userInfo.name,
        email: userInfo.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Store States
    const [storeConfig, setStoreConfig] = useState({
        currency: 'INR',
        taxRate: '18',
        freeShippingThreshold: '999',
    });

    // Notification States
    const [notificationConfig, setNotificationConfig] = useState({
        emailOrderNotifications: true,
        adminSmsAlerts: false,
        weeklyPerformanceReports: true,
    });
    
    // Payment Gateway States
    const [paymentConfig, setPaymentConfig] = useState({
        cashOnDelivery: true,
        onlinePayment: false,
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const storeRes = await api.get('/api/home/store');
                if (storeRes.data?.data) {
                    setStoreConfig(storeRes.data.data);
                }
            } catch (err) {
                console.log('Store settings not found, using defaults.');
            }
            try {
                const notifRes = await api.get('/api/home/notification');
                if (notifRes.data?.data) {
                    setNotificationConfig(notifRes.data.data);
                }
            } catch (err) {
                console.log('Notification settings not found, using defaults.');
            }
            try {
                const payRes = await api.get('/api/home/payment');
                if (payRes.data?.data) {
                    setPaymentConfig(payRes.data.data);
                }
            } catch (err) {
                console.log('Payment settings not found, using defaults.');
            }
        };
        fetchSettings();
    }, []);

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match!' });
            return;
        }

        try {
            // This route now exists in userRoutes.js
            const { data } = await api.put('/api/users/profile', accountData);
            
            dispatch(updateUserInfo(data));
            setStatus({ type: 'success', message: 'Account updated successfully!' });
            setAccountData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleStoreUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/api/home', { section: 'store', data: storeConfig });
            setStatus({ type: 'success', message: 'Store configuration updated!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Store update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/api/home', { section: 'notification', data: notificationConfig });
            setStatus({ type: 'success', message: 'Notification preferences updated!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Notification update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/api/home', { section: 'payment', data: paymentConfig });
            setStatus({ type: 'success', message: 'Payment gateway settings updated!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Payment update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl space-y-8 animate-fade-in-up">
            
            {/* Status Messages */}
            {status.message && (
                <div className={`p-5 rounded-2xl border-2 flex items-center justify-between text-sm font-black uppercase tracking-wider shadow-2xl ${
                    status.type === 'success' ? 'bg-green-600/10 border-green-500/30 text-green-400' : 'bg-red-600/10 border-red-500/30 text-red-400 blur-none'
                }`}>
                    <div className="flex items-center space-x-3">
                        {status.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                        <span>{status.message}</span>
                    </div>
                    <button onClick={() => setStatus({type:'', message:''})} className="opacity-40 hover:opacity-100">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left">
                
                {/* Left: Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-navy-800/80 p-6 rounded-3xl border border-white/5 space-y-2 shadow-2xl backdrop-blur-xl sticky top-8">
                        <h3 className="text-white font-serif text-xl mb-6 flex items-center space-x-2">
                            <Settings className="text-gold-500" size={20} />
                            <span>System Configuration</span>
                        </h3>
                        <button 
                            onClick={() => setActiveSection('Account')}
                            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                activeSection === 'Account' ? 'bg-gold-500 text-navy-900 shadow-xl scale-105' : 'text-white hover:bg-white/10 hover:text-gold-500'
                            }`}
                        >
                            <User size={18} />
                            <span>Account Admin</span>
                        </button>
                        <button 
                            onClick={() => setActiveSection('Store')}
                            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                activeSection === 'Store' ? 'bg-gold-500 text-navy-900 shadow-xl scale-105' : 'text-white hover:bg-white/10 hover:text-gold-500'
                            }`}
                        >
                            <Store size={18} />
                            <span>Store Global</span>
                        </button>
                        <button 
                            onClick={() => setActiveSection('Notification')}
                            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                activeSection === 'Notification' ? 'bg-gold-500 text-navy-900 shadow-xl scale-105' : 'text-white hover:bg-white/10 hover:text-gold-500'
                            }`}
                        >
                            <Bell size={18} />
                            <span>Notification</span>
                        </button>
                        <button 
                            onClick={() => setActiveSection('Payment')}
                            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                activeSection === 'Payment' ? 'bg-gold-500 text-navy-900 shadow-xl scale-105' : 'text-white hover:bg-white/10 hover:text-gold-500'
                            }`}
                        >
                            <CreditCard size={18} />
                            <span>Payment Gateway</span>
                        </button>
                    </div>
                </div>

                {/* Right: Content Area */}
                <div className="lg:col-span-3">
                    
                    {activeSection === 'Account' && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
                            <div className="flex items-center space-x-3 mb-10 border-b border-white/5 pb-6">
                                <Lock className="text-gold-500" size={24} />
                                <h2 className="text-2xl font-serif text-white">Security & Profile</h2>
                            </div>

                            <form onSubmit={handleAccountUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cream-100/30">Display Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-500 transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                className="w-full bg-navy-950 border border-gold-500/20 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:outline-none focus:border-gold-500 transition-all shadow-inner"
                                                value={accountData.name}
                                                onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cream-100/30">Registered Email (Login ID)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-500 transition-colors" size={18} />
                                            <input 
                                                type="email" 
                                                className="w-full bg-navy-950 border border-gold-500/20 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:outline-none focus:border-gold-500 transition-all shadow-inner"
                                                value={accountData.email}
                                                onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-navy-950/30 rounded-3xl border border-gold-500/10 space-y-6">
                                    <div className="flex items-center space-x-2 text-gold-500 text-[10px] font-black uppercase tracking-widest">
                                        <ShieldCheck size={16} />
                                        <span>Authentication Update</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <input 
                                            type="password" 
                                            placeholder="Verify Current Password"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/10"
                                            value={accountData.currentPassword}
                                            onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input 
                                                type="password" 
                                                placeholder="New Password"
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/10"
                                                value={accountData.newPassword}
                                                onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                                            />
                                            <input 
                                                type="password" 
                                                placeholder="Confirm New Password"
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/10"
                                                value={accountData.confirmPassword}
                                                onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gold-600 hover:bg-gold-500 text-navy-950 font-black py-4 rounded-2xl shadow-2xl shadow-gold-600/20 transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? <Clock size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>Sync Profile Update</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'Store' && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
                            <div className="flex items-center space-x-3 mb-10 border-b border-white/5 pb-6">
                                <Store className="text-gold-500" size={24} />
                                <h2 className="text-2xl font-serif text-white">Global Store Config</h2>
                            </div>
                            <form onSubmit={handleStoreUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Currency</label>
                                        <input 
                                            value={storeConfig.currency} 
                                            onChange={(e) => setStoreConfig({...storeConfig, currency: e.target.value})}
                                            className="w-full bg-navy-950 border border-white/5 focus:border-gold-500 rounded-2xl px-6 py-4 text-white font-bold transition-all focus:outline-none" 
                                            placeholder="e.g. INR"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Default Tax (%)</label>
                                        <input 
                                            type="number"
                                            value={storeConfig.taxRate} 
                                            onChange={(e) => setStoreConfig({...storeConfig, taxRate: e.target.value})}
                                            className="w-full bg-navy-950 border border-white/5 focus:border-gold-500 rounded-2xl px-6 py-4 text-white font-bold transition-all focus:outline-none" 
                                            placeholder="e.g. 18"
                                            min="0" max="100"
                                        />
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30">Free Shipping Threshold (₹)</label>
                                        <input 
                                            type="number"
                                            value={storeConfig.freeShippingThreshold} 
                                            onChange={(e) => setStoreConfig({...storeConfig, freeShippingThreshold: e.target.value})}
                                            className="w-full bg-navy-950 border border-white/5 focus:border-gold-500 rounded-2xl px-6 py-4 text-white font-bold transition-all focus:outline-none" 
                                            placeholder="e.g. 999"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gold-600 hover:bg-gold-500 text-navy-950 font-black py-4 rounded-2xl shadow-2xl shadow-gold-600/20 transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? <Clock size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>Save Store Config</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'Notification' && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
                            <div className="flex items-center space-x-3 mb-10 border-b border-white/5 pb-6">
                                <Bell className="text-gold-500" size={24} />
                                <h2 className="text-2xl font-serif text-white">Alert Preferences</h2>
                            </div>
                            <form onSubmit={handleNotificationUpdate} className="space-y-6">
                                {[
                                    { key: 'emailOrderNotifications', label: 'Email Order Notifications' },
                                    { key: 'adminSmsAlerts', label: 'Admin SMS Alerts' },
                                    { key: 'weeklyPerformanceReports', label: 'Weekly Performance Reports' }
                                ].map((n, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-navy-950/30 rounded-2xl border border-white/5">
                                        <span className="text-cream-100 font-bold">{n.label}</span>
                                        <button
                                            type="button"
                                            onClick={() => setNotificationConfig({...notificationConfig, [n.key]: !notificationConfig[n.key]})}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${notificationConfig[n.key] ? 'bg-gold-500' : 'bg-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationConfig[n.key] ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full mt-6 bg-gold-600 hover:bg-gold-500 text-navy-950 font-black py-4 rounded-2xl shadow-2xl shadow-gold-600/20 transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? <Clock size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>Save Preferences</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'Payment' && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
                            <div className="flex items-center space-x-3 mb-10 border-b border-white/5 pb-6">
                                <CreditCard className="text-gold-500" size={24} />
                                <h2 className="text-2xl font-serif text-white">Payment Method Control</h2>
                            </div>
                            <form onSubmit={handlePaymentUpdate} className="space-y-6">
                                <p className="text-cream-100/50 text-sm mb-6">Enable or disable payment methods available to customers during checkout.</p>
                                
                                {[
                                    { key: 'cashOnDelivery', label: 'Cash on Delivery (COD)', desc: 'Allow customers to pay when order is delivered.' },
                                    { key: 'onlinePayment', label: 'Online Payment Gateway', desc: 'Secure online payments via Credit Card, UPI, etc.' }
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-navy-950/30 rounded-2xl border border-white/5 group hover:border-gold-500/20 transition-all">
                                        <div>
                                            <h4 className="text-cream-100 font-bold mb-1">{p.label}</h4>
                                            <p className="text-xs text-cream-100/40">{p.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentConfig({...paymentConfig, [p.key]: !paymentConfig[p.key]})}
                                            className={`w-14 h-7 rounded-full relative transition-all duration-300 ${paymentConfig[p.key] ? 'bg-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${paymentConfig[p.key] ? 'left-8' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full mt-6 bg-gold-600 hover:bg-gold-500 text-navy-950 font-black py-4 rounded-2xl shadow-2xl shadow-gold-600/20 transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? <Clock size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>Sync Gateway States</span>
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
