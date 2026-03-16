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
  FilterX,
  RefreshCw
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useInfiniteProducts } from "../utils/useInfiniteProducts";
import PageHeader from "../components/PageHeader";

export const collections = [
  { id: "skin-care", name: "Skin Care" },
  { id: "hair-care", name: "Hair Care" },
  { id: "body-care", name: "Body Care" }
];


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

  const activeFilterCount =
    (activeCollection !== "all" ? 1 : 0) +
    selectedCategories.length +
    (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchText ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pb-28">
      <PageHeader
        eyebrow="The Sanctuary Collection"
        titleStart="The"
        titleItalic="Collection"
        description="Curated elixirs and luxury treatments designed to restore and perfect your natural radiance."
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-10 items-start">

          {/* FILTER PANEL */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-56 flex-shrink-0 sticky top-28"
          >
            <div className="bg-white border border-neutral-100 p-6 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">

              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gold-500" />
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-red-500 transition-colors"
                    title="Clear Filters"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* SEARCH */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search elixirs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-cream-50 border border-neutral-100 py-2.5 pl-9 pr-8 text-xs focus:outline-none focus:border-gold-400 transition-colors placeholder:text-neutral-300 rounded-sm italic font-serif"
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-900 transition-colors" />
                  </button>
                )}
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
                <div className="flex flex-col gap-1.5">
                  {[0, 4, 3, 2, 1].map((stars) => {
                    const active = minRating === stars;
                    return (
                      <button
                        key={stars}
                        onClick={() => setMinRating(stars)}
                        className={`text-left text-xs px-3 py-2 rounded-sm font-medium flex items-center gap-2 transition-colors ${
                          active
                            ? "bg-gold-500/10 text-gold-700"
                            : "text-neutral-500 hover:bg-cream-100"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full border flex-shrink-0 transition-colors ${
                            active ? "bg-gold-500 border-gold-500" : "border-neutral-300"
                          }`}
                        />
                        {stars === 0 ? (
                          "Any Rating"
                        ) : (
                          <span className="flex items-center gap-1">
                            {stars} Stars & Up <Star className="w-3 h-3 fill-current text-gold-500 ml-0.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

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