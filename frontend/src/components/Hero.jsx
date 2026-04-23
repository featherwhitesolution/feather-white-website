import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Hero = () => {
    const [slides, setSlides] = useState(() => {
        const saved = localStorage.getItem('hero_slides_cache');
        return saved ? JSON.parse(saved) : [];
    });
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(slides.length === 0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const { data } = await api.get('/api/home/hero');
                if (data && data.data && data.data.slides) {
                    const newSlides = data.data.slides;
                    setSlides(newSlides);
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

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 8000); // Slower, 8s for a more relaxed luxury feel
        return () => clearInterval(timer);
    }, [slides]);

    if (slides.length === 0 && isLoading) {
        return (
            <section className="relative w-full h-[90vh] bg-navy-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950 opacity-80" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="w-24 h-24 rounded-full border border-gold-500/20 flex items-center justify-center"
                >
                    <Sparkles className="text-gold-500/50 w-8 h-8" />
                </motion.div>
            </section>
        );
    }

    if (slides.length === 0) return null; // Failsafe if no slides are ever returned

    return (
        <section className="relative w-full aspect-[1920/830] min-h-[300px] overflow-hidden bg-navy-950 border-b border-white/5">
            
            {/* BACKGROUND IMAGES (Sliding Carousel) */}
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ 
                        x: { type: "spring", stiffness: 45, damping: 22 },
                        opacity: { duration: 0.6 }
                    }}
                    className="absolute inset-0 z-0"
                >
                    <div className="w-full h-full">
                        <img 
                            src={optimizeCloudinaryUrl(slides[current].image, 'w_1920,q_auto:eco,f_auto')}
                            alt={slides[current].title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Clean background - no overlays for maximum banner visibility */}



                </motion.div>
            </AnimatePresence>

            {/* CONTENT CONTAINER REMOVED - Displaying only plain banner */}



            

        </section>
    );
};

export default Hero;


