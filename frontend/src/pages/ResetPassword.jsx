import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/userSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, resetPasswordSuccess } = useSelector(state => state.user);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMsg('Passwords do not match');
            return;
        }
        dispatch(resetPassword({ token, password }));
    };

    if (resetPasswordSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-navy-800 p-8 rounded-lg shadow-2xl border border-gold-500 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <CheckCircle size={64} className="text-gold-500" />
                    </div>
                    <h2 className="text-3xl font-serif text-gold-500 mb-4">Royal Success</h2>
                    <p className="text-gray-300 mb-6">Your password has been securely updated.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gold-600 hover:bg-gold-500 text-navy-900 px-8 py-3 rounded font-bold"
                    >
                        Return to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
            <div className="max-w-md w-full bg-navy-800 p-8 rounded-lg shadow-2xl border border-navy-700">
                <h2 className="text-2xl font-serif text-center text-gold-500 mb-6">Set New Password</h2>

                {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
                {msg && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-navy-900 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-navy-900 border border-navy-600 text-white px-4 py-2 rounded focus:border-gold-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold py-3 rounded transition-colors flex justify-center items-center"
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
