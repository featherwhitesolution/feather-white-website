import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import api from '../utils/api';

const PolicyLayout = () => (
    <div className="pt-20 pb-20 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto bg-navy-800 p-8 rounded-3xl shadow-2xl border border-gold-500/20">
            <nav className="mb-12 flex flex-wrap gap-4 border-b border-white/5 pb-6 justify-center md:justify-start">
                <Link to="/policies/privacy" className="px-5 py-2.5 rounded-xl border border-white/10 text-cream-100/60 hover:border-gold-500 hover:text-gold-500 transition-all font-bold text-xs uppercase tracking-widest">Privacy</Link>
                <Link to="/policies/terms" className="px-5 py-2.5 rounded-xl border border-white/10 text-cream-100/60 hover:border-gold-500 hover:text-gold-500 transition-all font-bold text-xs uppercase tracking-widest">Terms</Link>
                <Link to="/policies/returns" className="px-5 py-2.5 rounded-xl border border-white/10 text-cream-100/60 hover:border-gold-500 hover:text-gold-500 transition-all font-bold text-xs uppercase tracking-widest">Returns</Link>
                <Link to="/policies/disclaimer" className="px-5 py-2.5 rounded-xl border border-white/10 text-cream-100/60 hover:border-gold-500 hover:text-gold-500 transition-all font-bold text-xs uppercase tracking-widest">Disclaimer</Link>
            </nav>
            <div className="animate-fade-in text-left">
                <Outlet />
            </div>
        </div>
    </div>
);

const DynamicPolicy = ({ section, defaultTitle, defaultContent }) => {
    const [data, setData] = useState({ title: defaultTitle, content: defaultContent });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/home/${section}`);
                if (response.data && response.data.data) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error(`Failed to fetch ${section}:`, err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [section]);

    if (loading) return <div className="h-40 flex items-center justify-center animate-pulse text-gold-500 font-serif italic text-xl">Loading Official Policy...</div>;

    return (
        <div className="space-y-8">
            <div className="border-b border-white/5 pb-6">
                <h2 className="font-serif text-4xl text-gold-500 mb-2">{data.title}</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cream-100/30">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div 
                className="text-base text-cream-100/80 leading-relaxed whitespace-pre-wrap font-sans space-y-6"
            >
                {data.content || defaultContent}
            </div>
        </div>
    );
};

const Privacy = () => (
    <DynamicPolicy 
        section="privacy" 
        defaultTitle="Privacy Policy" 
        defaultContent={`Welcome to Feather White. Your privacy is critically important to us.\n\n1. Information We Collect: We collect personal information (name, email, shipping address, and phone number) when you place an order or create an account. This data is used solely to provide our services to you.\n\n2. Data Usage: We use your information to process orders, communicate updates, and (if opted-in) send marketing materials. We do not sell your personal data to third parties.\n\n3. Security: We implement industry-standard security measures, including SSL encryption, to protect your personal information during transmission and storage.\n\n4. Cookies: Our website uses cookies to enhance your browsing experience, remember your cart, and analyze traffic to improve our store.`} 
    />
);

const Terms = () => (
    <DynamicPolicy 
        section="terms" 
        defaultTitle="Terms of Service" 
        defaultContent={`By accessing the Feather White website, you agree to be bound by these Terms of Service.\n\n1. Product Information: We strive for absolute accuracy in our product descriptions, pricing, and availability. However, errors may occur. We reserve the right to correct any errors and cancel orders if necessary.\n\n2. User Accounts: You are responsible for maintaining the confidentiality of your account credentials. Feather White reserves the right to terminate accounts that violate our safety or ethical guidelines.\n\n3. Intellectual Property: All content on this site, including logos, text, and images, is the property of Feather White and protected by copyright laws.\n\n4. Limitation of Liability: Feather White shall not be liable for any indirect or consequential damages arising from the use of our website or products.`} 
    />
);

const Returns = () => (
    <DynamicPolicy 
        section="returns" 
        defaultTitle="Shipping & Return Policy" 
        defaultContent={`1. Shipping: Orders are typically processed within 24-48 hours. Domestic shipping within India usually takes 3-7 business days. International shipping varies by location.\n\n2. Damaged Goods: If you receive a product that is physically damaged or tampered with, please notify us within 24 hours of delivery at care@featherwhite.com with photographic evidence.\n\n3. Returns & Refunds: Due to the personal care nature of skincare, we can only accept returns for unopened and unused products in their original packaging within 15 days of delivery. Used or opened products are non-returnable for hygiene reasons.\n\n4. Process: Once a return is approved, your refund will be processed to the original payment method within 7-10 working days.`} 
    />
);

const Disclaimer = () => (
    <DynamicPolicy 
        section="disclaimer" 
        defaultTitle="Disclaimer" 
        defaultContent={`The information provided by Feather White is for general informational purposes only.\n\n1. Use at Your Own Risk: All products are for external use only. We strongly recommend a 24-hour patch test before full application to check for allergies.\n\n2. No Medical Advice: Our content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your dermatologist for skin-related concerns.\n\n3. Individual Results: Skincare results vary significantly between individuals based on skin type, climate, and usage. Feather White does not guarantee specific results.\n\n4. Allergies: Please review the ingredient list carefully if you have known botanical or chemical sensitivities.`} 
    />
);

const Policies = () => {
    return (
        <Routes>
            <Route path="/" element={<PolicyLayout />}>
                <Route index element={<Privacy />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="returns" element={<Returns />} />
                <Route path="disclaimer" element={<Disclaimer />} />
            </Route>
        </Routes>
    );
};

export default Policies;
