import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { loadRazorpay } from '../../utils/loadRazorpay';

const CartDrawer = () => {
  const { isDrawerOpen, items, subtotal, totalAmount, toggleCartDrawer, removeItemFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // 1. Load Razorpay script dynamically
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    // 2. Options for Razorpay (In a real app, order_id is generated securely on the backend)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_MockKeyForDevelopment", // Enter the Key ID generated from the Dashboard
      amount: Math.round(totalAmount * 100), // Amount is in currency subunits (paise for INR). Ensure it's an integer.
      currency: "usd",
      name: "Lumière Spa & Salon",
      description: "Luxury Collection Checkout",
      image: "https://your-logo-url.com/logo.png",
      handler: function (response) {
        // This fires after a successful payment
        console.log("Payment Successful!", response);
        // Dispatch success actions
        clearCart();
        toggleCartDrawer();
        alert("Payment Successful! Your order has been placed.");
      },
      prefill: {
        name: user?.displayName || "Guest User",
        email: user?.email || "guest@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#D4AF37", // Matching our Gold-500 luxury accent
      },
    };

    // 3. Mount and open the checkout modal
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      console.error("Payment Failed!", response.error);
      alert("Payment dropped or failed. Please try again.");
    });
    
    paymentObject.open();
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCartDrawer}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold-300/30 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-neutral-800" />
                <h2 className="text-xl text-neutral-800 font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                  Your Collection
                </h2>
              </div>
              <button 
                onClick={toggleCartDrawer}
                className="p-2 text-neutral-500 hover:text-gold-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <ShoppingBag className="w-12 h-12 text-gold-300 stroke-[1]" />
                  <p className="text-neutral-500 font-light text-lg">Your curated collection is empty.</p>
                  <button 
                    onClick={toggleCartDrawer}
                    className="text-xs uppercase tracking-widest text-neutral-800 border-b border-gold-300 pb-1 hover:border-gold-500 transition-colors"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-32 bg-blush-50 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm uppercase tracking-wider text-neutral-800">{item.name}</h3>
                          <button 
                            onClick={() => removeItemFromCart(item.id)}
                            className="text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-neutral-500 text-sm font-serif italic">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-neutral-300 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 px-2 text-neutral-500 hover:text-gold-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center text-neutral-800 font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-neutral-500 hover:text-gold-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-gold-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gold-300/30 bg-white space-y-4">
                <div className="flex items-center justify-between text-neutral-800">
                  <span className="text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-light" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                    ${subtotal?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-light">
                  Taxes and shipping calculated at checkout.
                </p>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-neutral-900 hover:bg-gold-500 text-white py-4 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
