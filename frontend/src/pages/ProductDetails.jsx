import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import api from '../utils/api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const ProductDetails = () => {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gold-400 min-h-screen bg-navy-900">Loading exquisite details...</div>;
    if (error || !product) return <div className="text-center py-20 text-red-500 min-h-screen bg-navy-900">{error || 'Product not found'}</div>;

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

    const allImages = [product.image, ...(product.additionalImages || [])]
        .filter(Boolean)
        .filter(img => typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')));

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <div className="bg-navy-900 min-h-screen text-cream-100 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>{`${product.name} | Feather White Luxury`}</title>
                <meta name="description" content={product.description} />
                
                {/* Open Graph / Facebook / WhatsApp */}
                <meta property="og:type" content="product" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={`${product.name} - ₹${product.price.toLocaleString('en-IN')}`} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={optimizeCloudinaryUrl(product.image, 'w_1200,h_630,c_fill,q_auto,f_auto')} />
                <meta property="product:price:amount" content={product.price} />
                <meta property="product:price:currency" content="INR" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.name} />
                <meta name="twitter:description" content={product.description} />
                <meta name="twitter:image" content={optimizeCloudinaryUrl(product.image, 'w_1200,h_630,c_fill,q_auto,f_auto')} />
            </Helmet>

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
                        className="space-y-4"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 group min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                            {product.discount > 0 && (
                                <span className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full z-10 shadow-lg">
                                    -{product.discount}% OFF
                                </span>
                            )}
                            <img
                                src={optimizeCloudinaryUrl(allImages[currentImageIndex], 'w_1200,h_1200,c_limit,q_auto,f_auto')}
                                alt={product.name}
                                className="max-w-full max-h-[600px] w-auto h-auto object-contain transition-transform duration-500 hover:scale-105"
                            />

                            {/* Slider Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-gold-500 hover:text-navy-900 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-gold-500 hover:text-navy-900 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
                                    >
                                        <ChevronRight size={28} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                                            currentImageIndex === idx ? 'border-gold-500 scale-105 shadow-gold-500/50 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img 
                                            src={optimizeCloudinaryUrl(img, 'w_200,h_200,c_fill,q_auto,f_auto')} 
                                            alt={`${product.name} thumbnail ${idx + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                        {currentImageIndex === idx && (
                                            <div className="absolute inset-0 bg-gold-500/10"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
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
                                            fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"}
                                            className={i < Math.floor(product.rating || 5) ? "" : "text-gray-600"}
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
                                <div className={`flex items-center bg-navy-800 rounded-lg border border-white/10 w-fit ${product.stockStatus !== 'In Stock' ? 'opacity-30 pointer-events-none' : ''}`}>
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
                                    disabled={product.stockStatus !== 'In Stock'}
                                    className={`flex-1 py-3 px-8 font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                                        product.stockStatus === 'In Stock' 
                                        ? 'bg-gold-500 hover:bg-gold-600 text-navy-900 active:scale-95 shadow-gold-500/20' 
                                        : 'bg-white/10 text-cream-100/30 cursor-not-allowed shadow-none border border-white/5'
                                    }`}
                                >
                                    <ShoppingCart size={20} />
                                    {product.stockStatus === 'In Stock' ? 'Add to Cart' : product.stockStatus}
                                </button>
                            </div>

                            <div className="text-sm text-gray-400 pt-2 flex gap-6">
                                <span>Availability: <span className={
                                    product.stockStatus === 'In Stock' ? "text-green-400" : 
                                    product.stockStatus === 'Coming Soon' ? "text-blue-400" : "text-red-400"
                                }>{product.stockStatus}</span></span>
                                <span>SKU: FW-{product._id.substring(0, 4).toUpperCase()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
