import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, X, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingSlots, setUploadingSlots] = useState({});
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { userInfo } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: 0,
        category: 'Skincare',
        skinType: 'All',
        image: '',
        additionalImages: ['', '', '', ''],
        stockStatus: 'In Stock',
        isFeatured: false,
    });

    const categories = ['Skincare', 'Makeup', 'Fragrance', 'Haircare'];
    const skinTypes = ['All', 'Dry', 'Oily', 'Sensitive', 'Combination'];
    const stockStatuses = ['In Stock', 'Out of Stock', 'Coming Soon'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                originalPrice: product.originalPrice || '',
                discount: product.discount || 0,
                category: product.category || 'Skincare',
                skinType: product.skinType || 'All',
                image: product.image || '',
                additionalImages: (() => {
                    const arr = ['', '', '', ''];
                    if (product.additionalImages) {
                        const valid = product.additionalImages.filter(img => 
                            typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))
                        );
                        valid.forEach((img, i) => { if (i < 4) arr[i] = img; });
                    }
                    return arr;
                })(),
                stockStatus: product.stockStatus || 'In Stock',
                isFeatured: product.isFeatured || false,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                discount: 0,
                category: 'Skincare',
                skinType: 'All',
                image: '',
                additionalImages: ['', '', '', ''],
                stockStatus: 'In Stock',
                isFeatured: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const newState = { ...prev, [name]: val };
            
            // Auto-calculate discount
            if (name === 'price' || name === 'originalPrice') {
                const sPrice = parseFloat(name === 'price' ? val : prev.price);
                const oPrice = parseFloat(name === 'originalPrice' ? val : prev.originalPrice);
                
                if (oPrice > 0 && sPrice > 0 && oPrice > sPrice) {
                    newState.discount = Math.round(((oPrice - sPrice) / oPrice) * 100);
                } else if (oPrice > 0 && sPrice > 0 && sPrice >= oPrice) {
                    newState.discount = 0;
                }
            }
            
            return newState;
        });
    };

    const uploadImageSlotHandler = async (e, slotIndex) => {
        const file = e.target.files[0];
        if(!file) return;
        const formDataImage = new FormData();
        formDataImage.append('image', file);
        
        // Track per-slot uploading state
        setUploadingSlots(prev => ({ ...prev, [slotIndex]: true }));

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/upload', formDataImage, config);
            const imageUrl = data.url || data;

            if (slotIndex === 0) {
                setFormData(prev => ({ ...prev, image: imageUrl }));
            } else {
                setFormData(prev => {
                    const nextArr = [...prev.additionalImages];
                    nextArr[slotIndex - 1] = imageUrl;
                    return { ...prev, additionalImages: nextArr };
                });
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploadingSlots(prev => ({ ...prev, [slotIndex]: false }));
        }
    };

    const removeImageSlot = (slotIndex) => {
        if (slotIndex === 0) {
            setFormData(prev => ({ ...prev, image: '' }));
        } else {
            setFormData(prev => {
                const next = [...prev.additionalImages];
                next[slotIndex - 1] = '';
                return { ...prev, additionalImages: next };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            
            // Clean dynamic fields before sending to server
            const finalData = {
                ...formData,
                additionalImages: formData.additionalImages.filter(img => typeof img === 'string' && img.length > 5)
            };

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, finalData, config);
            } else {
                await axios.post('/api/products', finalData, config);
            }
            fetchProducts();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-serif text-gold-400">Products Management</h2>
                    <p className="text-cream-100/60 mt-1 text-sm md:text-base">Add, edit or remove products from your store</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 bg-gold-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gold-500 transition-all hover:-translate-y-1 w-full sm:w-auto border border-gold-400 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <Plus size={24} className="stroke-[3] relative z-10" />
                    <span className="text-lg tracking-wide relative z-10 block whitespace-nowrap">ADD NEW PRODUCT</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gold-400">Loading products...</div>
            ) : error ? (
                <div className="text-red-400 text-center py-10">{error}</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy-800/80 border-b border-white/10 text-cream-100/70 text-sm">
                                    <th className="p-4 rounded-tl-xl font-medium">Product Name</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Price/Discount</th>
                                    <th className="p-4 font-medium">Stock Status</th>
                                    <th className="p-4 rounded-tr-xl font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                                <img src={optimizeCloudinaryUrl(product.image, 'w_100,h_100,c_fill,q_auto,f_auto')} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="font-medium text-cream-100 line-clamp-1 max-w-[200px] xl:max-w-xs">{product.name}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-white/10 text-cream-100 px-3 py-1 rounded-full text-xs font-medium border border-white/5">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gold-300">₹{product.price}</div>
                                            {product.discount > 0 && <div className="text-xs text-green-400">{product.discount}% OFF</div>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                                product.stockStatus === 'In Stock' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                                                product.stockStatus === 'Coming Soon' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                                                'bg-red-400/10 text-red-400 border border-red-400/20'
                                            }`}>
                                                {product.stockStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded border border-transparent hover:border-blue-400/20 transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded border border-transparent hover:border-red-400/20 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-cream-100/50">
                                            No products found. Start by adding one!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-navy-800 border border-white/10 shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in-up">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-navy-800/95 backdrop-blur-md z-20">
                            <h3 className="text-xl font-serif text-gold-400">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-cream-100/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            
                            {/* 5 Fixed Photo Upload Boxes */}
                            <div className="space-y-4">
                                <label className="text-sm text-gold-400 font-medium">Product Images (5 Slots)</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[0, 1, 2, 3, 4].map((slot) => {
                                        const currentUrl = slot === 0 ? formData.image : formData.additionalImages[slot - 1];
                                        return (
                                            <div key={slot} className="space-y-2">
                                                <div className="relative group aspect-square rounded-xl bg-black/30 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center">
                                                    {currentUrl ? (
                                                        <>
                                                            <img src={optimizeCloudinaryUrl(currentUrl, 'w_200,h_200,c_fill')} alt={`Slot ${slot}`} className="w-full h-full object-cover" />
                                                            <button 
                                                                type="button"
                                                                onClick={() => removeImageSlot(slot)}
                                                                className="absolute top-1 right-1 p-1 bg-red-600 rounded-md text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                                                            {uploadingSlots[slot] ? (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-2" />
                                                                    <span className="text-[10px] text-gold-400 font-bold uppercase animate-pulse">Processing</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <Upload size={20} className="text-white/20 mb-1" />
                                                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">{slot === 0 ? 'Main' : `Photo ${slot+1}`}</span>
                                                                </>
                                                            )}
                                                            <input type="file" className="hidden" disabled={uploadingSlots[slot]} onChange={(e) => uploadImageSlotHandler(e, slot)} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {uploading && <p className="text-xs text-gold-400 text-center animate-pulse">Processing image...</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-cream-100/70 font-medium">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors placeholder:text-cream-100/30"
                                    />
                                </div>
                                
                                {/* Discount Section */}
                                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10 md:col-span-2">
                                    <label className="text-sm text-gold-400 font-medium">Pricing & Discount</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-cream-100/70">Selling Price (₹) *</label>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-cream-100/70">Original Price (₹)</label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                min="0"
                                                value={formData.originalPrice}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                                placeholder="E.g. 1500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-cream-100/70">Discount (%)</label>
                                            <input
                                                type="number"
                                                name="discount"
                                                min="0"
                                                max="100"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Status Toggle */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-cream-100/70 font-medium mb-2 block">Inventory Status *</label>
                                    <div className="flex bg-black/20 border border-white/10 rounded-lg p-1">
                                        {stockStatuses.map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, stockStatus: status })}
                                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                                    formData.stockStatus === status 
                                                        ? 'bg-gold-600 text-white shadow-lg border border-gold-400'
                                                        : 'text-cream-100/60 hover:text-white hover:bg-white/5 border border-transparent'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-cream-100/70 font-medium">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                    >
                                        {categories.map(c => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-cream-100/70 font-medium">Skin Type</label>
                                    <select
                                        name="skinType"
                                        value={formData.skinType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors"
                                    >
                                        {skinTypes.map(s => <option key={s} value={s} className="bg-navy-800">{s}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-cream-100/70 font-medium">Description *</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 transition-colors placeholder:text-cream-100/30 resize-none"
                                        placeholder="Detailed description of the product..."
                                    ></textarea>
                                </div>
                                <div className="space-y-2 md:col-span-2 flex items-center pt-2">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 accent-gold-400 bg-black/20 border-white/10 rounded focus:ring-gold-400 focus:ring-offset-navy-800"
                                    />
                                    <label htmlFor="isFeatured" className="ml-3 text-sm text-cream-100 cursor-pointer">
                                        Feature this product on the home page
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end pt-6 space-x-4 border-t border-white/10">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 bg-gold-600 text-white font-bold rounded-lg hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/30 border border-gold-500" disabled={uploading}>
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
