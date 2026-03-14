import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  Search,
  Loader2,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  FilterX,
  Star,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useInfiniteProducts } from "../utils/useInfiniteProducts";
import PageHeader from "../components/PageHeader";

/* ─────────────────────────────────────────────
   Collections (exported for other pages)
───────────────────────────────────────────── */
export const collections = [
  { id: "skin-care", name: "Skin Care" },
  { id: "hair-care", name: "Hair Care" },
  { id: "body-care", name: "Body Care" },
];

const ALL_CATEGORIES = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Conditioners",
  "Treatments",
  "Exfoliants",
  "Oils",
  "Lotions",
];

const DISPLAY_COLLECTIONS = [{ id: "all", name: "All Collections" }, ...collections];

const PRICE_OPTIONS = [
  { label: "Any Price", value: null },
  { label: "Under ₹500", value: [0, 500] },
  { label: "₹500 – ₹1,000", value: [500, 1000] },
  { label: "₹1,000 – ₹2,000", value: [1000, 2000] },
  { label: "₹2,000+", value: [2000, Infinity] },
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: 0 },
  { label: "4★ & above", value: 4 },
  { label: "3★ & above", value: 3 },
  { label: "2★ & above", value: 2 },
];

/* ─────────────────────────────────────────────
   FilterSection — collapsible, module-level
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   FilterPanel — module-level (MUST stay outside
   Shop so React never remounts it on re-render)
───────────────────────────────────────────── */
const FilterPanel = ({
  searchText,
  setSearchText,
  activeCollection,
  setActiveCollection,
  selectedCategories,
  toggleCategory,
  priceOption,
  setPriceOption,
  minRating,
  setMinRating,
  activeFilterCount,
  clearFilters,
}) => (
  <aside className="w-full">
    {/* Search */}
    <div className="relative mb-6">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
      <input
        type="text"
        placeholder="Search products…"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full bg-cream-50 border border-neutral-100 py-2.5 pl-10 pr-9 text-xs focus:outline-none focus:border-gold-400 transition-colors placeholder:text-neutral-300 rounded-sm italic font-serif"
      />
      {searchText && (
        <button
          onClick={() => setSearchText("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2"
        >
          <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700 transition-colors" />
        </button>
      )}
    </div>

    {/* Collections */}
    <FilterSection title="Collection">
      <div className="flex flex-col gap-1.5">
        {DISPLAY_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveCollection(col.id)}
            className={`text-left text-xs px-3 py-2 rounded-sm transition-all duration-200 font-medium tracking-wide ${
              activeCollection === col.id
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:bg-cream-100 hover:text-neutral-800"
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>
    </FilterSection>

    {/* Categories */}
    <FilterSection title="Category">
      <div className="flex flex-col gap-1.5">
        {ALL_CATEGORIES.map((cat) => {
          const checked = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`text-left text-xs px-3 py-2 rounded-sm transition-all duration-200 font-medium tracking-wide flex items-center gap-2 ${
                checked
                  ? "bg-gold-500/10 text-gold-700 font-semibold"
                  : "text-neutral-500 hover:bg-cream-100 hover:text-neutral-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-sm border flex-shrink-0 transition-colors ${
                  checked ? "bg-gold-500 border-gold-500" : "border-neutral-300"
                }`}
              />
              {cat}
            </button>
          );
        })}
      </div>
    </FilterSection>

    {/* Price Range */}
    <FilterSection title="Price Range">
      <div className="flex flex-col gap-1.5">
        {PRICE_OPTIONS.map((opt) => {
          const active =
            (!priceOption && !opt.value) ||
            (priceOption &&
              opt.value &&
              priceOption[0] === opt.value[0] &&
              priceOption[1] === opt.value[1]);
          return (
            <button
              key={opt.label}
              onClick={() => setPriceOption(opt.value)}
              className={`text-left text-xs px-3 py-2 rounded-sm transition-all duration-200 font-medium tracking-wide flex items-center gap-2 ${
                active
                  ? "bg-gold-500/10 text-gold-700 font-semibold"
                  : "text-neutral-500 hover:bg-cream-100 hover:text-neutral-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border flex-shrink-0 ${
                  active ? "bg-gold-500 border-gold-500" : "border-neutral-300"
                }`}
              />
              {opt.label}
            </button>
          );
        })}
      </div>
    </FilterSection>

    {/* Minimum Rating */}
    <FilterSection title="Minimum Rating">
      <div className="flex flex-col gap-1.5">
        {RATING_OPTIONS.map((opt) => {
          const active = minRating === opt.value;
          return (
            <button
              key={opt.label}
              onClick={() => setMinRating(opt.value)}
              className={`text-left text-xs px-3 py-2 rounded-sm transition-all duration-200 font-medium tracking-wide flex items-center gap-2 ${
                active
                  ? "bg-gold-500/10 text-gold-700 font-semibold"
                  : "text-neutral-500 hover:bg-cream-100 hover:text-neutral-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border flex-shrink-0 ${
                  active ? "bg-gold-500 border-gold-500" : "border-neutral-300"
                }`}
              />
              <span className="flex items-center gap-1">
                {opt.label}
                {opt.value > 0 && (
                  <Star className="w-2.5 h-2.5 fill-gold-400 text-gold-400" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </FilterSection>

    {/* Clear all */}
    {activeFilterCount > 0 && (
      <button
        onClick={clearFilters}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors mt-2"
      >
        <FilterX className="w-3.5 h-3.5" />
        Clear all filters
      </button>
    )}
  </aside>
);

/* ─────────────────────────────────────────────
   Shop (main page)
───────────────────────────────────────────── */
const Shop = () => {
  const [activeCollection, setActiveCollection] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceOption, setPriceOption] = useState(null); // null = Any Price
  const [minRating, setMinRating] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  // Convert priceOption → [min, max] that useInfiniteProducts expects
  const priceRange = priceOption ?? [0, Infinity];

  const { products: filteredProducts, loading, hasMore, loadMore } =
    useInfiniteProducts({
      collectionId: activeCollection,
      categories: selectedCategories,
      priceRange,
      minRating,
      searchText,
    });

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceOption(null);
    setMinRating(0);
    setActiveCollection("all");
    setSearchText("");
  };

  const activeFilterCount = [
    activeCollection !== "all",
    selectedCategories.length > 0,
    !!priceOption,
    minRating > 0,
    searchText.trim() !== "",
  ].filter(Boolean).length;

  // Infinite scroll
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

  // Props bundle — shared between desktop sidebar & mobile drawer
  const filterProps = {
    searchText,
    setSearchText,
    activeCollection,
    setActiveCollection,
    selectedCategories,
    toggleCategory,
    priceOption,
    setPriceOption,
    minRating,
    setMinRating,
    activeFilterCount,
    clearFilters,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-100 pb-28">
      {/* Full-bleed hero header */}
      <PageHeader
        eyebrow="Curated Elixirs"
        titleStart="The"
        titleItalic="Collection"
        description="Curated elixirs designed to restore and perfect your natural radiance."
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* Mobile filter toggle bar */}
        <div className="lg:hidden flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
          <p className="text-xs text-neutral-400 tracking-widest uppercase">
            {filteredProducts.length} products
          </p>
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-gold-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {panelOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPanelOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto p-6 shadow-2xl lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700 flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
                    Filter Products
                  </span>
                  <button onClick={() => setPanelOpen(false)}>
                    <X className="w-4 h-4 text-neutral-400 hover:text-neutral-700 transition-colors" />
                  </button>
                </div>
                <FilterPanel {...filterProps} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop layout: sidebar + grid */}
        <div className="flex gap-10 items-start">

          {/* Sticky sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-56 flex-shrink-0 sticky top-28"
          >
            <div className="bg-white border border-neutral-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="bg-gold-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanel {...filterProps} />
            </div>
          </motion.div>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-xs text-neutral-400 tracking-widest uppercase">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 mb-12">
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              !loading && (
                <div className="text-center py-32 border-2 border-dashed border-cream-200">
                  <p className="text-neutral-400 font-light italic mb-4">
                    No products match your current filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-700 underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              )
            )}

            {/* {loading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  Loading products…
                </p>
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
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;