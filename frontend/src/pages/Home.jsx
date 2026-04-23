import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState(() => {
        const saved = localStorage.getItem('home_products_cache');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(() => !localStorage.getItem('home_products_cache'));
    const [texts, setTexts] = useState(() => {
        const saved = localStorage.getItem('home_texts_cache');
        return saved ? JSON.parse(saved) : {
            featuredTitle: 'Our Featured Collection',
            featuredSubtitle: 'Experience the best of nature and luxury combined.'
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            // Fetch featured products
            try {
                const prodRes = await api.get('/api/products?isFeatured=true&limit=3');
                if (prodRes.data) {
                    setFeaturedProducts(prodRes.data);
                    localStorage.setItem('home_products_cache', JSON.stringify(prodRes.data));
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }

            // Fetch home texts
            try {
                const textRes = await api.get('/api/home/texts');
                if (textRes.data && textRes.data.data) {
                    setTexts(textRes.data.data);
                    localStorage.setItem('home_texts_cache', JSON.stringify(textRes.data.data));
                }
            } catch (error) {
                console.error('Error fetching home texts:', error);
                // Keep using default texts from state
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
                                <div key={i} className="h-[450px] glass-card rounded-3xl animate-pulse bg-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {featuredProducts.map((product, index) => (
                                <motion.div 
                                    key={product._id} 
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative h-full"
                                >
                                    <div className="glass-card rounded-[2.5rem] overflow-hidden group-hover:border-gold-500/40 transition-all duration-500 h-full flex flex-col">
                                        <div className="relative aspect-[4/5] overflow-hidden bg-navy-950">
                                            <img
                                                src={optimizeCloudinaryUrl(product.image, 'w_450,h_560,c_fill,q_auto:eco,f_auto')}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-105"
                                            />
                                            
                                            {/* Luxury Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                            
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                                <Link 
                                                    to={`/products/${product._id}`}
                                                    className="btn-premium py-2.5 px-6 text-[10px] flex items-center gap-2"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                    View Details
                                                </Link>
                                            </div>

                                            {product.discount > 0 && (
                                                <div className="absolute top-6 right-6 bg-gold-500 text-navy-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                                                    {product.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-6 text-center flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-serif text-cream-100 mb-2 group-hover:text-gold-400 transition-colors uppercase tracking-tight">{product.name}</h3>
                                                <p className="text-[12px] text-cream-100/40 line-clamp-2 font-light leading-relaxed mb-4">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex items-center justify-center">
                                                <span className="text-lg font-serif text-gold-500">₹{product.price.toLocaleString()}</span>
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
        </div>
    );
};

export default Home;

