import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc, runTransaction } from "firebase/firestore";
import { Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateNewAverage } from "../utils/logicUtils";
import { toast } from "react-hot-toast";

const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avg: 0, count: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "reviews"), where("productId", "==", productId));
            const querySnapshot = await getDocs(q);
            const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setReviews(fetched);
            
            const productRef = doc(db, "products", productId);
            const pSnap = await getDocs(query(collection(db, "products"), where("id", "==", productId)));
            
            if (!pSnap.empty) {
                const data = pSnap.docs[0].data();
                setStats({ 
                    avg: data.averageRating || 0, 
                    count: data.reviewCount || 0 
                });
            } else {
                const count = fetched.length;
                const avg = count > 0 ? fetched.reduce((a, b) => a + b.rating, 0) / count : 0;
                setStats({ avg: parseFloat(avg.toFixed(1)), count });
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (review) => {
        if (!window.confirm("Are you sure you want to remove your shared experience? This will also update the product's overall rating.")) return;
        
        try {
            await runTransaction(db, async (transaction) => {
                const productRef = doc(db, "products", productId);
                const pSnap = await transaction.get(productRef);
                
                if (!pSnap.exists()) throw new Error("Product not found");
                
                const pData = pSnap.data();
                const { nextAvg, nextCount } = calculateNewAverage(
                    pData.averageRating || 0, 
                    pData.reviewCount || 0, 
                    null, 
                    review.rating, 
                    "delete"
                );

                transaction.update(productRef, {
                    averageRating: nextAvg,
                    reviewCount: nextCount
                });

                transaction.delete(doc(db, "reviews", review.id));
            });
            
            toast.success("Ritual review removed.");
            fetchReviews();
        } catch (error) {
            console.error("Deletion failed", error);
            toast.error("Process failed. Please try again later.");
        }
    };

    return (
        <div className="mt-24 border-t border-neutral-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl font-light text-neutral-800" style={{ fontFamily: "ui-serif, Georgia, serif" }}>Client Experiences</h2>
                    <p className="text-xs text-neutral-400 mt-2 uppercase tracking-widest font-medium">Verified thoughts from our community</p>
                </div>
                <div className="flex items-center gap-4 bg-cream-50 px-6 py-4 rounded-2xl border border-gold-300/10 shadow-sm shadow-gold-100/20">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.round(stats.avg) ? 'fill-gold-500 text-gold-500' : 'text-neutral-200'}`} 
                            />
                        ))}
                    </div>
                    <div className="h-4 w-[1px] bg-neutral-200 mx-2 hidden md:block" />
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-neutral-900">{stats.avg}</span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">/ 5.0</span>
                    </div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold ml-2">({stats.count} reviews)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Summoning experiences...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-3xl">
                        <p className="text-neutral-400 font-serif italic text-lg mb-2">The collection is waiting for its first story.</p>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold">Share your ritual from your order history</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <AnimatePresence mode="popLayout">
                            {reviews.map(review => (
                                <motion.div 
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group pb-10 border-b border-neutral-100 last:border-0"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-50 flex items-center justify-center text-gold-600 font-serif font-bold text-lg uppercase border border-gold-300/20 shadow-sm group-hover:shadow-md transition-all duration-500 group-hover:-translate-y-1">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">{review.userName}</h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-neutral-100'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-200" />
                                                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold font-sans">
                                                        {review.createdAt ? review.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : "Just Now"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {user && user.uid === review.userId && (
                                            <button 
                                                onClick={() => deleteReview(review)}
                                                className="sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 text-[10px] text-red-500 uppercase tracking-widest font-bold hover:bg-red-50"
                                            >
                                                <Trash2 size={12} /> Remove Experience
                                            </button>
                                        )}
                                    </div>
                                    <div className="pl-0 sm:pl-[68px]">
                                        <div className="relative">
                                            <span className="absolute -left-4 -top-2 text-4xl text-cream-200 font-serif leading-none italic select-none">"</span>
                                            <p className="text-base text-neutral-600 leading-relaxed font-light font-serif italic italic-none">
                                                {review.comment}
                                            </p>
                                            <span className="absolute -right-4 bottom-0 text-4xl text-cream-200 font-serif leading-none italic rotate-180 select-none">"</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
