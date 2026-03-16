import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fmtCurrency } from "../constants/config";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product, index }) => {
  const { addItemToCart, toggleCartDrawer } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    addItemToCart({
      ...product,
      quantity: 1,
    });

    toggleCartDrawer();
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
    >
      <Link to={`/product/${product.id}`}>


        <div className="aspect-[4/5] bg-white overflow-hidden relative mb-6 rounded-xl shadow-xl shadow-gold-300/5 hover:shadow-2xl hover:shadow-gold-300/10 transition-all duration-500 border border-gold-300/10 group-hover:border-gold-300/30">


          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }}
            className="w-full h-full object-cover transform duration-[2.5s] ease-out group-hover:scale-110"
          />


          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition opacity-0 group-hover:opacity-100 duration-300"
            title="Quick View"
          >
            <Eye className="w-4 h-4 text-neutral-500" />
          </button>


          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition opacity-0 group-hover:opacity-100 duration-300"
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist(product.id)
                  ? "fill-red-500 text-red-500"
                  : "text-neutral-500"
              }`}
            />
          </button>


          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 border-t border-neutral-200">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 text-xs uppercase tracking-[0.25em] text-neutral-800 hover:text-white hover:bg-neutral-900 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3 h-3" />
              Add to Cart
            </button>
          </div>

        </div>


        <div className="text-center space-y-2">

          <h3 className="text-neutral-900 uppercase tracking-[0.25em] text-sm font-medium">
            {product.name}
          </h3>

          <p className="text-neutral-500 font-serif italic text-sm">
            {product.category}
          </p>

          <p className="text-neutral-900 text-base font-medium mt-2">
            {fmtCurrency(product.price || 0)}
          </p>

        </div>

      </Link>
    </motion.div>
  );
};

export default ProductCard;
