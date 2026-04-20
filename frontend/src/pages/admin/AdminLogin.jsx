import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginWithPassword, forgotPassword, resetAuthFlow, logout } from '../../redux/userSlice';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading, error, forgotPasswordSuccess } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                setLocalError('Access denied: You are not an admin.');
                dispatch(logout());
            }
        }
    }, [userInfo, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetAuthFlow()); // Clear errors on unmount
        };
    }, [dispatch]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLocalError('');
        dispatch(loginWithPassword({ email, password }));
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setLocalError('');
        dispatch(forgotPassword(email));
    };

    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -m-10 w-40 h-40 bg-gold-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -m-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                <div className="relative z-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold mb-3 font-serif">
                            Admin <span className="premium-text-gradient">Portal</span>
                        </h2>
                        <p className="text-sm text-cream-100/60 uppercase tracking-[0.2em]">
                            {isForgotPassword
                                ? "Secure Password Recovery"
                                : "Access Controlled Environment"}
                        </p>
                    </div>

                    {(error || localError) && (
                        <div className="mt-6 space-y-3">
                            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm text-center backdrop-blur-md">
                                <p className="font-bold mb-1">⚠️ {error || localError}</p>
                                {(error === 'Network Error' || (error && error.includes('Network'))) && !import.meta.env.PROD && (
                                    <p className="text-xs text-red-200/70 mt-2 italic">
                                        Tip: Ensure your backend server is running on port 5000.
                                    </p>
                                )}
                                {(error === 'Network Error' || (error && error.includes('Network'))) && import.meta.env.PROD && (
                                    <div className="text-xs text-red-200/70 mt-2 p-2 bg-black/20 rounded border border-white/5">
                                        <p className="font-semibold text-gold-400">Deployment Notice:</p>
                                        <p>The frontend cannot reach the backend. Ensure you have set the <code className="bg-white/10 px-1">VITE_API_URL</code> environment variable in your Nutlify settings.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {forgotPasswordSuccess && (
                        <div className="mt-6 bg-green-500/10 border border-green-500/50 text-green-200 p-4 rounded-xl text-sm text-center backdrop-blur-md">
                            A recovery link has been dispatched to your secure email.
                        </div>
                    )}

                    {!isForgotPassword ? (
                        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-400/80 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="glass-input w-full focus:bg-white/10"
                                        placeholder="admin@featherwhite.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2 ml-1">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gold-400/80">Secure Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotPassword(true)}
                                            className="text-[10px] uppercase font-bold text-cream-100/40 hover:text-gold-400 transition-colors focus:outline-none"
                                        >
                                            Forgot?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="glass-input w-full focus:bg-white/10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-premium w-full text-lg"
                                >
                                    {loading ? 'Verifying...' : 'Authorize Login'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="mt-10 space-y-6" onSubmit={handleForgotPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gold-400/80 mb-2 ml-1">Recovery Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="glass-input w-full"
                                        placeholder="admin@featherwhite.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || forgotPasswordSuccess}
                                    className="btn-premium w-full"
                                >
                                    {loading ? 'Processing...' : 'Request Reset'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        dispatch(resetAuthFlow());
                                    }}
                                    className="text-xs font-bold uppercase tracking-widest text-cream-100/40 hover:text-cream-100 transition-all text-center py-2"
                                >
                                    Return to Authentication
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
