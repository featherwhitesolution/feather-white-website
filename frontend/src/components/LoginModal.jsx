import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, registerUser, resetAuthFlow, forgotPassword, loginWithPassword } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent, otpVerified, isNewUser, userInfo, tempMobile, tempOtp, forgotPasswordSuccess } = useSelector(state => state.user);

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Address fields
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('');
    const [stateField, setStateField] = useState(''); // renamed to avoid conflict
    const [pincode, setPincode] = useState('');

    // View State: 'mobile', 'otp', 'register', 'forgot', 'login-password'
    const [view, setView] = useState('mobile');

    // Password Login State
    const [password, setPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            setView('mobile');
            dispatch(resetAuthFlow());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        // If OTP is verified and user is NOT new, they are logged in. Close modal.
        if (otpVerified && !isNewUser && userInfo) {
            onClose();
        }
        // If OTP verified and IS new user, switch to register view
        if (otpVerified && isNewUser) {
            setView('register');
        }
    }, [otpVerified, isNewUser, userInfo, onClose]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        dispatch(sendOtp(mobile));
        setView('otp');
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ mobile, otp }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        dispatch(registerUser({
            name,
            email,
            mobile: tempMobile, // Use the verified mobile
            password: 'otp-user-no-password', // Placeholder or Optional
            shippingAddress: {
                addressLine,
                city,
                state: stateField,
                pincode
            }
        })).then((result) => {
            if (!result.error) {
                onClose();
            }
        });
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(loginEmail));
    };

    const handlePasswordLogin = (e) => {
        e.preventDefault();
        dispatch(loginWithPassword({ email: loginEmail, password }));
    };

    // Close on userInfo update (successful login)
    useEffect(() => {
        if (userInfo) onClose();
    }, [userInfo, onClose]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-navy-900 border border-gold-500/30 rounded-lg shadow-2xl p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* LOGO */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-serif text-gold-500">Feather White</h2>
                    <p className="text-sm text-gray-400">Royal Member Access</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 text-sm rounded border border-red-500">{error}</div>}

                {/* FORGOT PASSWORD SUCCESS MSG */}
                {forgotPasswordSuccess && view === 'forgot' && (
                    <div className="mb-4 p-3 bg-green-900/50 text-green-200 text-sm rounded border border-green-500">
                        Password reset link sent to your email.
                    </div>
                )}

                {/* VIEW: MOBILE INPUT */}
                {view === 'mobile' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                required
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                                placeholder="Enter 10-digit number"
                                maxLength={10}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-2 rounded transition-colors"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>

                        <div className="text-center mt-4 text-xs text-gray-500">
                            <span className="cursor-pointer hover:text-gold-400" onClick={() => setView('login-password')}>Or login with Password</span>
                        </div>
                    </form>
                )}

                {/* VIEW: OTP INPUT */}
                {view === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-gray-300">OTP sent to +91 {mobile}</p>
                            {tempOtp && <p className="text-xs text-emerald-400 mt-1">Dev Hint: Your OTP is {tempOtp}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Enter OTP</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none text-center tracking-[0.5em] text-xl"
                                maxLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-2 rounded transition-colors"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('mobile')}
                            className="w-full text-sm text-gray-400 hover:text-white mt-2"
                        >
                            Change Number
                        </button>
                    </form>
                )}

                {/* VIEW: REGISTER (New User) */}
                {view === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-3 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-center mb-4">
                            <h3 className="text-xl text-cream-100">Complete Your Profile</h3>
                            <p className="text-xs text-gold-400">Join the Royal Family</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400">Mobile Number</label>
                            <input type="text" readOnly value={tempMobile || ''} className="w-full bg-navy-800/50 border border-navy-600 text-gray-500 px-3 py-2 rounded focus:border-gold-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400">Full Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                        </div>

                        <div className="pt-2 border-t border-navy-700">
                            <p className="text-xs text-gold-500 mb-2 font-bold">Shipping Details</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400">Address Line</label>
                            <input type="text" required value={addressLine} onChange={e => setAddressLine(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-400">City</label>
                                <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400">State</label>
                                <input type="text" required value={stateField} onChange={e => setStateField(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400">Pincode</label>
                            <input type="text" required value={pincode} onChange={e => setPincode(e.target.value)} className="w-full bg-navy-800 border border-navy-600 text-white px-3 py-2 rounded focus:border-gold-500" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-2 rounded transition-colors mt-4"
                        >
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </form>
                )}

                {/* VIEW: PASSWORD LOGIN */}
                {view === 'login-password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email / Mobile</label>
                            <input
                                type="text"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <span className="text-xs text-gold-500 cursor-pointer" onClick={() => setView('forgot')}>Forgot Password?</span>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-2 rounded transition-colors"
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </button>

                        <div className="text-center mt-4 text-xs text-gray-500">
                            <span className="cursor-pointer hover:text-gold-400" onClick={() => setView('mobile')}>Back to OTP Login</span>
                        </div>
                    </form>
                )}

                {/* VIEW: FORGOT PASSWORD */}
                {view === 'forgot' && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="text-center mb-4">
                            <h3 className="text-xl text-cream-100">Reset Password</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Enter Registered Email/Mobile</label>
                            <input
                                type="text"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-2 rounded transition-colors"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-4 text-xs text-gray-500">
                            <span className="cursor-pointer hover:text-gold-400" onClick={() => setView('login-password')}>Back to Login</span>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default LoginModal;
