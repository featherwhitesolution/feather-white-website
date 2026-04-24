import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Facebook, Instagram, Youtube, Phone, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { SocialConnect } from './ui/connect-with-us';

const Footer = () => {
    const [social, setSocial] = useState({
        whatsapp: '917977287353',
        facebook: '#',
        instagram: '#',
        youtube: '#',
        email: 'support@featherwhite.com',
        location: 'Mumbai, Maharashtra'
    });

    useEffect(() => {
        const fetchSocial = async () => {
            try {
                const { data } = await api.get('/api/home/social');
                if (data && data.data) {
                    setSocial(data.data);
                }
            } catch (error) {
                console.error('Error fetching social links:', error);
            }
        };
        fetchSocial();
    }, []);

    const getLink = (url) => {
        if (!url || url === '#' || url === '') return null;
        if (url.startsWith('http')) return url;
        return `https://${url}`;
    };

    const handleSocialClick = (e, platform) => {
        const url = getLink(social[platform]);
        if (!url) {
            e.preventDefault();
            alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} link coming soon!`);
        }
    };

    return (
        <>
            <SocialConnect socialData={social} getLink={getLink} />
            <footer className="bg-navy-950 text-cream-100 pt-20 pb-12 overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-30" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-600/5 rounded-full blur-[120px]" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

                        {/* Brand & Mission */}
                        <div className="space-y-6">
                            <h3 className="font-serif text-3xl font-bold premium-text-gradient">Feather White</h3>
                            <p className="text-sm leading-relaxed text-cream-100/60 font-light">
                                Crafting the pinnacle of botanical luxury. We transform nature's purest essences into exquisite skincare rituals for the discerning individual.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-gold-500/50">Navigation</h4>
                            <ul className="space-y-4">
                                {['Home', 'Products', 'Our Heritage'].map((item) => (
                                    <li key={item}>
                                        <Link 
                                            to={item === 'Home' ? '/' : item === 'Products' ? '/products' : '/about'} 
                                            className="text-sm text-cream-100/70 hover:text-gold-400 transition-all flex items-center group"
                                        >
                                            <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all mr-0 group-hover:mr-2" />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Policies */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-gold-500/50">Policies</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Terms of Service', path: '/policies/terms' },
                                    { name: 'Privacy Policy', path: '/policies/privacy' },
                                    { name: 'Return Policy', path: '/policies/returns' },
                                    { name: 'Disclaimer', path: '/policies/disclaimer' }
                                ].map((policy) => (
                                    <li key={policy.name}>
                                        <Link to={policy.path} className="text-sm text-cream-100/70 hover:text-gold-400 transition-all">
                                            {policy.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact & Connect */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-gold-500/50">Get in Touch</h4>
                            <div className="space-y-5">
                                <a 
                                    href={`mailto:${social.email}`} 
                                    className="flex items-center space-x-4 text-cream-100/70 hover:text-gold-400 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-gold-500/30">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs truncate">{social.email}</span>
                                </a>

                                <div className="flex items-center space-x-4 text-cream-100/70">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs">{social.location}</span>
                                </div>
                            </div>

                            {/* Social Grid */}
                            <div className="flex space-x-3 pt-6 border-t border-white/5">
                                {['facebook', 'instagram', 'youtube'].map((platform) => {
                                    const Icon = platform === 'facebook' ? Facebook : platform === 'instagram' ? Instagram : Youtube;
                                    return (
                                        <a 
                                            key={platform}
                                            href={getLink(social[platform]) || '#'} 
                                            onClick={(e) => handleSocialClick(e, platform)}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cream-100/40 hover:text-gold-400 hover:border-gold-500/50 hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] text-cream-100/30 uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Feather White. Artisanal Skincare.
                        </p>
                        
                        <div className="flex items-center gap-4 group cursor-default">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500/30 group-hover:text-gold-500 transition-colors">
                                Designed with Precision by
                            </span>
                            <span className="text-xs font-serif italic text-cream-100/60 group-hover:text-white transition-all">
                                Farhan Ahmed Shamsi
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

