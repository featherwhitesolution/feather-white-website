import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await api.get(`/api/users/verify-email/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 text-center relative overflow-hidden"
            >
                {/* Decorative flairs */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold-500/10 rounded-full blur-[60px]" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-[60px]" />

                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-serif text-cream-100 uppercase tracking-widest">Verifying Account</h2>
                        <p className="text-cream-100/60 font-light">Please wait while we confirm your luxury membership...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif text-gold-500 uppercase tracking-widest">Verified</h2>
                        <p className="text-cream-100/80 font-light leading-relaxed">
                            Welcome to the Feather White family. Your account is now fully activated and ready for use.
                        </p>
                        <Link to="/" className="btn-premium block w-full mt-8">
                            Start Shopping
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                                <XCircle className="w-16 h-16 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-serif text-red-400 uppercase tracking-widest">Verification Failed</h2>
                        <p className="text-cream-100/60 font-light leading-relaxed">
                            {message}
                        </p>
                        <Link to="/" className="inline-block text-gold-500 hover:text-gold-400 font-bold uppercase tracking-widest text-xs mt-8 transition-colors">
                            Return Home
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
