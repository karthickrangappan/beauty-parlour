import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fmtCurrency, APP_NAME } from "../constants/config";
import Icon from "../components/Icon";
import { getShippingStats } from "../utils/logicUtils";

import { useToaster } from "../context/ToastContext";

export default function Checkout() {
  const { cart, cartTotal, placeOrder } = useCart();
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
      const stats = getShippingStats(cartTotal, zip);
      setShippingStats(stats);
    }
  };

  const finalTotal = cartTotal + shippingStats.charge;

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
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
      amount: cartTotal * 100,
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
          toast(
            "Payment confirmed but order failed. Contact support.",
            "error",
          );
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#F59E0B" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
    setIsProcessing(false);
  };

  if (!cart || Object.keys(cart).length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 bg-cream-50 py-40 text-center animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-[48px] flex items-center justify-center mx-auto mb-10 text-6xl shadow-inner animate-bounce opacity-30">
          🛒
        </div>
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
          Pipeline <span className="text-gray-600">Empty</span>
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic mb-12 max-w-sm mx-auto opacity-60">
          Neural detection indicates zero assets staged for procurement. Return
          to shop node.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-amber-400 text-amber-950 px-12 py-5 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:scale-110 active:scale-95 transition-all shadow-xl shadow-amber-400/20"
        >
          Initialize Procurement
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-400 selection:text-amber-950">
      <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-16 group">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[28px] bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all shadow-xl group-hover:border-amber-400/20"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-none uppercase tracking-tighter">
            Checkout <span className="text-amber-400">Protocol</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-2 md:mt-3 italic leading-none">
            Finalizing Acquisition Manifest
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Shipping Form */}
          <div className="bg-white/5 p-6 md:p-12 rounded-[40px] md:rounded-[56px] border border-white/5 shadow-2xl backdrop-blur-3xl hover:border-white/10 transition-colors animate-in slide-in-from-bottom-12 duration-700">
            <h2 className="text-xl md:text-2xl font-black text-white mb-8 md:mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <span className="w-10 h-10 md:w-12 md:h-12 rounded-2xl md:rounded-[24px] bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20 translate-y-[-2px]">
                01
              </span>
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  className="w-full bg-white/5 border-2 border-transparent rounded-[24px] px-8 py-5 text-white placeholder:text-gray-700 focus:bg-white/10 focus:border-amber-400 focus:ring-8 focus:ring-amber-400/10 transition-all outline-none font-bold uppercase tracking-widest text-xs"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="EMAIL@PROTOCOL.COM"
                  className="w-full bg-white/[0.02] border-2 border-transparent rounded-[24px] px-8 py-5 text-gray-600 cursor-not-allowed outline-none font-bold uppercase tracking-widest text-xs border border-white/5"
                  value={form.email}
                  disabled
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white/5 border-2 border-transparent rounded-[24px] px-8 py-5 text-white placeholder:text-gray-700 focus:bg-white/10 focus:border-amber-400 focus:ring-8 focus:ring-amber-400/10 transition-all outline-none font-bold uppercase tracking-widest text-xs"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  Address
                </label>
                <textarea
                  placeholder="GEO-SECTOR ID, STREET, HUB..."
                  rows="3"
                  className="w-full bg-white/5 border-2 border-transparent rounded-[32px] px-8 py-6 text-white placeholder:text-gray-700 focus:bg-white/10 focus:border-amber-400 focus:ring-8 focus:ring-amber-400/10 transition-all outline-none resize-none font-bold uppercase tracking-widest text-xs leading-relaxed"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  City
                </label>
                <input
                  type="text"
                  placeholder="MUMBAI"
                  className="w-full bg-white/5 border-2 border-transparent rounded-[24px] px-8 py-5 text-white placeholder:text-gray-700 focus:bg-white/10 focus:border-amber-400 focus:ring-8 focus:ring-amber-400/10 transition-all outline-none font-bold uppercase tracking-widest text-xs"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4 italic">
                  Zip Code
                </label>
                <input
                  type="text"
                  placeholder="400001"
                  className="w-full bg-white/5 border-2 border-transparent rounded-[24px] px-8 py-5 text-white placeholder:text-gray-700 focus:bg-white/10 focus:border-amber-400 focus:ring-8 focus:ring-amber-400/10 transition-all outline-none font-bold uppercase tracking-widest text-xs"
                  value={form.zip}
                  onChange={(e) => handleZipChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/5 p-12 rounded-[56px] border border-white/5 shadow-2xl backdrop-blur-3xl hover:border-white/10 transition-colors animate-in slide-in-from-bottom-12 duration-1000">
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <span className="w-12 h-12 rounded-[24px] bg-red-400 text-red-950 flex items-center justify-center font-black shadow-lg shadow-red-400/20 translate-y-[-2px]">
                02
              </span>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                disabled={isProcessing}
                onClick={handleRazorpay}
                className="flex flex-col items-center justify-center p-10 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] hover:border-amber-400 hover:bg-amber-400/5 group transition-all duration-500 active:scale-95"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl shadow- inner flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all">
                  💳
                </div>
                <span className="font-black text-white uppercase tracking-tighter text-xl mb-2">
                  Payment
                </span>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-80">
                  Razorpay / Cards / UPI Instanced
                </span>
                <div className="mt-6 w-0 group-hover:w-full h-1 bg-amber-400 rounded-full transition-all duration-700" />
              </button>
              <button
                disabled={isProcessing}
                onClick={handleCOD}
                className="flex flex-col items-center justify-center p-10 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] hover:border-amber-400 hover:bg-amber-400/5 group transition-all duration-500 active:scale-95"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl shadow-inner flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-all">
                  🚚
                </div>
                <span className="font-black text-white uppercase tracking-tighter text-xl mb-2">
                  Physical COD
                </span>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-80">
                  Transfer Assets on Reception
                </span>
                <div className="mt-6 w-0 group-hover:w-full h-1 bg-amber-400 rounded-full transition-all duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-white/5 p-10 rounded-[56px] sticky top-24 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden group/card">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 blur-[100px] -mr-16 -mt-16 rounded-full group-hover/card:bg-amber-400/10 transition-colors" />

            <h2 className="text-3xl font-black text-white mb-10 relative z-10 uppercase tracking-tighter">
              Asset <span className="text-amber-400">Ledger</span>
            </h2>
            <div className="space-y-8 mb-12 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar relative z-10 no-scrollbar">
              {Object.values(cart).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-6 group/item"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/5 rounded-[28px] overflow-hidden flex-shrink-0 border border-white/5 group-hover/item:border-amber-400/20 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale-[30%] group-hover/item:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div>
                      <p className="text-md font-black text-white leading-none mb-2 uppercase tracking-tighter group-hover/item:text-amber-400 transition-colors">
                        {item.name}
                      </p>
                      <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        Node x{item.qty}
                      </div>
                    </div>
                  </div>
                  <p className="text-md font-black text-white tracking-tighter">
                    {fmtCurrency(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-10 space-y-6 relative z-10">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">
                  Sub-Manifest Total
                </span>
                <span className="text-md font-black text-white">
                  {fmtCurrency(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">
                  Logistic Transfer
                </span>
                <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-lg ${shippingStats.charge === 0 ? 'text-green-500 bg-green-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                  {shippingStats.charge === 0 ? "VOID COST" : `₹${shippingStats.charge}`}
                </span>
              </div>

              <div className="pt-10 flex flex-col gap-2">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.5em] text-center mb-1 animate-pulse">
                  Aggregate Sum
                </p>
                <div className="flex justify-center bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-inner">
                  <span className="text-6xl font-black text-white tracking-tighter flex items-start gap-2">
                    <span className="text-xl text-amber-500 pt-2 leading-none uppercase">
                      ₹
                    </span>
                    {finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/[0.02] rounded-[28px] border border-white/5 text-center relative z-10 flex items-center justify-center gap-4 group cursor-help">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <p className="text-[8px] text-gray-600 uppercase tracking-[0.5em] font-black group-hover:text-green-500 transition-colors">
                SECURE END-TO-END QUANTUM ENCRYPTION
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
