import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

// Using the same dummy data for now (in real app, this would be fetched from API)
const dummyProducts = [
    {
        _id: '1',
        name: 'Royal Gold Anti-Aging Serum',
        description: 'Infused with 24K gold flakes, this serum revitalizes skin and reduces fine lines for a radiant glow. Suitable for all skin types, this luxurious formula penetrates deep into the epidermis to stimulate collagen production.',
        price: 2499,
        originalPrice: 3299,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.8,
        reviews: 124,
        stock: 12,
        isNew: true,
        discount: 25
    },
    {
        _id: '2',
        name: 'Velvet Matte Lipstick - Rubi',
        description: 'Long-lasting, highly pigmented matte lipstick that glides on smoothly without drying lips. Enriched with Vitamin E and Jojoba oil.',
        price: 899,
        originalPrice: 1200,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Makeup',
        rating: 4.5,
        reviews: 89,
        stock: 50,
        isNew: false,
        discount: 15
    },
    {
        _id: '3',
        name: 'Hydrating Rose Water Toner',
        description: 'Natural rose water toner to balance pH levels and hydrate skin instantly. Free from alcohol and harsh chemicals.',
        price: 450,
        originalPrice: 600,
        image: 'https://images.unsplash.com/photo-1608248598279-f9c349195b0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.2,
        reviews: 45,
        stock: 4,
        isNew: false,
        discount: 0
    },
    {
        _id: '4',
        name: 'Silk peptide Night Cream',
        description: 'Deeply nourishing night cream that repairs skin barrier while you sleep. Wake up to plump, hydrated skin.',
        price: 1599,
        originalPrice: 2000,
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.9,
        reviews: 210,
        stock: 20,
        isNew: true,
        discount: 10
    },
    {
        _id: '5',
        name: 'Charcoal Detox Face Mask',
        description: 'Activated charcoal mask to draw out impurities and unclog pores. Perfect for oily and acne-prone skin.',
        price: 799,
        originalPrice: 999,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.6,
        reviews: 67,
        stock: 15,
        isNew: false,
        discount: 20
    },
    {
        _id: '6',
        name: 'Golden Glow Body Oil',
        description: 'Luxurious body oil with shimmering particles for a sun-kissed look. Hydrates without feeling greasy.',
        price: 1299,
        originalPrice: 1800,
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Bodycare',
        rating: 4.7,
        reviews: 32,
        stock: 8,
        isNew: true,
        discount: 30
    },
    {
        _id: '7',
        name: 'Exfoliating Coffee Scrub',
        description: 'Natural coffee scrub to exfoliate dead skin cells and improve blood circulation. Reduces appearance of cellulite.',
        price: 599,
        originalPrice: 850,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Bodycare',
        rating: 4.4,
        reviews: 55,
        stock: 25,
        isNew: false,
        discount: 25
    },
    {
        _id: '8',
        name: 'Vitamin C Brightening Serum',
        description: 'Potent Vitamin C serum to fade dark spots and even out skin tone. Get your glow on!',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Skincare',
        rating: 4.9,
        reviews: 156,
        stock: 10,
        isNew: true,
        discount: 15
    }
];

const ProductDetails = () => {
    const { id } = useParams();
    const product = dummyProducts.find(p => p._id === id);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return <div className="text-center py-20 text-cream-100">Product not found</div>;
    }

    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            setQuantity(prev => prev + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity // Note: You'll need to update your reducer to handle initial quantity if it doesn't already
        }));
    };

    return (
        <div className="bg-navy-900 min-h-screen text-cream-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/products" className="inline-flex items-center text-gold-500 hover:text-cream-100 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5"
                    >
                        {product.discount && (
                            <span className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full z-10 shadow-lg">
                                -{product.discount}% OFF
                            </span>
                        )}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div>
                            <span className="text-gold-500 font-medium tracking-wider uppercase text-sm">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-cream-100 mt-2 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center text-gold-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                            className={i < Math.floor(product.rating) ? "" : "text-gray-600"}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-400">({product.reviews || 0} reviews)</span>
                            </div>
                        </div>

                        <div className="text-lg text-gray-300 leading-relaxed border-t border-b border-white/10 py-6">
                            <p>{product.description}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-serif font-bold text-gold-500">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <div className="flex items-center bg-navy-800 rounded-lg border border-white/10 w-fit">
                                    <button
                                        onClick={() => handleQuantityChange('dec')}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('inc')}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 px-8 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-gold-500/20"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            <div className="text-sm text-gray-400 pt-2 flex gap-6">
                                <span>Availability: <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></span>
                                <span>SKU: FW-{product._id.padStart(4, '0')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
