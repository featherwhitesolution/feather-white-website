import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Facebook, Instagram, Youtube, Phone } from 'lucide-react';
// Using a simple Phone icon as placeholder for WhatsApp if exact icon not available in basic set, 
// or can import from 'react-icons/fa' if installed. 
// Plan said Lucide-React, so I'll stick to Lucide. 
// For WhatsApp, I'll use MessageCircle or phone.

const Footer = () => {
    return (
        <footer className="bg-navy-900 text-cream-100 pt-16 pb-8 border-t-4 border-gold-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand & About */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold text-gold-500">Feather White</h3>
                        <p className="font-sans text-sm leading-relaxed text-cream-100/80">
                            Experience the royalty of nature with our premium cosmetic collection.
                            Designed for elegance, crafted for you.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg font-semibold text-gold-500">Quick Links</h4>
                        <ul className="space-y-2 font-sans text-sm">
                            <li><Link to="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-gold-500 transition-colors">Shop Collection</Link></li>
                            <li><Link to="/about" className="hover:text-gold-500 transition-colors">Our Heritage</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg font-semibold text-gold-500">Policies</h4>
                        <ul className="space-y-2 font-sans text-sm">
                            <li><Link to="/policies/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/policies/returns" className="hover:text-gold-500 transition-colors">Return Policy</Link></li>
                            <li><Link to="/policies/disclaimer" className="hover:text-gold-500 transition-colors">Disclaimer</Link></li>
                        </ul>
                    </div>

                    {/* Connect Us */}
                    <div className="space-y-6">
                        <h4 className="font-serif text-lg font-semibold text-gold-500">Connect Us</h4>
                        <div className="space-y-4 font-sans text-sm">

                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/917977287353"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 group hover:bg-navy-800 p-2 rounded-lg transition-colors -ml-2"
                            >
                                <div className="bg-green-600 p-2 rounded-full text-white group-hover:scale-110 transition-transform">
                                    {/* Simulating WhatsApp Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                </div>
                                <span className="font-medium">Chat with Us</span>
                            </a>

                            {/* Email */}
                            <a href="mailto:samsungin123@gmail.com" className="flex items-center space-x-3 hover:text-gold-500 transition-colors">
                                <Mail className="w-5 h-5 text-gold-500" />
                                <span>samsungin123@gmail.com</span>
                            </a>

                            {/* Location */}
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-gold-500" />
                                <span>Mumbai, Maharashtra</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-cream-100 hover:text-gold-500 hover:scale-110 transition-all duration-300">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-cream-100 hover:text-gold-500 hover:scale-110 transition-all duration-300">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-cream-100 hover:text-gold-500 hover:scale-110 transition-all duration-300">
                                <Youtube className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-cream-100/10 text-center font-sans text-xs text-cream-100/50">
                    <p>© {new Date().getFullYear()} Feather White. All Rights Reserved.</p>
                    <p className="mt-2 text-cream-100/30">Website designed by Farhan Ahmed Shamsi</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
