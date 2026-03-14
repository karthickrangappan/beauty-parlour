import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { Star, Edit3, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    
    const [reviews, setReviews] = useState([]);
    const [isEligible, setIsEligible] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    
    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        fetchReviews();
        if (user) {
            checkEligibility();
            checkExistingReview();
        }
    }, [productId, user]);

    const fetchReviews = async () => {
        try {
            const q = query(collection(db, "reviews"), where("productId", "==", productId));
            const querySnapshot = await getDocs(q);
            const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // sort by date descending
            fetched.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
            setReviews(fetched);
        } catch (error) {
            console.error("Error fetching reviews", error);
        }
    };

    const checkEligibility = async () => {
        // Mock eligibility check: check if user has a 'delivered' order containing this productId
        // For demonstration, we'll try to query orders
        try {
            const q = query(
                collection(db, "orders"), 
                where("userId", "==", user.uid),
                where("status", "==", "delivered")
            );
            const querySnapshot = await getDocs(q);
            let eligible = false;
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const hasProduct = orderData.items?.some(item => item.id === productId);
                if (hasProduct) {
                    eligible = true;
                }
            });
            setIsEligible(eligible);
        } catch (error) {
            console.error("Error checking eligibility", error);
        }
    };

    const checkExistingReview = async () => {
        try {
            const q = query(
                collection(db, "reviews"), 
                where("productId", "==", productId),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const rev = querySnapshot.docs[0];
                setExistingReview({ id: rev.id, ...rev.data() });
                setRating(rev.data().rating);
                setComment(rev.data().comment);
            }
        } catch (error) {
            console.error("Error checking existing review", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEligible && !existingReview) return;
        
        setIsSubmitting(true);
        setSuccessMsg("");

        try {
            const reviewData = {
                productId,
                userId: user.uid,
                userName: user.displayName || "Anonymous",
                rating,
                comment,
                updatedAt: Timestamp.now()
            };

            if (existingReview) {
                // Edit
                const ref = doc(db, "reviews", existingReview.id);
                await updateDoc(ref, reviewData);
                setSuccessMsg("Review updated gracefully. Rating will sync shortly.");
            } else {
                // Create
                reviewData.createdAt = Timestamp.now();
                await addDoc(collection(db, "reviews"), reviewData);
                setSuccessMsg("Review published. Thank you for sharing your experience.");
                setExistingReview(reviewData); // mark as existing now
            }
            
            fetchReviews(); // refresh
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-24 border-t border-neutral-100 pt-16">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-light text-neutral-800" style={{ fontFamily: "ui-serif, Georgia, serif" }}>Client Experiences</h2>
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                    <span className="text-xl font-medium">{reviews.length > 0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "0.0"}</span>
                    <span className="text-neutral-400 text-sm ml-2">({reviews.length} reviews)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Review Form Area */}
                <div className="lg:col-span-4">
                    {!user ? (
                        <div className="bg-cream-50 p-8 text-center border border-gold-300/10">
                            <h3 className="text-sm uppercase tracking-widest text-neutral-800 mb-2">Share Your Thoughts</h3>
                            <p className="text-xs text-neutral-500 leading-relaxed font-serif italic mb-6">Please sign in to leave a review for your purchased rituals.</p>
                        </div>
                    ) : !isEligible && !existingReview ? (
                        <div className="bg-cream-50 p-8 text-center border border-gold-300/10 bg-opacity-50">
                            <AlertCircle className="w-6 h-6 text-neutral-300 mx-auto mb-3"/>
                            <p className="text-xs text-neutral-500 leading-relaxed font-serif italic">Only clients who have received this product can pen an experience.</p>
                        </div>
                    ) : (
                        <div className="bg-white p-8 shadow-xl shadow-gold-300/5 border border-gold-300/10">
                            <h3 className="text-sm uppercase tracking-widest text-neutral-800 mb-6 flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-gold-500"/>
                                {existingReview ? "Edit Your Review" : "Write a Review"}
                            </h3>
                            
                            {successMsg ? (
                                <div className="bg-green-50 text-green-700 p-4 text-xs tracking-wide flex items-center gap-3 mb-6">
                                    <CheckCircle className="w-4 h-4"/>
                                    {successMsg}
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-3">Rate Your Return</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                type="button" 
                                                key={star} 
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-6 h-6 ${rating >= star ? 'fill-gold-500 text-gold-500' : 'text-neutral-200'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-3">Your Experience</label>
                                    <textarea 
                                        required
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-cream-50/50 border border-gold-300/20 focus:outline-none focus:border-gold-500 transition-colors p-4 text-sm resize-none custom-scrollbar"
                                        placeholder="Detailed thoughts on luxury and efficacy..."
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-neutral-900 text-white py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-gold-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Publishing..." : "Submit Experience"}
                                    {!isSubmitting && <Send className="w-3 h-3"/>}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-8">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-neutral-200">
                            <p className="text-neutral-400 font-serif italic">No experiences shared yet. Be the first to grace this collection with your thoughts.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {reviews.map(review => (
                                <motion.div 
                                    key={review.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pb-8 border-b border-neutral-100 last:border-0"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600 font-serif font-medium uppercase border border-gold-300/20">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-800 uppercase tracking-wider">{review.userName}</h4>
                                                <p className="text-[10px] text-neutral-400 mt-1">
                                                    {review.createdAt ? review.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "Recently"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-neutral-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed font-light pl-14">
                                        "{review.comment}"
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductReviews;
