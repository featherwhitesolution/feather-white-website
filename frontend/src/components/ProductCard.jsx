import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';

const ProductCard = ({ product }) => {
    // Dispatch is not used here anymore as we moved Add to Cart to details page, 
    // but keeping it if we want to add quick-add functionality later.
    // const dispatch = useDispatch();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-gold-500/50 transition-all duration-300"
        >
            <Link to={`/products/${product._id}`} className="block h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badges */}
                    {product.isNew && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider rounded-full z-10">
                            New
                        </span>
                    )}
                    {product.discount && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full z-10">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-gold-500 text-xs font-medium uppercase tracking-wider mb-1">
                                {product.category}
                            </p>
                            <h3 className="text-cream-100 font-serif text-lg font-medium leading-tight group-hover:text-gold-500 transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1 text-gold-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs line-through">
                                {product.originalPrice ? `₹${product.originalPrice}` : ''}
                            </span>
                            <span className="text-gold-500 text-xl font-serif font-bold">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="text-red-400 text-xs font-medium">
                                Only {product.stock} left!
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
