import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [texts, setTexts] = useState({
        featuredTitle: 'Our Featured Collection',
        featuredSubtitle: 'Experience the best of nature and luxury combined.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured products and home texts concurrently using centralized API utility
                const [prodRes, textRes] = await Promise.all([
                    api.get('/api/products?isFeatured=true'),
                    api.get('/api/home/texts')
                ]);

                if (prodRes.data) {
                    setFeaturedProducts(prodRes.data.slice(0, 3));
                }

                if (textRes.data && textRes.data.data) {
                    setTexts(textRes.data.data);
                }
            } catch (error) {
                console.error('Error fetching home content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-navy-950 min-h-screen overflow-hidden">
            <Hero />

            {/* Featured Section */}
            <section className="relative py-32 px-4 overflow-hidden">
                {/* Background artistic flairs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px] translate-y-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 text-gold-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                        >
                            <Sparkles className="w-3 h-3" />
                            Curated Selection
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl font-serif text-cream-100 mb-6 drop-shadow-sm"
                        >
                            {texts.featuredTitle}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg font-sans text-cream-100/50 max-w-2xl mx-auto"
                        >
                            {texts.featuredSubtitle}
                        </motion.p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[450px] glass-card rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {featuredProducts.map((product, index) => (
                                <motion.div 
                                    key={product._id} 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    className="group relative h-full"
                                >
                                    <div className="glass-card rounded-[2.5rem] overflow-hidden group-hover:border-gold-500/40 transition-all duration-700 h-full flex flex-col">
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={optimizeCloudinaryUrl(product.image, 'w_900,h_1125,c_fill,q_auto:best,f_auto')}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                            />
                                            
                                            {/* Luxury Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                            
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-10 group-hover:translate-y-0">
                                                <Link 
                                                    to={`/products/${product._id}`}
                                                    className="btn-premium py-3 px-8 text-xs flex items-center gap-2"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Discover Details
                                                </Link>
                                            </div>

                                            {product.discount > 0 && (
                                                <div className="absolute top-6 right-6 bg-gold-500 text-navy-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                                                    {product.discount}% EXCLUSIVE
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-8 text-center flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-serif text-cream-100 mb-3 group-hover:text-gold-400 transition-colors">{product.name}</h3>
                                                <p className="text-sm text-cream-100/40 line-clamp-2 font-light leading-relaxed mb-6">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex items-center justify-center">
                                                <span className="text-xl font-serif text-gold-500">₹{product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-20 text-center"
                    >
                        <Link 
                            to="/products"
                            className="inline-flex items-center gap-3 text-gold-400/60 hover:text-gold-400 font-bold uppercase tracking-[0.4em] text-xs transition-all group"
                        >
                            View Entire Gallery 
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Exclusive Section */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                 <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold-500 mb-4">Our Heritage</h3>
                        <h2 className="text-5xl font-serif text-cream-100 mb-8 leading-tight">Artisanal Skincare. <br/>Crafted with Precision.</h2>
                        <p className="text-cream-100/50 mb-12 leading-relaxed text-lg font-light">
                            Every bottle of Feather White is a testament to the harmony between advanced science and ancient botanical wisdom. We believe true luxury is found in the purity of nature.
                        </p>
                        <Link to="/about" className="btn-premium">
                             Our Story
                        </Link>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 border border-gold-500/20 rounded-[3rem] animate-pulse" />
                        <img 
                            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000" 
                            alt="Luxury Atmosphere" 
                            className="w-full h-96 object-cover rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.1)] grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </motion.div>
                 </div>
            </section>
        </div>
    );
};

export default Home;

