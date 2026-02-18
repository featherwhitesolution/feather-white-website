import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Hero = () => {
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1920&auto=format&fit=crop', // Luxury Hair Oil
            title: 'Royal Elegance',
            subtitle: 'Discover the essence of pure luxury.',
            cta: 'Shop Collection'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1920&auto=format&fit=crop', // Skincare Texture/Cream
            title: 'Timeless Beauty',
            subtitle: 'Crafted for the modern royalty.',
            cta: 'Explore More'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1920&auto=format&fit=crop', // Woman with glowing skin
            title: 'Graceful Aura',
            subtitle: 'Embrace the glow of natural beauty.',
            cta: 'Shop Now'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1920&auto=format&fit=crop', // Detailed skin texture/Glow
            title: 'Luminous Charm',
            subtitle: 'Redefining elegance for the modern woman.',
            cta: 'Discover'
        }
    ];

    return (
        <section className="relative w-full h-[85vh] overflow-hidden bg-navy-900">
            <Swiper
                modules={[Autoplay, EffectFade, Parallax, Pagination, Navigation]}
                speed={1500}
                parallax={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                effect={'fade'}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' bg-gold-500"></span>';
                    },
                }}
                navigation={true}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        {/* Background Image with Parallax */}
                        <div
                            className="absolute inset-0 bg-cover bg-center w-full h-full"
                            style={{ backgroundImage: `url(${slide.image})` }}
                            data-swiper-parallax="50%"
                        >
                            {/* Overlay for text readability */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="max-w-xl text-left"
                            >
                                <h2
                                    className="text-gold-500 font-sans uppercase tracking-[0.2em] mb-4 text-sm md:text-base font-semibold"
                                    data-swiper-parallax="-300"
                                >
                                    Feather White Collection
                                </h2>
                                <h1
                                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream-100 mb-6 leading-tight"
                                    data-swiper-parallax="-200"
                                >
                                    {slide.title}
                                </h1>
                                <p
                                    className="font-sans text-lg md:text-xl text-cream-100/90 mb-10 font-light"
                                    data-swiper-parallax="-100"
                                >
                                    {slide.subtitle}
                                </p>

                                <div data-swiper-parallax="0">
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center px-8 py-4 bg-gold-500 text-navy-900 font-bold uppercase tracking-wider hover:bg-cream-100 transition-colors duration-300 group"
                                    >
                                        {slide.cta}
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Styling if needed, relying on default Swiper nav for now but handled via CSS in main or global */}
            </Swiper>

            {/* Decorative Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-900 to-transparent z-20 pointer-events-none"></div>
        </section>
    );
};

export default Hero;
