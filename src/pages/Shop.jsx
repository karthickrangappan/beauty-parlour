import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { collections, products } from "../data/products";
import { Filter, Star, X } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

const Shop = () => {
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const displayCollections = [
    { id: "all", name: "All Collections" },
    ...collections
  ];

  const allCategories = [
    "Cleansers", "Serums", "Moisturizers", "Conditioners", 
    "Treatments", "Exfoliants", "Oils", "Lotions"
  ];

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesCollection = activeCollection === "all" || product.collection === activeCollection;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= minRating;
    
    return matchesCollection && matchesCategory && matchesPrice && matchesRating;
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    setActiveCollection("all");
  };

  const handleCollectionChange = (id) => {
    setActiveCollection(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-6xl text-neutral-900 font-light mb-6 tracking-wide"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              The Collection
            </motion.h1>
            <p className="text-neutral-500 text-lg font-light leading-relaxed">
              Curated elixirs designed to restore and perfect your natural radiance.
            </p>
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-8 py-4 bg-white border border-neutral-200 rounded-full shadow-sm hover:shadow-md transition-all lg:hidden"
          >
            <Filter className="w-4 h-4 text-gold-500" />
            <span className="text-xs uppercase tracking-widest font-medium">Filters</span>
          </button>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Filter Panel (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
            {/* Collections */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 font-semibold">Collections</h3>
              <div className="space-y-3">
                {displayCollections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleCollectionChange(col.id)}
                    className={`block text-sm transition-colors ${
                      activeCollection === col.id ? "text-gold-600 font-medium" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 font-semibold">Categories</h3>
              <div className="space-y-3">
                {allCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-neutral-900 border-neutral-300 rounded"
                    />
                    <span className={`text-sm transition-colors ${
                      selectedCategories.includes(cat) ? "text-neutral-900 font-medium" : "text-neutral-500 group-hover:text-neutral-900"
                    }`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">Price Range</h3>
                <span className="text-[10px] text-neutral-400">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-neutral-900 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 font-semibold">Minimum Rating</h3>
              <div className="flex gap-2">
                {[4, 3, 2, 1].map(stars => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`flex-1 py-2 rounded border text-xs transition-all ${
                      minRating === stars ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {stars}+ <Star className="w-2.5 h-2.5 inline-block ml-1 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-4 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-500 border-t border-neutral-100 pt-6 transition-colors"
            >
              Reset All Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-neutral-200">
                 <p className="text-neutral-400 font-light italic">No products match your current filters.</p>
                 <button onClick={clearFilters} className="mt-4 text-xs text-gold-500 underline uppercase tracking-widest">Clear all</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[70] shadow-2xl p-8 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-light font-serif">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-400 mb-6 font-semibold">Collections</h3>
                  <div className="flex flex-wrap gap-3">
                    {displayCollections.map(col => (
                      <button
                        key={col.id}
                        onClick={() => handleCollectionChange(col.id)}
                        className={`px-4 py-2 rounded-full text-xs transition-all ${
                          activeCollection === col.id ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-500"
                        }`}
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-400 mb-6 font-semibold">Categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {allCategories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 accent-neutral-900"
                        />
                        <span className="text-sm text-neutral-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating & Price */}
                <div className="pt-8 space-y-8 border-t border-neutral-100">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Price Limit</span>
                      <span className="text-sm font-medium">${priceRange[1]}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-neutral-900"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-5 bg-neutral-900 text-white uppercase tracking-widest text-xs font-bold rounded-xl"
                >
                  Apply & See Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;