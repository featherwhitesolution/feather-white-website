import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const dummyProducts = [
    {
        _id: '1',
        name: 'Royal Gold Anti-Aging Serum',
        description: 'Infused with 24K gold flakes, this serum revitalizes skin and reduces fine lines for a radiant glow.',
        price: 2499,
        originalPrice: 3299,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.8,
        stock: 12,
        isNew: true,
        discount: 25
    },
    {
        _id: '2',
        name: 'Velvet Matte Lipstick - Rubi',
        description: 'Long-lasting, highly pigmented matte lipstick that glides on smoothly without drying lips.',
        price: 899,
        originalPrice: 1200,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Makeup',
        rating: 4.5,
        stock: 50,
        isNew: false,
        discount: 15
    },
    {
        _id: '3',
        name: 'Hydrating Rose Water Toner',
        description: 'Natural rose water toner to balance pH levels and hydrate skin instantly.',
        price: 450,
        originalPrice: 600,
        image: 'https://images.unsplash.com/photo-1608248598279-f9c349195b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.2,
        stock: 4,
        isNew: false,
        discount: 0
    },
    {
        _id: '4',
        name: 'Silk peptide Night Cream',
        description: 'Deeply nourishing night cream that repairs skin barrier while you sleep.',
        price: 1599,
        originalPrice: 2000,
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.9,
        stock: 20,
        isNew: true,
        discount: 10
    },
    {
        _id: '5',
        name: 'Charcoal Detox Face Mask',
        description: 'Activated charcoal mask to draw out impurities and unclog pores.',
        price: 799,
        originalPrice: 999,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.6,
        stock: 15,
        isNew: false,
        discount: 20
    },
    {
        _id: '6',
        name: 'Golden Glow Body Oil',
        description: 'Luxurious body oil with shimmering particles for a sun-kissed look.',
        price: 1299,
        originalPrice: 1800,
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Bodycare',
        rating: 4.7,
        stock: 8,
        isNew: true,
        discount: 30
    },
    {
        _id: '7',
        name: 'Exfoliating Coffee Scrub',
        description: 'Natural coffee scrub to exfoliate dead skin cells and improve blood circulation.',
        price: 599,
        originalPrice: 850,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Reusing an image or finding a new one would be better but keeping it simple
        category: 'Bodycare',
        rating: 4.4,
        stock: 25,
        isNew: false,
        discount: 25
    },
    {
        _id: '8',
        name: 'Vitamin C Brightening Serum',
        description: 'Potent Vitamin C serum to fade dark spots and even out skin tone.',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Reusing for now
        category: 'Skincare',
        rating: 4.9,
        stock: 10,
        isNew: true,
        discount: 15
    }
];

const Products = () => {
    // In a real app, use useEffect to fetch products from backend
    // const [products, setProducts] = useState([]);
    const [products] = useState(dummyProducts);


    return (
        <div className="bg-navy-900 min-h-screen text-cream-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-500 mb-4">
                        Our Collection
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
                        Discover our premium range of skincare and beauty products designed to enhance your natural radiance.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
