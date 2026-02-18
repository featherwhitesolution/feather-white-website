import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';

const Cart = () => {
    const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const handleUpdateQuantity = (id, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty > 0) {
            dispatch(updateQuantity({ id, quantity: newQty }));
        }
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    // Calculate shipping (free over ₹999)
    const shipping = totalAmount > 999 ? 0 : 50;
    const finalTotal = totalAmount + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-serif text-cream-100 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-gold-500 text-navy-900 font-semibold rounded-lg hover:bg-gold-600 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif text-gold-500 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-navy-800/50 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-medium text-cream-100">{item.name}</h3>
                                <p className="text-gold-500 font-serif mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-navy-900 rounded-lg border border-white/10">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Remove Item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="text-sm text-red-400 hover:underline"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 sticky top-24">
                        <h2 className="text-xl font-serif text-cream-100 mb-6">Order Summary</h2>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal ({totalQuantity} items)</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-gold-500">
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                            Proceed to Checkout
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
