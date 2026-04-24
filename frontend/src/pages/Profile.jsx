import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo, getProfile } from '../redux/userSlice';
import api from '../utils/api';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

const Profile = () => {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!userInfo) {
            navigate('/');
        } else {
            dispatch(getProfile());
        }
    }, [dispatch, navigate]); // Run once on mount

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setMobile(userInfo.mobile || '');
            setAddressLine(userInfo.shippingAddress?.addressLine || '');
            setCity(userInfo.shippingAddress?.city || '');
            setState(userInfo.shippingAddress?.state || '');
            setPincode(userInfo.shippingAddress?.pincode || '');
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { data } = await api.put('/api/users/profile', {
                name,
                email,
                mobile,
                shippingAddress: {
                    addressLine,
                    city,
                    state,
                    pincode
                }
            });

            dispatch(updateUserInfo(data));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-serif text-gold-400 mb-2">My Account</h1>
                <p className="text-cream-100/60 font-sans">Manage your royal membership details and shipping preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Quick Stats / Avatar (Col 3) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-navy-800 border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"></div>
                        
                        <div className="w-28 h-28 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gold-500/30 p-1">
                            {userInfo.picture ? (
                                <img src={userInfo.picture} alt={name} className="w-full h-full rounded-full object-cover shadow-inner" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gold-400/10 flex items-center justify-center">
                                    <User size={56} className="text-gold-400" />
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-1">{userInfo.name}</h2>
                        <p className="text-sm text-gold-500/70 font-medium mb-6 uppercase tracking-widest">Active Member</p>
                        
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between group-hover:bg-white/10 transition-all border border-transparent hover:border-gold-500/20">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userInfo.isVerified ? 'bg-gold-500/10 text-gold-500' : 'bg-red-500/10 text-red-500'}`}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-sm text-gray-300">Status</span>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-tighter ${userInfo.isVerified ? 'text-gold-400' : 'text-red-400'}`}>
                                    {userInfo.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        </div>

                        {!userInfo.isVerified && (
                            <button 
                                onClick={async () => {
                                    try {
                                        await api.post('/api/users/resend-verification');
                                        alert('Verification email resent! Please check your inbox.');
                                    } catch (err) {
                                        alert(err.response?.data?.message || 'Failed to resend email');
                                    }
                                }}
                                className="mt-6 w-full py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all uppercase tracking-widest"
                            >
                                Resend Verification
                            </button>
                        )}
                    </div>
                </div>

                {/* MIDDLE: Form (Col 6) */}
                <div className="lg:col-span-6">
                    {!userInfo.isVerified && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-gradient-to-r from-red-900/40 to-navy-800 border border-red-500/30 rounded-3xl p-6 flex items-center justify-between shadow-xl"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Email Not Verified</h4>
                                    <p className="text-[11px] text-gray-400 mt-1">Please confirm your email to secure your account and unlock all features.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <form onSubmit={handleSubmit} className="bg-navy-800 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full">
                        <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Update Information</h3>
                            <div className="px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-[10px] text-gold-500 uppercase font-black tracking-widest">
                                Editor
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            {success && (
                                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl border border-emerald-500/20 flex items-center space-x-3 transition-all animate-in fade-in zoom-in slide-in-from-top-4">
                                    <ShieldCheck size={20} className="animate-pulse" />
                                    <span className="text-sm font-semibold">Security update successful!</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all focus:bg-navy-900 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">Email Address</label>
                                    <input 
                                        type="email" 
                                        readOnly 
                                        value={email}
                                        className="w-full bg-navy-900/20 border border-white/5 rounded-2xl px-5 py-4 text-cream-100/30 cursor-not-allowed italic"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">Contact Number</label>
                                    <input 
                                        type="tel" 
                                        value={mobile} 
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="Enter your primary contact number"
                                        className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all focus:bg-navy-900 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-xs font-black text-gold-500 uppercase tracking-[3px] mb-8 flex items-center">
                                    <MapPin size={16} className="mr-2" />
                                    <span>Shipping Destination</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">Address Line</label>
                                        <input 
                                            type="text" 
                                            value={addressLine} 
                                            onChange={(e) => setAddressLine(e.target.value)}
                                            className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all"
                                            placeholder="House No, Street Name, Landmark"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">City</label>
                                        <input 
                                            type="text" 
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">State</label>
                                        <input 
                                            type="text" 
                                            value={state} 
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-cream-100/40 uppercase tracking-[2px]">Pincode</label>
                                        <input 
                                            type="text" 
                                            value={pincode} 
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="w-full bg-navy-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-gold-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-gold-600 hover:bg-gold-500 text-navy-900 font-black px-12 py-4 rounded-2xl transition-all flex items-center space-x-3 shadow-xl shadow-gold-600/20 uppercase tracking-widest text-sm active:scale-95"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Confirm Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT: Saved Summary Box (Col 3) */}
                <div className="lg:col-span-3">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-navy-800 border-2 border-gold-500/20 rounded-3xl p-8 shadow-2xl relative">
                            <div className="absolute -top-3 left-8 bg-gold-600 px-4 py-1 rounded-full text-[10px] text-navy-900 font-black uppercase tracking-widest">
                                Saved Information
                            </div>
                            
                            <h4 className="text-xl font-serif text-white mb-8 border-b border-white/5 pb-4">Live Preview</h4>
                            
                            <div className="space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Linked Name</p>
                                    <p className="text-lg text-white font-medium">{userInfo.name}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest">Contact Phone</p>
                                    <p className="text-lg text-white font-medium">{userInfo.mobile || 'Not provided yet'}</p>
                                </div>

                                <div className="space-y-3 bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <p className="text-[10px] font-black text-gold-500/50 uppercase tracking-widest flex items-center">
                                        <MapPin size={12} className="mr-1" />
                                        Saved Address
                                    </p>
                                    <div className="text-sm text-gray-300 leading-relaxed font-sans">
                                        {userInfo.shippingAddress?.addressLine ? (
                                            <>
                                                <p className="font-bold text-white mb-1">{userInfo.shippingAddress.addressLine}</p>
                                                <p>{userInfo.shippingAddress.city}, {userInfo.shippingAddress.state}</p>
                                                <p className="text-gold-500/80 mt-1 font-mono">{userInfo.shippingAddress.pincode}</p>
                                            </>
                                        ) : (
                                            <p className="italic text-gray-500">No address saved on record. Please update using the form.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 leading-relaxed text-center">
                                    This information will be used as the default shipping destination for all future orders.
                                </p>
                            </div>
                        </div>

                        {/* Quick Action */}
                        <div 
                            onClick={() => navigate('/orders')}
                            className="bg-gold-500/5 border border-gold-500/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-gold-500/10 transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center text-gold-500">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Track Orders</p>
                                    <p className="text-[10px] text-gray-500">View your purchase history</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gold-500/50 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
