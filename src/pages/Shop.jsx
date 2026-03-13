import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { collections, products } from "../data/products";
import { Heart } from "lucide-react";

const Shop = () => {
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addItemToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    navigate("/cart");
  };

  // Prepend "All" to collections for the UI
  const displayCollections = [
    { id: "all", name: "All" },
    ...collections
  ];

  // Get products for the current collection
  const currentCollectionProducts = activeCollection === "all" 
    ? products 
    : products.filter((p) => p.collection === activeCollection);

  // Extract unique categories for the current collection
  const availableCategories = [
    "All",
    ...new Set(currentCollectionProducts.map((p) => p.category)),
  ];

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "All"
      ? currentCollectionProducts
      : currentCollectionProducts.filter((p) => p.category === activeCategory);

  // Reset category when collection changes
  const handleCollectionChange = (collectionId) => {
    setActiveCollection(collectionId);
    setActiveCategory("All");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pt-32 pb-28">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1
            className="text-5xl md:text-6xl text-neutral-900 font-light mb-6 tracking-wide"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            The Collection
          </h1>

          <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Curated elixirs and essences designed to restore, illuminate, and
            perfect your natural radiance.
          </p>
        </motion.div>

        {/* Collection Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center flex-wrap gap-8 md:gap-16 mt-16 border-b border-neutral-200"
        >
          {displayCollections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleCollectionChange(col.id)}
              className={`pb-4 text-sm uppercase tracking-[0.25em] transition-all duration-300 relative hover:scale-105 ${
                activeCollection === col.id
                  ? "text-neutral-900 font-medium"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              {col.name}

              {activeCollection === col.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Category Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-10 px-4"
        >
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 rounded-full border ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                  : "bg-white/50 text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCollection}-${activeCategory}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: idx * 0.05,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Product Card */}
                  <div className="aspect-[4/5] bg-white overflow-hidden relative mb-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-neutral-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform duration-[2.5s] ease-out group-hover:scale-110"
                    />

                    {/* Dark Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-500" />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isInWishlist(product.id)
                          ? removeFromWishlist(product.id)
                          : addToWishlist(product);
                      }}
                      className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(product.id)
                            ? "fill-red-400 text-red-400"
                            : "text-neutral-500"
                        }`}
                      />
                    </button>

                    {/* Add to Cart */}
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 border-t border-neutral-200">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-4 text-xs uppercase tracking-[0.25em] text-neutral-800 hover:text-white hover:bg-neutral-900 transition-all duration-300 font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center space-y-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gold-500 mb-1">{product.collection.replace('-', ' ')}</span>
                        <h3 className="text-neutral-900 uppercase tracking-[0.25em] text-sm font-medium">
                        {product.name}
                        </h3>
                    </div>

                    <p className="text-neutral-500 font-serif italic text-sm">
                      {product.shortDesc}
                    </p>

                    <p className="text-neutral-900 text-base font-medium mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-400 font-light italic">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shop;