import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadRazorpay } from '../utils/loadRazorpay';
import { fmtCurrency } from '../constants/config';
import PageHeader from '../components/PageHeader';

const Cart = () => {
    const { items, subtotal, gst, delivery, totalAmount, removeItemFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen bg-cream-50 pt-32 pb-24 flex items-center justify-center">
                <div className="text-center space-y-8 max-w-md mx-auto px-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto">
                        <ShoppingBag className="w-10 h-10 text-gold-300 stroke-[1]" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl text-neutral-800 font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                            Your bag awaits
                        </h2>
                        <p className="text-neutral-500 font-serif italic text-sm leading-relaxed">
                            Sign in to view your shopping bag and complete your purchase.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/auth/login', { state: { from: '/cart' } })}
                            className="px-10 py-4 bg-neutral-900 text-white uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-colors duration-500"
                        >
                            Sign In
                        </button>
                        <Link
                            to="/shop"
                            className="px-10 py-4 border border-neutral-300 text-neutral-600 uppercase tracking-[0.2em] text-xs hover:border-neutral-900 hover:text-neutral-900 transition-colors duration-300 text-center"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-cream-50 pb-24">
            <PageHeader
                eyebrow="Your Sanctuary Bag"
                titleStart="Shopping"
                titleItalic="Bag"
                description="Review your curated selection of luxury treatments and elixirs before checkout."
            />
            <div className="max-w-7xl mx-auto px-6">

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 space-y-8"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <ShoppingBag className="w-10 h-10 text-gold-300 stroke-[1]" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-neutral-800 text-xl font-light">Your bag is empty.</p>
                            <p className="text-neutral-500 font-serif italic text-sm">Discover our signature collections.</p>
                        </div>
                        <Link
                            to="/shop"
                            className="px-10 py-4 bg-neutral-900 text-white uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-colors duration-500"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                        <div className="lg:col-span-2 space-y-8">
                            <div className="hidden md:grid grid-cols-4 pb-6 border-b border-gold-300/20 text-xs uppercase tracking-widest text-neutral-400">
                                <div className="col-span-2">Product</div>
                                <div className="text-center">Quantity</div>
                                <div className="text-right">Total</div>
                            </div>

                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center py-8 border-b border-gold-300/10 group"
                                    >
                                        <div className="col-span-1 md:col-span-2 flex gap-6">
                                            <div className="w-24 h-32 bg-white overflow-hidden relative shadow-sm border border-gold-300/10 flex-shrink-0">
                                                <img src={item.image} alt={item.name} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="text-neutral-800 uppercase tracking-wider text-sm mb-1">{item.name}</h3>
                                                <p className="text-neutral-500 text-xs font-serif italic mb-4">{item.category}</p>
                                                <button
                                                    onClick={() => removeItemFromCart(item.id)}
                                                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors w-fit"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center border border-neutral-300 rounded-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 px-3 text-neutral-500 hover:text-gold-500 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm w-8 text-center text-neutral-800 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 px-3 text-neutral-500 hover:text-gold-500 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-neutral-800 font-medium">{fmtCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>


                        <div className="bg-white p-10 shadow-xl shadow-gold-300/5 relative overflow-hidden border border-gold-300/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blush-50/50 blur-3xl rounded-full pointer-events-none" />
                            <h2 className="text-2xl text-neutral-800 font-light mb-8 pb-4 border-b border-gold-300/20" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                                Summary
                            </h2>

                            <div className="space-y-6">
                                <div className="flex justify-between text-neutral-500 text-sm italic font-serif">
                                    <span>Subtotal</span>
                                    <span>{fmtCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500 text-sm italic font-serif">
                                    <span>Shipping</span>
                                    {delivery === 0 ? (
                                        <span className="text-gold-500 uppercase tracking-widest text-[10px]">Complimentary</span>
                                    ) : (
                                        <span>{fmtCurrency(delivery)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-neutral-500 text-sm italic font-serif border-b border-gold-300/20 pb-6">
                                    <span>Estimated Tax (5% GST)</span>
                                    <span>{fmtCurrency(gst)}</span>
                                </div>

                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-sm uppercase tracking-widest text-neutral-800 font-medium">Total</span>
                                    <span className="text-3xl text-neutral-800 font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                                        {fmtCurrency(totalAmount)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-neutral-900 text-white py-5 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-all duration-500 mt-8"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-3 h-3" />
                                </button>

                                <div className="pt-6 text-center">
                                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
                                        Secure encypted checkout provided by Razorpay. <br />All products shipped from our global sanctuary.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
