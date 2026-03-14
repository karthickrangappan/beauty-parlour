import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItemToCart, toggleCartDrawer } = useCart();

  const handleMoveToCart = (product) => {
    addItemToCart({
      ...product,
      quantity: 1,
    });

    removeFromWishlist(product.id);
    toggleCartDrawer();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pb-28">
      <PageHeader
        eyebrow="Your Curation"
        titleStart="My"
        titleItalic="Wishlist"
        description="A curated selection of your favourite elixirs and treatments, saved just for you."
      />
      <div className="max-w-7xl mx-auto px-6">
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 space-y-8"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
              <Heart className="w-10 h-10 text-neutral-400 stroke-[1]" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-neutral-900 text-xl font-light">
                Your wishlist is empty
              </p>
              <p className="text-neutral-500 font-serif italic">
                Save your favorite products for later.
              </p>
            </div>

            <Link
              to="/shop"
              className="px-10 py-4 bg-neutral-900 text-white uppercase tracking-[0.25em] text-xs hover:bg-neutral-800 transition"
            >
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14">

            <AnimatePresence>
              {wishlistItems.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
                >

                  
                  <div className="aspect-[4/5] bg-white overflow-hidden relative mb-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-neutral-200">

                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }}
                      className="w-full h-full object-cover transform duration-[2.5s] ease-out group-hover:scale-110"
                    />

                    
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-500" />
                    </button>

                    
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 border-t border-neutral-200">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-4 text-xs uppercase tracking-[0.25em] text-neutral-800 hover:text-white hover:bg-neutral-900 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Move to Cart
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
                      ${product.price.toFixed(2)}
                    </p>

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

export default Wishlist;