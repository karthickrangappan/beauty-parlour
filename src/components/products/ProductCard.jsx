import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, index }) => {
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart({
      ...product,
      quantity: 1,
    });
    navigate("/cart");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] bg-white overflow-hidden relative mb-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Wishlist Heart */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-30 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-red-400 text-red-400" : "text-neutral-400"}`} />
          </button>

          {/* Add to Cart Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-white text-neutral-900 text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-neutral-900 hover:text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        </div>

        <div className="text-center space-y-2 px-2">
          {/* Collection Label (Small) */}
          <div className="flex items-center justify-center gap-1 mb-1">
             <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest">{product.collection.replace('-', ' ')}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-gold-500 text-gold-500" : "text-neutral-200 fill-neutral-200"}`} 
              />
            ))}
            <span className="text-[10px] text-neutral-400 ml-1 font-medium">{product.rating}</span>
          </div>

          <h3 className="text-neutral-900 uppercase tracking-[0.2em] text-sm font-medium group-hover:text-gold-600 transition-colors leading-tight min-h-[40px] flex items-center justify-center">
            {product.name}
          </h3>
          
          <p className="text-neutral-400 font-serif italic text-xs">{product.category}</p>
          
          <div className="pt-2">
            <p className="text-neutral-900 text-lg font-light">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
