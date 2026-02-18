import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Droplets, Sparkles, Leaf } from 'lucide-react';

// Component for a single falling snowflake
const FallingSnowflake = ({ delay, duration, xStart, size }) => {
    return (
        <motion.div
            initial={{ y: -100, x: xStart, opacity: 0, rotate: 0 }}
            animate={{
                y: ['0vh', '100vh'], // Fall from top to bottom of the viewport/container
                x: [xStart, xStart + 20, xStart - 20, xStart], // Gentle swaying motion
                opacity: [0, 0.8, 0.8, 0], // Fade in and out
                rotate: [0, 45, -45, 0] // Gentle rotation
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute top-0 text-white/20 pointer-events-none z-0"
            style={{ left: `${xStart}%` }}
        >
            <Snowflake size={size} strokeWidth={1.5} fill="currentColor" />
        </motion.div>
    );
};

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Generate random snowflakes on client-side to avoid hydration mismatches
        const flakeCount = 20;
        const newFlakes = Array.from({ length: flakeCount }).map((_, i) => ({
            id: i,
            delay: Math.random() * 10,
            duration: 8 + Math.random() * 12, // Fall between 8-20s (faster than leaves)
            xStart: Math.random() * 100, // Random horizontal start
            size: 10 + Math.random() * 14 // Random size 10-24px (smaller than leaves)
        }));
        setSnowflakes(newFlakes);
    }, []);

    return (
        <div className="bg-navy-900 min-h-screen text-cream-100 font-sans relative overflow-hidden">

            {/* Falling Snowflakes Container */}
            <div className="absolute inset-0 z-0 pointer-events-none h-full w-full overflow-hidden">
                {snowflakes.map((flake) => (
                    <FallingSnowflake
                        key={flake.id}
                        {...flake}
                    />
                ))}
            </div>

            {/* Hero / Intro Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 opacity-50 z-0"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.6 }}
                        variants={fadeIn}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-navy-900 uppercase bg-gold-500 rounded-full">
                            Since 2015
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
                            Nature's Finest Ingredients
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-serif text-gold-500 italic mb-8">
                            Embrace Your Natural Glow
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Pure, vibrant, and ethically sourced skincare found in nature. Unleash your inner radiance with our organic collection.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section - Centered without Grid/Image */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-800/50 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-navy-900/40 p-8 md:p-12 rounded-2xl backdrop-blur-sm border border-white/5">
                            <h3 className="text-3xl font-serif text-white mb-6 border-l-4 border-gold-500 pl-4">
                                Welcome to our world of beauty and elegance!
                            </h3>
                            <div className="space-y-6 text-gray-300 leading-loose text-lg font-light">
                                <p>
                                    At <span className="text-gold-500 font-medium">Feather White</span>, we believe that every individual deserves to feel confident and radiant. We are committed to delivering high-quality skincare and haircare solutions that enhance natural beauty.
                                </p>
                                <p>
                                    Our expertly formulated Fairness Range is enriched with natural extracts to promote a brighter, more even complexion while reducing dark spots and pigmentation. For healthier, stronger hair, our Feather White Hair Oil blends coconut, fenugreek seeds, hibiscus, and amla oils to nourish the scalp, strengthen hair from root to tip, and minimize hair fall.
                                </p>
                                <p>
                                    With a focus on innovation, purity, and effectiveness, Feather White empowers you to look and feel your best every day. Thank you for choosing us to be a part of your beauty journey!
                                </p>
                            </div>
                        </div>

                        {/* Feature Icons */}
                        <div className="grid grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto">
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="p-3 bg-navy-700 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                                    <Leaf size={24} />
                                </div>
                                <span className="text-sm font-medium">100% Organic</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="p-3 bg-navy-700 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                                    <Droplets size={24} />
                                </div>
                                <span className="text-sm font-medium">Pure Extracts</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="p-3 bg-navy-700 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300">
                                    <Sparkles size={24} />
                                </div>
                                <span className="text-sm font-medium">Radiant Glow</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
