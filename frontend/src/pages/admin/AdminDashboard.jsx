import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import { logout } from '../../redux/userSlice';
import AdminProducts from './AdminProducts';
import AdminHomeContent from './AdminHomeContent';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'Overview');

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/admin/login');
        }
    }, [userInfo, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    if (!userInfo || !userInfo.isAdmin) {
        return null; // Don't flash content before redirect
    }

    const tabs = ['Overview', 'Products', 'Home Settings', 'Orders', 'Users', 'Settings'];

    return (
        <div className="min-h-screen bg-navy-900 flex flex-col md:flex-row font-sans text-cream-100">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-navy-800 shadow-2xl flex-shrink-0 border-r border-white/5 md:min-h-screen">
                <div className="p-6 border-b border-white/10 flex justify-between items-center md:block">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gold-400">Admin</h2>
                        <p className="text-xs text-cream-100/50 uppercase tracking-widest mt-1">Dashboard</p>
                    </div>
                    {/* Mobile menu button could go here */}
                </div>
                
                <nav className="p-4 space-y-2 flex-grow overflow-x-auto md:overflow-visible flex md:block whitespace-nowrap md:whitespace-normal">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-bold border ${
                                activeTab === tab
                                    ? 'bg-gold-600 text-white border-gold-500'
                                    : 'text-white hover:bg-white/10 hover:text-gold-300 border-transparent'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 hidden md:block">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all flex items-center justify-center space-x-2 font-bold"
                    >
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative">


                <header className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                    <h1 className="text-3xl md:text-4xl font-serif text-white">{activeTab}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm bg-gold-400/20 text-gold-400 px-3 py-1 rounded-full border border-gold-400/30">
                            Logged in as {userInfo.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="md:hidden px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="animate-fade-in-up">
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Stats Cards */}
                            {[
                                { title: 'Total Revenue', value: '₹ 1,24,500', trend: '+14%' },
                                { title: 'Total Orders', value: '1,432', trend: '+5%' },
                                { title: 'Active Users', value: '8,421', trend: '+22%' },
                                { title: 'Products', value: '142', trend: '0%' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                    <h3 className="text-cream-100/60 text-sm font-medium mb-2">{stat.title}</h3>
                                    <div className="flex items-baseline justify-between">
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                        <span className={`text-sm font-semibold ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-cream-100/50'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Recent Activity placeholder */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-serif text-gold-400 mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-navy-800/50 rounded-lg border border-white/5">
                                            <div className="flex items-center space-x-4">
                                                <img src={optimizeCloudinaryUrl('placeholder.jpg', 'w_100,h_100,c_fill,q_auto,f_auto')} alt="Order" className="w-16 h-16 object-cover rounded-xl bg-black" />
                                                <div>
                                                    <p className="font-medium text-cream-100">New order #ORD-0{idx + 1}89</p>
                                                    <p className="text-sm text-cream-100/50">Placed 2 hours ago by Customer {idx+1}</p>
                                                </div>
                                            </div>
                                            <span className="text-gold-300 font-bold">₹ 1,299</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Products' && <AdminProducts />}
                    {activeTab === 'Home Settings' && <AdminHomeContent />}
                    {activeTab === 'Orders' && <AdminOrders />}
                    {activeTab === 'Users' && <AdminUsers />}
                    {activeTab === 'Settings' && <AdminSettings />}
                    
                    {activeTab !== 'Overview' && activeTab !== 'Products' && activeTab !== 'Home Settings' && activeTab !== 'Orders' && activeTab !== 'Users' && activeTab !== 'Settings' && (
                        <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
                            <span className="text-5xl mb-4 opacity-50">🚧</span>
                            <h2 className="text-2xl font-serif text-gold-400 mb-2">{activeTab} Management</h2>
                            <p className="text-cream-100/60 max-w-md">This section is currently under construction and will be available in a future update.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
