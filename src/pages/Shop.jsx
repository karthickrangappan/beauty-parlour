import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { collections } from "../data/products";
import { Filter, Star, X, Search, Loader2 } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";

const productsData = [
  {
    id: 's1',
    collection: 'skin-care',
    category: 'Cleansers',
    name: 'Pearl Essence Cleanser',
    shortDesc: 'Purifying & Illuminating',
    price: 65,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's2',
    collection: 'skin-care',
    category: 'Cleansers',
    name: 'Botanical Foam',
    shortDesc: 'Gentle Daily Wash',
    price: 45,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's3',
    collection: 'skin-care',
    category: 'Serums',
    name: 'Luminous Glow Serum',
    shortDesc: 'Vitamin C & Hyaluronic',
    price: 120,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's4',
    collection: 'skin-care',
    category: 'Serums',
    name: 'Midnight Renewal',
    shortDesc: 'Nighttime Restoration',
    price: 135,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1615397323136-230eb19ad4ef?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's5',
    collection: 'skin-care',
    category: 'Moisturizers',
    name: 'Silk Barrier Cream',
    shortDesc: 'Deep Hydration',
    price: 95,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1556228720-192b9b5f9095?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's6',
    collection: 'skin-care',
    category: 'Moisturizers',
    name: 'Velvety Night Balm',
    shortDesc: 'Rich Nourishing Repair',
    price: 110,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h1',
    collection: 'hair-care',
    category: 'Cleansers',
    name: 'Oud Wood Shampoo',
    shortDesc: 'Fortifying Wash',
    price: 55,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h2',
    collection: 'hair-care',
    category: 'Conditioners',
    name: 'Cashmere Conditioner',
    shortDesc: 'Weightless Moisture',
    price: 60,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h3',
    collection: 'hair-care',
    category: 'Treatments',
    name: 'Argan Scalp Elixir',
    shortDesc: 'Nourish & Restore',
    price: 85,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h4',
    collection: 'hair-care',
    category: 'Treatments',
    name: 'Silk Mask',
    shortDesc: 'Deep Conditioning',
    price: 75,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1527799822340-304cf662a3bb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b1',
    collection: 'body-care',
    category: 'Exfoliants',
    name: 'Crushed Amber Scrub',
    shortDesc: 'Resurfacing Polish',
    price: 75,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b2',
    collection: 'body-care',
    category: 'Oils',
    name: 'Golden Hour Body Oil',
    shortDesc: 'Radiant Finish',
    price: 90,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bb22d9c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b3',
    collection: 'body-care',
    category: 'Lotions',
    name: 'Whipped Shea Butter',
    shortDesc: 'Intense Moisture',
    price: 65,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b4',
    collection: 'body-care',
    category: 'Exfoliants',
    name: 'Rose Sand Polish',
    shortDesc: 'Silky Skin Surface',
    price: 45,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's7',
    collection: 'skin-care',
    category: 'Treatments',
    name: 'Clay Detox Mask',
    shortDesc: 'Deep Pore Cleansing',
    price: 55,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's8',
    collection: 'skin-care',
    category: 'Oils',
    name: 'Vitamin E Lip Oil',
    shortDesc: 'Nutrient Rich Shine',
    price: 28,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1625034714144-8da19084020a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h5',
    collection: 'hair-care',
    category: 'Treatments',
    name: 'Biotin Hair Serum',
    shortDesc: 'Growth & Strength',
    price: 110,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1631730450584-1f651c178904?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b5',
    collection: 'body-care',
    category: 'Oils',
    name: 'Lavender Bath Salts',
    shortDesc: 'Calming Mineral Soak',
    price: 42,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1603517409249-14a938c3529b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b6',
    collection: 'body-care',
    category: 'Treatments',
    name: 'Eucalyptus Shower Mist',
    shortDesc: 'Spa-like Aroma',
    price: 35,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1616683693504-37860237b61e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's9',
    collection: 'skin-care',
    category: 'Moisturizers',
    name: 'Pearl Night Cream',
    shortDesc: 'Overnight Radiance',
    price: 85,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1596755094514-b8d985734631?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's10',
    collection: 'skin-care',
    category: 'Exfoliants',
    name: 'Gold Glow Peel',
    shortDesc: 'Luxury Resurfacing',
    price: 150,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bb22d9c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'h6',
    collection: 'hair-care',
    category: 'Oils',
    name: 'Marula Shine Oil',
    shortDesc: 'Glossy Finish',
    price: 65,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1626015383913-68f4458d924d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'b7',
    collection: 'body-care',
    category: 'Lotions',
    name: 'Velvet Body Milk',
    shortDesc: 'Instant Absorption',
    price: 58,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?q=80&w=800&auto=format&fit=crop',
  },
];

const Shop = () => {
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  /*
  const { products: filteredProducts, loading, hasMore, loadMore } = useInfiniteProducts({
    collectionId: activeCollection,
    categories: selectedCategories,
    priceRange,
    minRating,
    searchText
  });
  */

  const filteredProducts = React.useMemo(() => {
    return productsData.filter(p => {
      if (activeCollection !== 'all' && p.collection !== activeCollection) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [activeCollection, selectedCategories, priceRange, minRating, searchText]);

  const loading = false;
  const hasMore = false;
  const loadMore = () => {};

  const displayCollections = [
    { id: "all", name: "All Collections" },
    ...collections
  ];

  const allCategories = [
    "Cleansers", "Serums", "Moisturizers", "Conditioners",
    "Treatments", "Exfoliants", "Oils", "Lotions"
  ];

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
    setSearchText("");
  };

  const handleCollectionChange = (id) => {
    setActiveCollection(id);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (hasMore && !loading) {
          loadMore();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6">

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
            <p className="text-neutral-500 text-lg font-light leading-relaxed mb-6">
              Curated elixirs designed to restore and perfect your natural radiance.
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search elixirs, treatments..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-white border border-neutral-200 pl-10 pr-4 py-3 rounded-full text-sm focus:outline-none focus:border-gold-500 shadow-sm transition-all text-neutral-800"
              />
            </div>
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

          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 font-semibold">Collections</h3>
              <div className="space-y-3">
                {displayCollections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleCollectionChange(col.id)}
                    className={`block text-sm transition-colors ${activeCollection === col.id ? "text-gold-600 font-medium" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>


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
                    <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? "text-neutral-900 font-medium" : "text-neutral-500 group-hover:text-neutral-900"
                      }`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>


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


            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6 font-semibold">Minimum Rating</h3>
              <div className="flex gap-2">
                {[4, 3, 2, 1].map(stars => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`flex-1 py-2 rounded border text-xs transition-all ${minRating === stars ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
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


          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 mb-12">
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </AnimatePresence>
              </div>
            ) : !loading && (
              <div className="py-32 text-center bg-white rounded-3xl border border-dashed border-neutral-200">
                <p className="text-neutral-400 font-light italic">No products match your current filters.</p>
                <button onClick={clearFilters} className="mt-4 text-xs text-gold-500 underline uppercase tracking-widest">Clear all</button>
              </div>
            )}


            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
              </div>
            )}

            {!loading && hasMore && filteredProducts.length > 0 && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => loadMore()}
                  className="px-8 py-4 bg-neutral-900 text-white uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-colors duration-300"
                >
                  Load More Secrets
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


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
                        className={`px-4 py-2 rounded-full text-xs transition-all ${activeCollection === col.id ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-500"
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