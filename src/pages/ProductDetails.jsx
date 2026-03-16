import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fmtCurrency } from "../constants/config";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronRight, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductReviews from "../components/ProductReviews";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = { id: docSnap.id, ...docSnap.data() };
        setProduct(productData);
        const q = query(
          collection(db, "products"),
          where("category", "==", productData.category),
          where("isActive", "==", true),
          limit(5)
        );
        const snap = await getDocs(q);
        const related = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.id !== id);
        setRelatedProducts(related.slice(0, 4));
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("Error fetching product", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

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

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    addItemToCart({
      ...product,
      quantity: quantity,
    });
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-cream-50 py-4 mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10 flex flex-wrap items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition font-medium">Home</Link>
          <ChevronRight className="w-2.5 h-2.5 md:w-3 h-3" />
          <Link to="/shop" className="hover:text-neutral-900 transition font-medium">Shop</Link>
          <ChevronRight className="w-2.5 h-2.5 md:w-3 h-3" />
          <span className="text-neutral-900 font-semibold truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="aspect-square bg-neutral-50 rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-100 shadow-sm group">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </motion.div>

          <div className="space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 md:space-y-4"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <span className="px-2.5 py-1 bg-gold-50 text-gold-600 text-[9px] md:text-[10px] uppercase tracking-widest font-bold rounded-full border border-gold-200">
                  {product.collection?.replace('-', ' ') || 'Collection'}
                </span>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 md:w-4 h-4 fill-gold-500 text-gold-500" />
                    <span className="text-xs md:text-sm font-medium text-neutral-900 mt-0.5">{product.rating}</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 leading-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                {product.name}
              </h1>

              <p className="text-xl md:text-2xl font-light text-neutral-900">{fmtCurrency(product.price || 0)}</p>

              <p className="text-neutral-500 leading-relaxed text-sm md:text-lg max-w-xl">
                Elevate your daily ritual with the {product.name}. Carefully formulated to provide {(product.shortDesc || 'exceptional results').toLowerCase()} for a truly luminous finish.
              </p>

              {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
                <p className="text-[10px] md:text-xs text-orange-600 uppercase tracking-widest font-bold">Only {product.stock} left in stock</p>
              )}
              {product.stock === 0 && (
                <p className="text-[10px] md:text-xs text-red-600 uppercase tracking-widest font-bold">Out of stock</p>
              )}
            </motion.div>

            <div className="space-y-6 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 p-0.5 md:p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition rounded-full"
                  >
                    -
                  </button>
                  <span className="w-8 md:w-10 text-center text-xs md:text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(product.stock ? Math.min(product.stock, quantity + 1) : quantity + 1)}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition rounded-full"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleWishlist}
                  className={`p-3 md:p-4 rounded-full border transition-all ${isInWishlist(product.id)
                      ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                >
                  <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 md:py-5 bg-neutral-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-neutral-800 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Luxury Cart"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 py-6 md:py-8 border-y border-neutral-100 mt-8 md:mt-12">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2.5 md:p-3 bg-cream-100 rounded-xl md:rounded-2xl">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" />
                </div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-neutral-500 font-bold leading-tight">100% Pure</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2.5 md:p-3 bg-cream-100 rounded-xl md:rounded-2xl">
                  <Truck className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" />
                </div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-neutral-500 font-bold leading-tight">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2.5 md:p-3 bg-cream-100 rounded-xl md:rounded-2xl">
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" />
                </div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-neutral-500 font-bold leading-tight">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <div className="flex gap-6 md:gap-12 border-b border-neutral-100 mb-8 md:mb-10 overflow-x-auto no-scrollbar">
            {["description", "how to use", "ingredients"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? "text-neutral-900" : "text-neutral-300 hover:text-neutral-500"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[80px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl text-neutral-500 leading-relaxed text-sm md:text-base"
              >
                {activeTab === "description" && (
                  <p>Designed for the discerning individual, our {product.name} delivers unparalleled results by utilizing high-performance active ingredients. It works deeply into the surface of your skin to provide {(product.shortDesc || 'exceptional results').toLowerCase()} while maintaining its natural moisture barrier.</p>
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

        <ProductReviews productId={product.id} />

        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-32">
            <h2 className="text-2xl md:text-3xl font-light mb-8 md:mb-12" style={{ fontFamily: "ui-serif, Georgia, serif" }}>You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
