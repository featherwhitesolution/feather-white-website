import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Hero.css';

const Hero = () => {
    // 1. Initialize from localStorage for "Instant" feel on repeat visits
    const [slides, setSlides] = useState(() => {
        const saved = localStorage.getItem('hero_slides_cache');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(slides.length === 0);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const { data } = await axios.get('/api/home/hero');
                if (data && data.data && data.data.slides) {
                    const newSlides = data.data.slides;
                    setSlides(newSlides);
                    // Update cache for next time
                    localStorage.setItem('hero_slides_cache', JSON.stringify(newSlides));
                }
            } catch (error) {
                console.error('Error fetching hero content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, []);

    // 2. High-Fidelity Skeleton Fallback (Prevents 'null' return lag)
    if (slides.length === 0 && isLoading) {
        return (
            <section className="relative w-full h-[85vh] bg-navy-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-950">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 border-t-2 border-gold-500 rounded-full animate-spin" />
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gold-500 font-serif tracking-[0.3em] uppercase text-sm"
                    >
                        Initializing Luxury
                    </motion.p>
                </div>
            </section>
        );
    }

    // 3. Render actual content (if slides exist, either from cache or fetch)
    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-navy-900 border-b border-white/5">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                speed={1200}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                grabCursor={true}
                loop={slides.length > 1}
                className="w-full h-full"
            >
                 {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id || index} className="relative w-full h-full overflow-hidden bg-navy-950">
                        
                        {/* Progressive Background Layer */}
                        <div className="absolute inset-0 z-0 bg-navy-900">
                            {/* Blur placeholder for smoother transition */}
                            <AnimatePresence>
                                {isLoading && index === 0 && (
                                    <motion.div 
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-navy-800 animate-pulse z-20"
                                    />
                                )}
                            </AnimatePresence>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="w-full h-full hero-ken-burns transform-gpu"
                            >
                                <img 
                                    src={optimizeCloudinaryUrl(slide.image, 
                                        index === 0 
                                            ? 'w_1920,q_auto:best,f_auto,fl_progressive' 
                                            : 'w_1440,q_auto:good,f_auto,fl_progressive'
                                    )}
                                    srcSet={`
                                        ${optimizeCloudinaryUrl(slide.image, 'w_640,q_auto:low,f_auto')} 640w,
                                        ${optimizeCloudinaryUrl(slide.image, 'w_1280,q_auto:good,f_auto')} 1280w,
                                        ${optimizeCloudinaryUrl(slide.image, 'w_1920,q_auto:best,f_auto')} 1920w
                                    `}
                                    sizes="100vw"
                                    alt={slide.title || 'Exquisite Collection'}
                                    className="w-full h-full object-cover relative z-10"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    decoding="async"
                                />
                            </motion.div>
                        </div>

                        {/* Subtle Cinematic Overlay */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40 pointer-events-none" />
                        
                        {/* Text Content with delayed animation for premium feel */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                            <motion.h2 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-4xl md:text-7xl font-serif text-cream-100 mb-6 drop-shadow-2xl"
                            >
                                {slide.title}
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="text-lg md:text-2xl font-sans text-cream-100/90 max-w-2xl mb-10 tracking-wide"
                            >
                                {slide.subtitle}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                <Link 
                                    to={slide.link || "/products"}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-navy-900 font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-cream-100"
                                >
                                    <span>Discover Collection</span>
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Hero;

