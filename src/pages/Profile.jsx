import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { 
  Plus,
  Package,
  Calendar as CalendarIcon,
  Clock,
  RefreshCw,
  Star,
  Check,
  Truck,
  Box as BoxIcon,
  CreditCard as CreditCardIcon,
  ShoppingBag,
  ChevronDown,
  Send,
  Edit3,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { calculateNewAverage } from "../utils/logicUtils";

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const [reviewingItem, setReviewingItem] = useState(null); 
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (user) {
      if (activeTab === "orders") fetchOrders();
      if (activeTab === "appointments") fetchAppointments();
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
      );
      const snapshot = await getDocs(q);
      const rawOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      rawOrders.sort((a, b) => {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setOrders(rawOrders);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", user.uid),
      );
      const snapshot = await getDocs(q);
      const rawAppts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      rawAppts.sort((a, b) => {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setAppointments(rawAppts);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e, orderId, item) => {
    e.preventDefault();
    if (reviewComment.length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await runTransaction(db, async (transaction) => {
        const productRef = doc(db, "products", item.id);
        const pSnap = await transaction.get(productRef);
        const pData = pSnap.exists() ? pSnap.data() : { averageRating: 0, reviewCount: 0 };
        
        const { nextAvg, nextCount } = calculateNewAverage(
          pData.averageRating, 
          pData.reviewCount, 
          reviewRating, 
          null, 
          "add"
        );

        transaction.update(productRef, {
          averageRating: nextAvg,
          reviewCount: nextCount
        });

        const revId = `${user.uid}_${item.id}_${orderId}`; 
        const revRef = doc(db, "reviews", revId);
        transaction.set(revRef, {
          productId: item.id,
          userId: user.uid,
          userName: user.displayName || "Anonymous",
          rating: reviewRating,
          comment: reviewComment,
          createdAt: Timestamp.now(),
          orderId: orderId
        });
      });

      toast.success("Experience published.");
      setReviewingItem(null);
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Review submission failed", error);
      toast.error("Failed to save review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const requestReturn = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to request a return and refund for this order?",
      )
    ) {
      try {
        await updateDoc(doc(db, "orders", orderId), {
          status: "return requested",
          returnRequestedAt: Timestamp.now(),
        });
        fetchOrders();
        alert("Return requested successfully. Subject to admin approval.");
      } catch (err) {
        console.error("Return failed", err);
      }
    }
  };

  const cancelAppointment = async (apptId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await updateDoc(doc(db, "appointments", apptId), {
          status: "cancelled",
        });
        fetchAppointments();
      } catch (err) {
        console.error("Cancel failed", err);
      }
    }
  };

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: '/profile' }} replace />;
  }

  const orderSteps = [
    { id: "pending", label: "Pending", icon: CreditCardIcon },
    { id: "confirmed", label: "Confirmed", icon: Check },
    { id: "processing", label: "Processing", icon: BoxIcon },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: ShoppingBag },
  ];
  const getStepIndex = (status) => orderSteps.findIndex(s => s.id === status);

  return (
    <div className="min-h-screen bg-cream-50 pt-24 md:pt-32 pb-20 md:pb-24 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4 lg:sticky lg:top-32 h-fit space-y-8"
          >
            <div className="hidden lg:block">
              <h2 className="text-2xl text-neutral-800 font-light mb-2 font-serif">
                Welcome back
              </h2>
              <p className="text-gold-600 tracking-widest text-sm uppercase font-bold">
                {user?.displayName || "Guest User"}
              </p>
            </div>

            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 border-b border-neutral-200 lg:border-none pb-1 lg:pb-0 gap-6 lg:gap-4 scroll-smooth">
              {[
                { id: "profile", label: "My Profile" },
                { id: "orders", label: "Orders" },
                { id: "appointments", label: "Appointments" },
                { id: "wishlist", label: "Wishlist", type: "link", path: "/wishlist" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.type === "link" ? navigate(tab.path) : setActiveTab(tab.id)}
                  className={`whitespace-nowrap text-left text-[11px] lg:text-sm uppercase tracking-widest font-medium transition-all relative py-2 lg:py-0 ${
                    activeTab === tab.id 
                    ? "text-neutral-900 font-bold" 
                    : "text-neutral-400 hover:text-gold-500"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 lg:hidden" 
                    />
                  )}
                </button>
              ))}

              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="whitespace-nowrap text-left text-[11px] lg:text-sm uppercase tracking-widest font-bold text-gold-600 hover:text-gold-700 pt-4 lg:mt-4 border-t border-neutral-200 hidden lg:block"
                >
                  Admin Portal
                </button>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden lg:block text-xs uppercase tracking-widest text-red-500 font-bold hover:text-red-600 border-t border-neutral-200 pt-6 mt-8 w-full text-left transition-colors"
            >
              Sign Out
            </button>
          </motion.div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:w-3/4 bg-white p-6 md:p-8 lg:p-12 shadow-xl shadow-gold-300/5 relative overflow-hidden min-h-[500px] border border-neutral-100 rounded-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blush-100/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    <section>
                      <h3 className="text-xl text-neutral-800 font-light mb-6 border-b border-gold-300/30 pb-4 font-serif">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm border p-6 md:p-8 border-gold-300/10 bg-cream-50/20">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                            Email Address
                          </label>
                          <p className="text-neutral-800 font-medium break-all">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                            Loyalty Points
                          </label>
                          <p className="text-gold-600 font-bold text-lg">
                            {user.loyaltyPoints || 0} pts
                          </p>
                        </div>
                      </div>
                    </section>
                    
                    <section className="lg:hidden pt-8 border-t border-neutral-100">
                      <button
                        onClick={handleLogout}
                        className="text-[10px] uppercase tracking-widest text-red-500 font-bold border border-red-100 px-6 py-3 rounded-sm hover:bg-red-50 transition-colors w-full"
                      >
                        Sign Out of Account
                      </button>
                    </section>
                  </motion.div>
                )}

                {activeTab === "orders" && (
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl text-neutral-800 font-light mb-8 border-b border-gold-300/30 pb-4 font-serif">
                      Order History
                    </h3>
                    {isLoading ? (
                      <div className="text-center py-20 text-neutral-400 font-serif italic">
                        Loading your treasures...
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-neutral-200">
                        <Package className="w-10 h-10 text-neutral-200 mx-auto mb-4" />
                        <p className="text-neutral-500 font-light font-serif italic mb-6">
                          You have not placed any orders yet.
                        </p>
                        <button
                          onClick={() => navigate("/shop")}
                          className="text-[11px] uppercase tracking-[0.2em] text-white bg-neutral-900 px-8 py-3 hover:bg-gold-600 transition-colors shadow-lg"
                        >
                          Discover Collection
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 md:space-y-8">
                        {orders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          let currentStep = getStepIndex(order.status);
                          const isSpecialStatus = ["return requested", "refunded", "cancelled"].includes(order.status);
                          return (
                            <div key={order.id} className="bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden lg:rounded-sm">
                              <div className="bg-neutral-50/50 p-4 md:p-6 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between">
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                  <div className="space-y-1">
                                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Ref No.</p>
                                    <p className="text-xs font-bold text-neutral-800 tracking-wider">#{order.id.slice(0, 8).toUpperCase()}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Placed On</p>
                                    <p className="text-xs font-bold text-neutral-800">
                                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Amount</p>
                                    <p className="text-xs font-bold text-gold-600">₹{order.totalAmount?.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="hidden sm:flex md:text-right flex-col items-end">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gold-500'}`}></div>
                                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-800">{order.status}</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-gold-50 text-neutral-600 hover:text-gold-700 rounded-sm transition-all duration-300 group"
                                  >
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{isExpanded ? 'Hide' : 'Details'}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 md:p-8 border-t border-neutral-100">
                                      {!isSpecialStatus && (
                                        <div className="mb-10 md:mb-12">
                                          <div className="md:hidden space-y-4 py-4">
                                            {orderSteps.map((step, idx) => {
                                              const Icon = step.icon;
                                              return (
                                                <div key={step.id} className="flex gap-4 items-start relative">
                                                  {idx !== orderSteps.length - 1 && (
                                                    <div className={`absolute left-[13px] top-6 w-[2px] h-[calc(100%-10px)] ${idx < currentStep ? "bg-green-500" : "bg-neutral-100"}`} />
                                                  )}
                                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm z-10 ${
                                                    idx < currentStep ? "bg-green-500 text-white" : 
                                                    idx === currentStep ? "bg-gold-500 text-white animate-pulse" : 
                                                    "bg-neutral-100 text-neutral-400 border border-neutral-200"
                                                  }`}>
                                                    <Icon size={12} strokeWidth={3} />
                                                  </div>
                                                  <div className="pt-1">
                                                    <p className={`text-[10px] uppercase tracking-widest font-bold ${idx <= currentStep ? "text-neutral-800" : "text-neutral-300"}`}>
                                                      {step.label}
                                                    </p>
                                                    {idx === currentStep && (
                                                      <p className="text-[9px] text-gold-500 italic mt-0.5 font-medium">Your ritual is currently being {step.id}...</p>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>

                                          <div className="hidden md:block px-4">
                                            <div className="flex items-center justify-between relative px-2">
                                              <div className="absolute left-0 right-0 top-1/2 -mt-0.5 h-0.5 bg-neutral-100 -z-10 rounded"></div>
                                              {orderSteps.map((step, idx) => (
                                                <div
                                                  key={step.id}
                                                  className="flex flex-col items-center relative"
                                                >
                                                  <div className={`w-4 h-4 rounded-full shadow ring-4 ring-white transition-all duration-500 ${
                                                    idx < currentStep ? "bg-green-500" : 
                                                    idx === currentStep ? "bg-gold-500 animate-pulse" : 
                                                    "bg-neutral-200"
                                                  }`}></div>
                                                  <span
                                                    className={`absolute top-6 text-[10px] uppercase tracking-widest whitespace-nowrap ${
                                                      idx <= currentStep ? "text-neutral-800 font-bold" : "text-neutral-400 font-medium"
                                                    } text-center`}
                                                  >
                                                    {step.label}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {isSpecialStatus && (
                                        <div className="mb-6 bg-red-50 text-red-600 p-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center border border-red-100">{order.status}</div>
                                      )}

                                      <div className="space-y-6 md:space-y-8">
                                        {order.items?.map((item) => {
                                          const isReviewing = reviewingItem?.itemId === item.id && reviewingItem?.orderId === order.id;
                                          return (
                                            <div key={item.id}>
                                              <div className="flex gap-4 md:gap-8 items-start">
                                                <div className="w-16 h-20 md:w-24 md:h-32 flex-shrink-0 bg-neutral-50 rounded-sm overflow-hidden border border-neutral-100 shadow-inner">
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0 py-1">
                                                  <h4 className="text-[11px] md:text-sm uppercase tracking-wider text-neutral-800 font-bold truncate">{item.name}</h4>
                                                  <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest font-medium">Quantity: {item.quantity}</p>
                                                  <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-4 md:mt-6">
                                                    <div className="text-xs md:text-base font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                                                    {order.status === "delivered" && (
                                                      <button 
                                                        onClick={() => {
                                                          if (isReviewing) {
                                                            setReviewingItem(null);
                                                          } else {
                                                            setReviewingItem({ orderId: order.id, itemId: item.id });
                                                          }
                                                        }}
                                                        className={`inline-flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.1em] px-4 py-2 rounded-full transition-all font-bold shadow-sm ${
                                                          isReviewing
                                                            ? "bg-neutral-800 text-white"
                                                            : "bg-gold-600 text-white hover:bg-gold-400"
                                                        }`}
                                                      >
                                                        <Star className={`w-3 h-3 ${isReviewing ? 'fill-gold-400 text-gold-400' : 'fill-white text-yellow-500'}`} /> 
                                                        <span className={isReviewing ? "text-white" : "text-yellow-800"}>
                                                          {isReviewing ? "Closing Form" : "Review Ritual"}
                                                        </span>
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <AnimatePresence>
                                                {isReviewing && (
                                                  <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-6 p-6 bg-cream-50/50 border border-gold-300/10 overflow-hidden"
                                                  >
                                                    <h5 className="text-[11px] uppercase tracking-widest text-neutral-800 font-bold mb-6 flex items-center gap-2">
                                                      <Edit3 className="w-3 h-3 text-gold-600" /> Write a Review
                                                    </h5>
                                                    
                                                    <form onSubmit={(e) => handleReviewSubmit(e, order.id, item)} className="space-y-5">
                                                      <div>
                                                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Rate Your Return</label>
                                                        <div className="flex gap-2">
                                                          {[1, 2, 3, 4, 5].map(star => (
                                                            <button 
                                                              type="button" 
                                                              key={star} 
                                                              onClick={() => setReviewRating(star)}
                                                              className="focus:outline-none transition-transform hover:scale-110"
                                                            >
                                                              <Star className={`w-5 h-5 ${reviewRating >= star ? 'fill-gold-500 text-gold-500' : 'text-neutral-200'}`} />
                                                            </button>
                                                          ))}
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Your Experience</label>
                                                        <textarea 
                                                          required
                                                          rows="3"
                                                          value={reviewComment}
                                                          onChange={(e) => setReviewComment(e.target.value)}
                                                          className="w-full bg-white border border-gold-300/20 focus:outline-none focus:border-gold-500 transition-colors p-3 text-xs resize-none"
                                                          placeholder="Detailed thoughts on luxury and efficacy..."
                                                        />
                                                      </div>
                                                      <button 
                                                        type="submit"
                                                        disabled={isSubmittingReview}
                                                        className="w-full bg-neutral-900 text-white py-3 uppercase tracking-[0.2em] text-[9px] font-bold hover:bg-gold-500 transition-colors flex items-center justify-center gap-2"
                                                      >
                                                        {isSubmittingReview ? "Publishing..." : "Submit Experience"}
                                                        {!isSubmittingReview && <Send className="w-2.5 h-2.5"/>}
                                                      </button>
                                                    </form>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      
                                      {order.status === "delivered" && (
                                        <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                                          <button onClick={() => requestReturn(order.id)} className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-red-500 flex items-center gap-2 transition-colors duration-300">
                                            <RefreshCw className="w-3 h-3" /> Request Return
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "appointments" && (
                  <motion.div
                    key="appointments-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl text-neutral-800 font-light mb-8 border-b border-gold-300/30 pb-4 font-serif">
                      Your Appointments
                    </h3>
                    {isLoading ? (
                      <div className="text-center py-20 text-neutral-400 font-serif italic">Fetching reservations...</div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-neutral-200">
                        <CalendarIcon className="w-10 h-10 text-neutral-200 mx-auto mb-4" />
                        <p className="text-neutral-500 font-light font-serif italic mb-6">No upcoming appointments found.</p>
                        <button onClick={() => navigate("/appointments")} className="text-[11px] uppercase tracking-[0.2em] text-white bg-neutral-900 px-8 py-3 hover:bg-gold-600 transition-colors shadow-lg">Reserve a Treatment</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {appointments.map((appt) => (
                          <div key={appt.id} className="border border-neutral-100 p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-gold-300/5 transition-all duration-500 bg-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50/30 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-6 text-neutral-800">
                                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${appt.status === "cancelled" ? "bg-red-50 text-red-500 border border-red-100" : appt.status === "confirmed" ? "bg-green-50 text-green-600 border border-green-100" : "bg-gold-50 text-gold-700 border border-gold-100"}`}>
                                  {appt.status}
                                </span>
                                <span className="text-[10px] text-neutral-300 font-mono tracking-wider">#{appt.bookingId?.slice(-6) || appt.id.slice(0, 6)}</span>
                              </div>
                              <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-neutral-800 mb-3">{appt.serviceName}</h4>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-600">
                                  <CalendarIcon className="w-4 h-4 text-gold-500" />
                                  <span className="text-xs font-medium font-serif italic">{new Date(appt.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-600">
                                  <Clock className="w-4 h-4 text-gold-500" />
                                  <span className="text-xs font-medium uppercase tracking-widest">{appt.time} &bull; {appt.duration} MINS</span>
                                </div>
                              </div>
                              <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-[9px] uppercase tracking-widest text-neutral-400">Treatment Cost</p>
                                  <p className="text-lg font-bold text-neutral-900">₹{appt.price.toLocaleString()}</p>
                                </div>
                                {(appt.status === "pending" || appt.status === "confirmed") && (
                                  <button onClick={() => cancelAppointment(appt.id)} className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5">Cancel</button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
