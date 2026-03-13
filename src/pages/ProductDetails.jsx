import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronRight } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Product not found</h2>
          <Link to="/shop" className="text-gold-500 underline uppercase tracking-widest text-xs">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItemToCart({
      ...product,
      quantity: quantity
    });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      
      <div className="bg-cream-50 py-4 mt-25">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-neutral-900 transition font-medium">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">


          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[2/2] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 shadow-sm group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>


          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 shadow-xl shadow-gold-300/5 border border-gold-300/10 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blush-50/50 blur-3xl rounded-full pointer-events-none" />
            
            <div className="space-y-1 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-gold-50 text-gold-600 text-[10px] uppercase tracking-widest font-bold rounded-full border border-gold-200">
                    {product.collection.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                    <span className="text-sm font-medium text-neutral-900 mt-0.5">{product.rating}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-light text-neutral-900 leading-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                  {product.name}
                </h1>

                <p className="text-2xl font-light text-neutral-900">${product.price.toFixed(2)}</p>

                <p className="text-neutral-500 leading-relaxed text-lg max-w-xl">
                  Elevate your daily ritual with the {product.name}. Carefully formulated to provide {product.shortDesc.toLowerCase()} for a truly luminous finish.
                </p>
              </div>


              <div className="space-y-6 pt-3 border-t border-gold-300/10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition rounded-full"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition rounded-full"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                    }}
                    className={`p-4 rounded-full border transition-all ${isInWishlist(product.id)
                        ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-5 bg-neutral-900 text-white rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold-500 transition-all duration-300 shadow-xl shadow-gold-300/10"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Luxury Cart
                </button>
              </div>


              <div className="grid grid-cols-3 gap-4 py-1 border-y border-gold-300/10 mt-12">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-cream-100 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-neutral-600" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">100% Pure</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-cream-100 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-neutral-600" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-cream-100 rounded-2xl">
                    <RefreshCw className="w-5 h-5 text-neutral-600" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Easy Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        <div className="mt-8">
          <div className="flex gap-12 border-b border-neutral-100 mb-10">
            {["description", "how to use", "ingredients"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === tab ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl text-neutral-500 leading-relaxed"
              >
                {activeTab === "description" && (
                  <p>Designed for the discerning individual, our {product.name} delivers unparalleled results by utilizing high-performance active ingredients. It works deeply into the surface of your skin to provide {product.shortDesc.toLowerCase()} while maintaining its natural moisture barrier.</p>
                )}
                {activeTab === "how to use" && (
                  <p>Apply a small amount to clean skin twice daily. Massage gently in upward circular motions until fully absorbed. For best results, follow with our recommended serum pairing.</p>
                )}
                {activeTab === "ingredients" && (
                  <p>Aqua (Water), Glycerin, Squalane, Niacinamide, Butyrospermum Parkii (Shea) Butter, Hyaluronic Acid, Tocopherol (Vitamin E), Botanical Extracts, Organic Essential Oils, Phenoxyethanol.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>


        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-light mb-12" style={{ fontFamily: "ui-serif, Georgia, serif" }}>You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
