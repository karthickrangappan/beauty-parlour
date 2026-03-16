import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Eye, Heart, Sparkles, ShieldCheck, IndianRupee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { fmtCurrency } from "../constants/config";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addItemToCart, toggleCartDrawer } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    addItemToCart({
      ...product,
      quantity: 1,
    });
    onClose();
    toggleCartDrawer();
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] rounded-3xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all shadow-lg hover:rotate-90 duration-500"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full md:w-1/2 h-72 md:h-auto relative overflow-hidden bg-neutral-50 p-8 flex items-center justify-center">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=Product&background=D4AF37&color=fff";
                }}
              />
              <div className="absolute top-8 left-8">
                  <span className="px-4 py-1.5 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-black rounded-full shadow-lg">
                      New Arrival
                  </span>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
              <div className="mb-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gold-600 text-[10px] uppercase tracking-[0.3em] font-black border-l-2 border-gold-500 pl-3">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-gold-500">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Lumière Top Tier</span>
                  </div>
                </div>

                <h2 
                  className="text-3xl md:text-5xl font-light text-neutral-900 mb-6 leading-tight"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center text-neutral-900">
                    <span className="text-3xl font-bold tracking-tighter">{fmtCurrency(product.price || 0)}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-neutral-100" />
                  <div className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold">
                      Inc. all taxes
                  </div>
                </div>

                <p className="text-neutral-500 leading-relaxed text-sm md:text-base font-light mb-10 italic">
                    {product.shortDesc || product.description || "A masterfully crafted elixir designed to bring out your skin's natural luminosity using laboratory-refined botanical extracts."}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-12">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center text-gold-600">
                           <ShieldCheck className="w-4 h-4" />
                       </div>
                       <span className="text-[9px] uppercase tracking-widest font-black text-neutral-400">Lab Tested</span>
                   </div>
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center text-gold-600">
                           <Sparkles className="w-4 h-4" />
                       </div>
                       <span className="text-[9px] uppercase tracking-widest font-black text-neutral-400">Pure Organic</span>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-5 bg-neutral-900 text-white rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-[10px] font-black hover:bg-gold-600 transition-all duration-500 shadow-2xl active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Sanctuary
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`w-16 rounded-2xl border flex items-center justify-center transition-all duration-500 active:scale-95 ${
                    isInWishlist(product.id) 
                      ? "bg-rose-50 border-rose-100 text-rose-500" 
                      : "bg-white border-neutral-100 text-neutral-400 hover:border-gold-300 hover:text-gold-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>
              
              <Link 
                to={`/product/${product.id}`}
                onClick={onClose}
                className="mt-6 text-center text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-gold-500 transition-colors flex items-center justify-center gap-2 group"
              >
                  Detailed Overview <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
