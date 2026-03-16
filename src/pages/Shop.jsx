import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Star,
  X,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  FilterX
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useInfiniteProducts } from "../utils/useInfiniteProducts";

export const collections = [
  { id: "skin-care", name: "Skin Care" },
  { id: "hair-care", name: "Hair Care" },
  { id: "body-care", name: "Body Care" }
];

/* ─────────────────────────────
   Filter Section (Services UI)
───────────────────────────── */

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 pb-5 mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-700 group-hover:text-gold-500 transition-colors">
          {title}
        </span>

        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Shop = () => {
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products: filteredProducts, loading, hasMore, loadMore } =
    useInfiniteProducts({
      collectionId: activeCollection,
      categories: selectedCategories,
      priceRange,
      minRating,
      searchText
    });

  const displayCollections = [{ id: "all", name: "All Collections" }, ...collections];

  const allCategories = [
    "Cleansers",
    "Serums",
    "Moisturizers",
    "Conditioners",
    "Treatments",
    "Exfoliants",
    "Oils",
    "Lotions"
  ];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setMinRating(0);
    setActiveCollection("all");
    setSearchText("");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        if (hasMore && !loading) loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

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
              Curated elixirs designed to restore and perfect your natural
              radiance.
            </p>

            {/* SEARCH */}

            <div className="relative max-w-md w-full bg-white rounded-full shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

              <input
                type="text"
                placeholder="Search elixirs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 pl-12 pr-12 py-3 rounded-full text-sm focus:outline-none focus:border-gold-500"
              />

              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-10 items-start">

          {/* FILTER PANEL */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-56 flex-shrink-0 sticky top-28"
          >
            <div className="bg-white border border-neutral-100 p-6 shadow-sm">

              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gold-500" />
                  Filters
                </span>
              </div>

              {/* COLLECTIONS */}

              <FilterSection title="Collections">
                <div className="flex flex-col gap-1.5">
                  {displayCollections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setActiveCollection(col.id)}
                      className={`text-left text-xs px-3 py-2 rounded-sm font-medium ${
                        activeCollection === col.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-500 hover:bg-cream-100"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* CATEGORIES */}

              <FilterSection title="Categories">
                <div className="flex flex-col gap-2">
                  {allCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-neutral-900"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* PRICE */}

              <FilterSection title="Price Range">
                <div className="space-y-3">
                  <span className="text-xs text-neutral-500">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full accent-neutral-900"
                  />
                </div>
              </FilterSection>

              {/* RATING */}

              <FilterSection title="Minimum Rating">
                <div className="flex gap-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(stars)}
                      className={`flex-1 py-2 rounded border text-xs ${
                        minRating === stars
                          ? "bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-500"
                      }`}
                    >
                      {stars}+ <Star className="w-3 h-3 inline ml-1 fill-current" />
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* CLEAR */}

              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 mt-2"
              >
                <FilterX className="w-3.5 h-3.5" />
                Clear filters
              </button>

            </div>
          </motion.div>

          {/* PRODUCTS GRID */}

          <div className="flex-1">

            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
              </div>
            )}

            {!loading && hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => loadMore()}
                  className="px-8 py-4 bg-neutral-900 text-white uppercase tracking-[0.2em] text-xs hover:bg-gold-500"
                >
                  Load More
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;