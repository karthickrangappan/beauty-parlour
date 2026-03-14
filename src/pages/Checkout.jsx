import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { loadRazorpay } from '../utils/loadRazorpay';
import { Lock, BadgePercent, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { items, subtotal, gst, delivery, totalAmount, clearCart, 
        couponDiscount, setCouponDiscount, setActiveCoupon, activeCoupon, 
        loyaltyDiscount, setLoyaltyDiscount } = useCart();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    
    // Loyalty State
    const [pointsInput, setPointsInput] = useState('');
    const [pointsError, setPointsError] = useState('');
    
    // Address State
    const [address, setAddress] = useState({
        name: user?.displayName || '',
        phone: '',
        street: '',
        city: '',
        pincode: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
        } else if (items.length === 0) {
            navigate('/cart');
        }
    }, [user, items, navigate]);

    const handleInputChange = (e) => {
        setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validateAddress = () => {
        const newErrors = {};
        if (!address.name.trim()) newErrors.name = "Name is required";
        if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) newErrors.phone = "Valid 10-digit phone number is required";
        if (!address.street.trim()) newErrors.street = "Street address is required";
        if (!address.city.trim()) newErrors.city = "City is required";
        if (!address.pincode.trim() || !/^\d{5,6}$/.test(address.pincode)) newErrors.pincode = "Valid pincode is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const applyCoupon = async () => {
        setCouponError('');
        if (!couponCode.trim()) return;
        
        try {
            const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setCouponError('Invalid coupon code');
                return;
            }

            const couponDoc = querySnapshot.docs[0].data();
            const now = Timestamp.now();
            
            if (couponDoc.expiry && couponDoc.expiry.toDate() < now.toDate()) {
                setCouponError('Coupon has expired');
                return;
            }

            if (couponDoc.minOrder && subtotal < couponDoc.minOrder) {
                setCouponError(`Minimum order amount of $${couponDoc.minOrder} required`);
                return;
            }

            // Apply logic either flat or percentage
            let discountAmt = 0;
            if (couponDoc.type === 'percentage') {
                discountAmt = (subtotal * couponDoc.value) / 100;
                if (couponDoc.maxDiscount) {
                    discountAmt = Math.min(discountAmt, couponDoc.maxDiscount);
                }
            } else {
                discountAmt = couponDoc.value;
            }

            setCouponDiscount(discountAmt);
            setActiveCoupon(couponCode.toUpperCase());

        } catch (error) {
            console.error("Coupon generation failed", error);
            setCouponError('Failed to apply coupon');
        }
    };

    const applyPoints = () => {
        setPointsError('');
        const points = parseInt(pointsInput, 10);
        
        if (isNaN(points) || points <= 0) {
            setPointsError("Enter a valid amount of points");
            return;
        }

        if (points > (user?.loyaltyPoints || 0)) {
            setPointsError("You don't have enough points");
            return;
        }

        const maxPointsAllowed = Math.floor(subtotal * 10); // Example rule: can't redeem more points than subtotal * 10
        if (points > maxPointsAllowed) {
            setPointsError(`You can only redeem up to ${maxPointsAllowed} points for this order.`);
            return;
        }

        // Each 10 points = $1 discount
        setLoyaltyDiscount(points / 10);
    };

    const handlePayment = async () => {
        if (!validateAddress()) return;

        setIsProcessing(true);
        try {
            // Ideally call a Cloud Function to create Razorpay Order here
            // const functions = getFunctions();
            // const createOrder = httpsCallable(functions, 'createRazorpayOrder');
            // const { data: { rzpOrderId } } = await createOrder({ amount: totalAmount });
            
            // Mocking Razorpay API load
            const res = await loadRazorpay();
            if (!res) throw new Error("Razorpay SDK failed to load");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_MockKeyForDevelopment",
                amount: Math.round(totalAmount * 100),
                currency: "USD", // For testing, Razorpay standard is INR
                name: "Lumière Spa & Salon",
                description: "Luxury Collection Checkout",
                // order_id: rzpOrderId, // Would come from backend
                handler: async function (response) {
                    // Payment successful
                    
                    try {
                        // 1. Verify Payment Server Side 
                        // const verifyPaymentCb = httpsCallable(functions, 'verifyPayment');
                        // await verifyPaymentCb({ razorpay_payment_id: response.razorpay_payment_id, ... })

                        // 2. Order Write
                        const orderData = {
                            userId: user.uid,
                            items,
                            address,
                            subtotal,
                            gst,
                            delivery,
                            couponDiscount,
                            loyaltyDiscount,
                            pointsUsed: loyaltyDiscount * 10,
                            pointsEarned: Math.floor(totalAmount / 10),
                            totalAmount,
                            status: "confirmed",
                            paymentId: response.razorpay_payment_id,
                            createdAt: Timestamp.now()
                        };

                        const orderRef = await addDoc(collection(db, 'orders'), orderData);

                        // 3. Stock Decrement (Batch write)
                        const batch = writeBatch(db);
                        items.forEach(item => {
                            const productRef = doc(db, 'products', item.id);
                            // batch.update(productRef, { stock: increment(-item.quantity) });
                        });
                        
                        // 4. Loyalty Points Update & History Write
                        const earnedPoints = Math.floor(totalAmount / 10);
                        const spentPoints = loyaltyDiscount * 10;
                        const newPointsBalance = (user.loyaltyPoints || 0) - spentPoints + earnedPoints;
                        
                        const userRef = doc(db, 'users', user.uid);
                        // Using batch to update user doc
                        batch.update(userRef, { loyaltyPoints: newPointsBalance });
                        
                        // Write to pointsHistory subcollection
                        if (spentPoints > 0) {
                            const spendHistoryRef = doc(collection(db, 'users', user.uid, 'pointsHistory'));
                            batch.set(spendHistoryRef, {
                                type: 'redeem',
                                points: spentPoints,
                                orderId: orderRef.id,
                                timestamp: Timestamp.now()
                            });
                        }
                        if (earnedPoints > 0) {
                            const earnHistoryRef = doc(collection(db, 'users', user.uid, 'pointsHistory'));
                            batch.set(earnHistoryRef, {
                                type: 'earn',
                                points: earnedPoints,
                                orderId: orderRef.id,
                                timestamp: Timestamp.now()
                            });
                        }

                        await batch.commit();

                        setUser(prev => ({ ...prev, loyaltyPoints: newPointsBalance }));
                        clearCart();
                        setCouponDiscount(0);
                        setActiveCoupon(null);
                        setLoyaltyDiscount(0);
                        
                        alert(`Payment Successful! You earned ${earnedPoints} points.`);
                        navigate('/profile'); // or /orders/{orderId}
                    } catch (err) {
                        console.error("Order fulfillment failed", err);
                        alert("Payment succeeded but order creation failed. Contact support.");
                    }
                },
                prefill: {
                    name: address.name,
                    email: user?.email,
                    contact: address.phone,
                },
                theme: { color: "#D4AF37" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                // Order Failure - Could handle retry logic or pending status updates
                alert("Payment declined or dropped. Please try again.");
            });
            rzp.open();
        } catch (error) {
            console.error("Checkout failed:", error);
            alert(error.message || "An error occurred during checkout");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-4xl md:text-5xl text-neutral-800 font-light mb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                            Secure Checkout
                        </h1>
                        <p className="text-neutral-500 font-serif italic">Complete your timeless selection</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Address Section */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 lg:p-10 shadow-xl shadow-gold-300/5 border border-gold-300/10">
                            <h2 className="text-xl text-neutral-800 uppercase tracking-widest mb-8 border-b border-gold-300/20 pb-4">Shipping Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-neutral-500">Full Name</label>
                                    <input 
                                        type="text" name="name" value={address.name} onChange={handleInputChange}
                                        className={`w-full p-4 bg-cream-50/50 border ${errors.name ? 'border-red-300' : 'border-gold-300/20'} focus:outline-none focus:border-gold-500 transition-colors text-sm`}
                                        placeholder="Jane Doe"
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-neutral-500">Phone</label>
                                    <input 
                                        type="tel" name="phone" value={address.phone} onChange={handleInputChange}
                                        className={`w-full p-4 bg-cream-50/50 border ${errors.phone ? 'border-red-300' : 'border-gold-300/20'} focus:outline-none focus:border-gold-500 transition-colors text-sm`}
                                        placeholder="Mobile Number"
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-neutral-500">Street Address</label>
                                    <input 
                                        type="text" name="street" value={address.street} onChange={handleInputChange}
                                        className={`w-full p-4 bg-cream-50/50 border ${errors.street ? 'border-red-300' : 'border-gold-300/20'} focus:outline-none focus:border-gold-500 transition-colors text-sm`}
                                        placeholder="123 Luxury Ave..."
                                    />
                                    {errors.street && <p className="text-[10px] text-red-500">{errors.street}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-neutral-500">City</label>
                                    <input 
                                        type="text" name="city" value={address.city} onChange={handleInputChange}
                                        className={`w-full p-4 bg-cream-50/50 border ${errors.city ? 'border-red-300' : 'border-gold-300/20'} focus:outline-none focus:border-gold-500 transition-colors text-sm`}
                                        placeholder="Metropolis"
                                    />
                                    {errors.city && <p className="text-[10px] text-red-500">{errors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-neutral-500">Pincode</label>
                                    <input 
                                        type="text" name="pincode" value={address.pincode} onChange={handleInputChange}
                                        className={`w-full p-4 bg-cream-50/50 border ${errors.pincode ? 'border-red-300' : 'border-gold-300/20'} focus:outline-none focus:border-gold-500 transition-colors text-sm`}
                                        placeholder="Zip / Postal"
                                    />
                                    {errors.pincode && <p className="text-[10px] text-red-500">{errors.pincode}</p>}
                                </div>
                            </div>
                        </motion.div>

                        {/* Coupon Section */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}  className="bg-white p-8 lg:p-10 shadow-xl shadow-gold-300/5 border border-gold-300/10">
                            <h2 className="flex items-center gap-3 text-xl text-neutral-800 uppercase tracking-widest mb-6">
                                <BadgePercent className="w-5 h-5 text-gold-500" />
                                Privileges & Codes
                            </h2>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter Coupon / Invite Code" 
                                    className="flex-1 p-4 bg-cream-50/50 border border-gold-300/20 focus:outline-none focus:border-gold-500 transition-colors text-sm uppercase"
                                    disabled={activeCoupon}
                                />
                                <button 
                                    onClick={activeCoupon ? () => { setActiveCoupon(null); setCouponDiscount(0); setCouponCode(''); } : applyCoupon}
                                    className={`px-8 py-4 uppercase tracking-widest text-xs transition-colors ${activeCoupon ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-neutral-900 text-white hover:bg-gold-500'}`}
                                >
                                    {activeCoupon ? 'Remove' : 'Apply'}
                                </button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-3 mt-2">{couponError}</p>}
                            {activeCoupon && <p className="text-green-600 flex items-center gap-1 text-xs mt-3"><CheckCircle className="w-3 h-3"/> {activeCoupon} Applied with ${couponDiscount.toFixed(2)} savings</p>}
                        </motion.div>

                        {/* Loyalty Section */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white p-8 lg:p-10 shadow-xl shadow-gold-300/5 border border-gold-300/10 mb-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="flex items-center gap-3 text-xl text-neutral-800 uppercase tracking-widest">
                                    <BadgePercent className="w-5 h-5 text-gold-500" />
                                    Loyalty Program
                                </h2>
                                <span className="text-sm font-medium text-gold-600 bg-gold-50 px-3 py-1 rounded-full">{user?.loyaltyPoints || 0} pts</span>
                            </div>
                            <p className="text-xs text-neutral-500 italic font-serif mb-6">Redeem 10 points for a $1 discount.</p>
                            <div className="flex gap-4">
                                <input 
                                    type="number" 
                                    value={pointsInput} 
                                    onChange={(e) => setPointsInput(e.target.value)}
                                    placeholder="Enter points" 
                                    className="flex-1 p-4 bg-cream-50/50 border border-gold-300/20 focus:outline-none focus:border-gold-500 transition-colors text-sm uppercase"
                                    disabled={loyaltyDiscount > 0}
                                />
                                <button 
                                    onClick={loyaltyDiscount > 0 ? () => { setLoyaltyDiscount(0); setPointsInput(''); } : applyPoints}
                                    className={`px-8 py-4 uppercase tracking-widest text-xs transition-colors ${loyaltyDiscount > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-neutral-900 text-white hover:bg-gold-500'}`}
                                >
                                    {loyaltyDiscount > 0 ? 'Remove' : 'Apply'}
                                </button>
                            </div>
                            {pointsError && <p className="text-red-500 text-xs mt-3">{pointsError}</p>}
                            {loyaltyDiscount > 0 && <p className="text-green-600 flex items-center gap-1 text-xs mt-3"><CheckCircle className="w-3 h-3"/> ${loyaltyDiscount.toFixed(2)} discount applied.</p>}
                        </motion.div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                         <div className="bg-white p-8 lg:p-10 shadow-xl shadow-gold-300/5 sticky top-32 border border-gold-300/10">
                            <h2 className="text-2xl text-neutral-800 font-light mb-8 pb-4 border-b border-gold-300/20" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                                Order Summary
                            </h2>
                            
                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-16 object-cover border border-gold-300/10" />
                                        <div className="flex-1">
                                            <h4 className="text-xs uppercase tracking-wider text-neutral-800">{item.name}</h4>
                                            <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-800">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-gold-300/20 pt-6">
                                <div className="flex justify-between text-neutral-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>${subtotal?.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-gold-600 text-sm">
                                        <span>Discount ({activeCoupon})</span>
                                        <span>-${couponDiscount?.toFixed(2)}</span>
                                    </div>
                                )}
                                {loyaltyDiscount > 0 && (
                                    <div className="flex justify-between text-gold-600 text-sm">
                                        <span>Points Discount</span>
                                        <span>-${loyaltyDiscount?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-neutral-500 text-sm">
                                    <span>Shipping</span>
                                    {delivery === 0 ? (
                                        <span className="text-gold-500 uppercase tracking-widest text-[10px]">Complimentary</span>
                                    ) : (
                                        <span>${delivery?.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-neutral-500 text-sm pb-4 border-b border-gold-300/20">
                                    <span>Estimated Tax (18% GST)</span>
                                    <span>${gst?.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-sm uppercase tracking-widest text-neutral-800 font-medium">Total</span>
                                    <span className="text-3xl text-neutral-800 font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                                        ${totalAmount?.toFixed(2)}
                                    </span>
                                </div>

                                <button 
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full bg-neutral-900 text-white py-5 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-all duration-500 mt-8 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing Securely...' : 'Place Secure Order'}
                                    <Lock className="w-3 h-3" />
                                </button>
                                
                                <p className="text-[10px] text-neutral-400 text-center uppercase tracking-widest mt-4">
                                    Your data is securely encrypted.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
