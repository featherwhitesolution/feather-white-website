import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import { logout } from '../redux/userSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const totalQuantity = useSelector(state => state.cart.totalQuantity);
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setShowUserMenu(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <>
            <nav className="bg-navy-900 text-cream-100 sticky top-0 z-40 shadow-lg border-b border-gold-500/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center group">
                            <div className="bg-white p-2 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="/assets/logo.png"
                                    alt="Feather White"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `font-sans text-sm font-medium tracking-wide uppercase hover:text-gold-500 transition-colors duration-300 ${isActive ? 'text-gold-500 border-b-2 border-gold-500' : 'text-cream-100'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-6">
                            <button className="hover:text-gold-500 transition-colors">
                                <Search className="w-5 h-5" />
                            </button>

                            {/* User Account */}
                            <div className="relative" ref={userMenuRef}>
                                {userInfo ? (
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-1 hover:text-gold-500 transition-colors focus:outline-none"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-xs hidden sm:block max-w-[100px] truncate">{userInfo.name.split(' ')[0]}</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="hover:text-gold-500 transition-colors flex items-center space-x-1"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-xs hidden sm:block">Login</span>
                                    </button>
                                )}

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserMenu && userInfo && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-md shadow-lg py-1 border border-gold-500/20 ring-1 ring-black ring-opacity-5 z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-navy-700">
                                                <p className="text-sm text-white font-bold truncate">{userInfo.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{userInfo.mobile || userInfo.email}</p>
                                            </div>
                                            <a href="#" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-gold-500">My Orders</a>
                                            <a href="#" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-gold-500">Profile</a>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-700 hover:text-red-300 flex items-center"
                                            >
                                                <LogOut size={14} className="mr-2" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/cart" className="relative hover:text-gold-500 transition-colors group">
                                <ShoppingCart className="w-5 h-5" />
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-gold-500 text-navy-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-cream-100 transition-colors">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden text-cream-100 hover:text-gold-500 transition-colors"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-navy-800 border-t border-gold-500/20"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-2">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive ? 'text-gold-500 bg-navy-900/50' : 'text-cream-100 hover:text-gold-500 hover:bg-navy-900/50'
                                            }`
                                        }
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                                {!userInfo && (
                                    <button
                                        onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gold-500 hover:bg-navy-900/50 rounded-md"
                                    >
                                        Login / Register
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
};

export default Navbar;
