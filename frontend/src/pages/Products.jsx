import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20 text-gold-400 min-h-screen bg-navy-900">Loading your luxury collection...</div>;
    if (error) return <div className="text-center py-20 text-red-500 min-h-screen bg-navy-900">{error}</div>;

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
                
                {products.length === 0 && (
                    <div className="text-center py-10 text-cream-100/50">
                        No products available yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
