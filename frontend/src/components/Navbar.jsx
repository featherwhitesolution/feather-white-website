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

    const setIsLoginModalOpenCallback = React.useCallback((val) => {
        setIsLoginModalOpen(val);
    }, []);

    const closeLoginModal = React.useCallback(() => {
        setIsLoginModalOpen(false);
    }, []);

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

    const handleLogout = React.useCallback(() => {
        dispatch(logout());
        setShowUserMenu(false);
    }, [dispatch]);

    const navLinks = React.useMemo(() => [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
    ], []);

    return (
        <>
            <nav className="glass-card sticky top-0 z-50 border-b border-white/5 h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center group relative">
                            <div className="absolute inset-0 bg-gold-400 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-2 rounded-xl shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 border border-white/20">
                                <img
                                    src="/assets/logo.png"
                                    alt="Feather White"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <div className="ml-4 hidden lg:block">
                                <h1 className="text-xl font-serif text-cream-100 tracking-widest uppercase">
                                    Feather <span className="text-gold-500">White</span>
                                </h1>
                                <p className="text-[8px] text-cream-100/40 tracking-[0.4em] uppercase font-bold">Luxury & Nature</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-10">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `relative font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 group py-2 
                                        ${isActive ? 'text-gold-500' : 'text-cream-100/70 hover:text-white'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            <span className={`absolute bottom-0 left-0 h-[2px] bg-gold-500 transition-all duration-300 
                                                ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {/* Icons Section */}
                        <div className="flex items-center space-x-6">
                            <button className="text-cream-100/60 hover:text-gold-500 transition-all transform hover:scale-110">
                                <Search className="w-5 h-5 stroke-[1.5px]" />
                            </button>

                            {/* User Account */}
                            <div className="relative" ref={userMenuRef}>
                                {userInfo ? (
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-3 p-1.5 rounded-full border border-white/10 bg-white/5 hover:border-gold-500/50 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center border border-white/10 group-hover:border-gold-500/30">
                                            <User className="w-4 h-4 text-gold-500" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest pr-2 hidden sm:block">
                                            {userInfo.name.split(' ')[0]}
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginModalOpenCallback(true)}
                                        className="btn-premium py-2 px-6 text-[10px]"
                                    >
                                        Login
                                    </button>
                                )}

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserMenu && userInfo && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 mt-4 w-56 glass-card rounded-2xl overflow-hidden py-2"
                                        >
                                            <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                                                <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">{userInfo.name}</p>
                                                <p className="text-[10px] text-cream-100/40 mt-1 truncate">{userInfo.email}</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2.5 text-xs text-cream-100/80 hover:bg-white/10 rounded-xl transition-all">My Orders</Link>
                                                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2.5 text-xs text-cream-100/80 hover:bg-white/10 rounded-xl transition-all">Profile</Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center transition-all"
                                                >
                                                    <LogOut size={14} className="mr-3" /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/cart" className="relative group p-2 rounded-full hover:bg-white/5 transition-all">
                                <ShoppingCart className="w-5 h-5 text-cream-100/80 group-hover:text-gold-500 transition-colors" />
                                {totalQuantity > 0 && (
                                    <span className="absolute top-0 right-0 bg-gold-600 text-navy-950 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-navy-900 animate-bounce">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 text-cream-100/60 hover:text-gold-500 transition-colors"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop Overlay */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45] md:hidden"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-navy-950 border-l border-white/10 z-[50] md:hidden shadow-2xl flex flex-col"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-white/5">
                                    <div className="flex items-center">
                                        <div className="bg-white p-1.5 rounded-lg shadow-xl">
                                            <img src="/assets/logo.png" alt="Logo" className="h-6 w-auto" />
                                        </div>
                                        <span className="ml-3 text-sm font-serif text-cream-100 uppercase tracking-widest">Feather White</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-full bg-white/5 text-cream-100 hover:text-gold-500 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 flex flex-col space-y-8">
                                    <div className="flex flex-col space-y-6">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Explore</p>
                                        {navLinks.map((link) => (
                                            <NavLink
                                                key={link.path}
                                                to={link.path}
                                                className={({ isActive }) =>
                                                    `text-3xl font-serif tracking-widest transition-all duration-300 ${isActive ? 'text-gold-500 translate-x-2' : 'text-cream-100 hover:translate-x-2'}`
                                                }
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.name}
                                            </NavLink>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-white/5 flex flex-col space-y-6">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Account</p>
                                        {userInfo ? (
                                            <div className="space-y-4">
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center text-xl text-cream-100/80 hover:text-white"
                                                >
                                                    <User className="mr-4 w-5 h-5 text-gold-500" /> My Profile
                                                </Link>
                                                <Link 
                                                    to="/orders" 
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center text-xl text-cream-100/80 hover:text-white"
                                                >
                                                    <ShoppingCart className="mr-4 w-5 h-5 text-gold-500" /> My Orders
                                                </Link>
                                                <button
                                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                                    className="flex items-center text-xl text-red-400"
                                                >
                                                    <LogOut className="mr-4 w-5 h-5" /> Sign Out
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setIsOpen(false); setIsLoginModalOpenCallback(true); }}
                                                className="btn-premium w-full text-center"
                                            >
                                                Access Account
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 border-t border-white/5 bg-white/5">
                                    <p className="text-[8px] text-cream-100/30 uppercase tracking-[0.2em] text-center">
                                        © 2026 Feather White Artisanal Skincare
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
};

export default Navbar;
