import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

const PolicyLayout = () => (
    <div className="pt-20 pb-20 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto bg-navy-800 p-8 rounded-lg shadow-lg border border-gold-500/20">
            <nav className="mb-8 flex space-x-4 border-b border-navy-700 pb-4">
                <Link to="/policies/privacy" className="text-cream-100 hover:text-gold-500 font-bold">Privacy Policy</Link>
                <Link to="/policies/returns" className="text-cream-100 hover:text-gold-500 font-bold">Return Policy</Link>
                <Link to="/policies/disclaimer" className="text-cream-100 hover:text-gold-500 font-bold">Disclaimer</Link>
            </nav>
            <Outlet />
        </div>
    </div>
);

const Privacy = () => (
    <div>
        <h2 className="font-serif text-3xl text-gold-500 mb-4">Privacy Policy</h2>
        <p className="mb-4 text-lg">
            Feather White respects your privacy. We collect personal information only to process your orders and improve your shopping experience.
        </p>
        <p className="text-lg">
            We do not sell or share your personal data with third parties, except as necessary to fulfil your order (e.g., shipping providers).
        </p>
    </div>
);

const Returns = () => (
    <div>
        <h2 className="font-serif text-3xl text-gold-500 mb-4">Return Policy</h2>
        <ul className="list-disc pl-5 space-y-3 text-lg">
            <li>We accept returns only if the product delivered is wrong or physically damaged.</li>
            <li>Unopened and unused products may be requested for replacement within 15 days of purchase, provided the original seal, packaging, and invoice are intact. Used or tampered products will not be accepted.</li>
            <li>Shipping charges are non-refundable.</li>
            <li>All return requests must be supported with proper proof (unboxing video/images). We reserve the right to approve or reject any return based on verification.</li>
        </ul>
    </div>
);

const Disclaimer = () => (
    <div>
        <h2 className="font-serif text-3xl text-gold-500 mb-4">Disclaimer</h2>
        <p className="mb-4 text-lg">
            For external use only. Avoid contact with eyes. We recommend a patch test on a small area of skin before full use. If irritation or a rash develops, discontinue use immediately and consult a healthcare professional. Individual results may vary. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
        <p className="text-lg">
            While our products are formulated to achieve high-quality results, outcomes are not guaranteed and may vary depending on individual factors, usage frequency, and application methods. Feather White is not responsible for any adverse effects or lack of results arising from improper use.
        </p>
    </div>
);

const Policies = () => {
    return (
        <Routes>
            <Route path="/" element={<PolicyLayout />}>
                <Route index element={<Privacy />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="returns" element={<Returns />} />
                <Route path="disclaimer" element={<Disclaimer />} />
            </Route>
        </Routes>
    );
};

export default Policies;
