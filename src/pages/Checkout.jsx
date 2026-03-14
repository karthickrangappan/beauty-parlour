import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fmtCurrency, APP_NAME } from "../constants/config";
import { getShippingStats } from "../utils/logicUtils";
import { useToaster } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Loader2
} from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function Checkout() {
  const { cart, subtotal, gst, couponDiscount, loyaltyDiscount, placeOrder } = useCart();
  const { user } = useAuth();
  const { toast } = useToaster();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingStats, setShippingStats] = useState({ charge: 0, estimatedDays: 5 });

  const handleZipChange = (zip) => {
    setForm({ ...form, zip });
    if (zip.length >= 6) {
      const stats = getShippingStats(subtotal, zip);
      setShippingStats(stats);
    }
  };

  // Calculate final total correctly: Subtotal - Discounts + GST + Pincode-specific Shipping
  const finalTotal = subtotal - couponDiscount - loyaltyDiscount + gst + shippingStats.charge;

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.zip) {
      toast("Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };
  const handleCOD = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      await placeOrder({
        customer: form,
        paymentType: "COD",
        paymentId: "COD",
        status: "confirmed",
        deliveryCharge: shippingStats.charge,
        estimatedDays: shippingStats.estimatedDays,
        totalAmount: finalTotal
      });

      toast("Order placed successfully 🚚 (Cash on Delivery)", "success");
      navigate("/profile");
    } catch (err) {
      toast("Failed to place order. Try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpay = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast("Razorpay SDK failed to load. Check internet.", "error");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_2ORD27rb7vGhwj",
      amount: Math.round(finalTotal * 100),
      currency: "INR",
      name: APP_NAME,
      description: "Order Payment",
      handler: async function (response) {
        try {
          await placeOrder({
            customer: form,
            paymentType: "Razorpay",
            paymentId: response.razorpay_payment_id,
            status: "confirmed",
            deliveryCharge: shippingStats.charge,
            estimatedDays: shippingStats.estimatedDays,
            totalAmount: finalTotal
          });

          toast("Payment successful ✅", "success");
          navigate("/profile");
        } catch (err) {
          toast("Payment confirmed but order failed. Contact support.", "error");
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#D4AF37" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
    setIsProcessing(false);
  };

  if (!cart || Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-3xl font-light text-neutral-800 mb-4" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
            Your Bag is Empty
          </h2>
          <p className="text-neutral-500 mb-10 font-light leading-relaxed">
            It seems you haven't added any treasures to your collection yet.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-10 py-4 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors duration-300"
          >
            Explore Collection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <PageHeader 
        eyebrow="Complete Your Selection"
        titleStart="Finalize Your"
        titleItalic="Order"
        description="Verify your delivery details and choose your preferred payment method to complete the journey."
      />

      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-neutral-400 hover:text-gold-500 transition-colors mb-12 text-xs uppercase tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Shipping */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 shadow-sm border border-neutral-100"
            >
              <div className="flex items-center gap-4 mb-10">
                <span className="w-10 h-10 rounded-full bg-cream-100 text-gold-600 flex items-center justify-center text-sm font-serif italic border border-gold-200">
                  1
                </span>
                <h2 className="text-xl md:text-2xl font-light text-neutral-800 tracking-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                  Delivery Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input
                        type="text"
                        placeholder="Elizabeth Bennett"
                        className="w-full bg-cream-50/50 border border-neutral-200 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input
                        type="email"
                        className="w-full bg-neutral-50 border border-neutral-100 py-4 pl-12 pr-4 text-sm text-neutral-400 cursor-not-allowed outline-none"
                        value={form.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-cream-50/50 border border-neutral-200 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                      Full Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-neutral-300" />
                      <textarea
                        placeholder="Building, Street, Landmark..."
                        rows="4"
                        className="w-full bg-cream-50/50 border border-neutral-200 py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors resize-none"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Chennai"
                        className="w-full bg-cream-50/50 border border-neutral-200 py-4 px-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-semibold">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="600001"
                        className="w-full bg-cream-50/50 border border-neutral-200 py-4 px-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                        value={form.zip}
                        onChange={(e) => handleZipChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Payment */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 md:p-12 shadow-sm border border-neutral-100"
            >
              <div className="flex items-center gap-4 mb-10">
                <span className="w-10 h-10 rounded-full bg-cream-100 text-gold-600 flex items-center justify-center text-sm font-serif italic border border-gold-200">
                  2
                </span>
                <h2 className="text-xl md:text-2xl font-light text-neutral-800 tracking-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  disabled={isProcessing}
                  onClick={handleRazorpay}
                  className="group relative flex flex-col items-start p-6 bg-white border border-neutral-200 hover:border-gold-500 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-cream-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                    <CreditCard className="w-6 h-6 text-gold-600" />
                  </div>
                  <h4 className="text-sm uppercase tracking-widest font-bold text-neutral-800 mb-2">Online Payment</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
                    Razorpay Secure: UPI, Cards, Netbanking
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold-600 font-bold">
                    Pay Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleCOD}
                  className="group relative flex flex-col items-start p-6 bg-white border border-neutral-200 hover:border-gold-500 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-cream-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                    <Truck className="w-6 h-6 text-gold-600" />
                  </div>
                  <h4 className="text-sm uppercase tracking-widest font-bold text-neutral-800 mb-2">Cash on Delivery</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
                    Pay at your doorstep when products arrive
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold-600 font-bold">
                    Confirm Order <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {isProcessing && (
                <div className="mt-8 flex items-center justify-center gap-3 text-gold-600 text-xs uppercase tracking-widest font-bold animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Your Request...
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 shadow-md border border-neutral-100"
            >
              <h3 className="text-lg font-light text-neutral-800 mb-8 border-b border-neutral-100 pb-4" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                Order Summary
              </h3>

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto no-scrollbar">
                {Object.values(cart).map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-20 bg-neutral-50 flex-shrink-0 overflow-hidden border border-neutral-100 transition-colors group-hover:border-gold-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest italic mb-2">
                        Qty: {item.qty}
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {fmtCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-neutral-100 pt-6">
                <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-widest font-light">
                  <span>Subtotal</span>
                  <span className="text-neutral-800 font-medium">{fmtCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-green-600 uppercase tracking-widest font-light">
                    <span>Coupon Discount</span>
                    <span>-{fmtCurrency(couponDiscount)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-xs text-green-600 uppercase tracking-widest font-light">
                    <span>Loyalty Benefit</span>
                    <span>-{fmtCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-widest font-light">
                  <span>GST (18%)</span>
                  <span className="text-neutral-800 font-medium">{fmtCurrency(gst)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-500 uppercase tracking-widest font-light">
                  <span>Delivery Charge</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${shippingStats.charge === 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'text-neutral-800'}`}>
                    {shippingStats.charge === 0 ? "Complimentary" : fmtCurrency(shippingStats.charge)}
                  </span>
                </div>
                
                <div className="border-t border-neutral-900 pt-6 mt-6">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">Total payable</span>
                    <span className="text-3xl font-light text-neutral-900" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                      {fmtCurrency(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-cream-50 flex items-center gap-3 border border-cream-100">
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                <p className="text-[8px] text-neutral-500 uppercase tracking-[0.2em] font-semibold leading-relaxed">
                  Your transactions are secured with 256-bit encryption for your peace of mind.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
