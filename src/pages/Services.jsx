import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  FilterX,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

/* ─────────────────────────────────────────────
   Constants  (defined at module level)
───────────────────────────────────────────── */
const DURATION_OPTIONS = [
  { label: "Any Duration", value: null },
  { label: "Under 30 min", value: [0, 30] },
  { label: "30 – 60 min", value: [30, 60] },
  { label: "60 – 90 min", value: [60, 90] },
  { label: "90+ min", value: [90, Infinity] },
];

const PRICE_OPTIONS = [
  { label: "Any Price", value: null },
  { label: "Under ₹500", value: [0, 500] },
  { label: "₹500 – ₹1,000", value: [500, 1000] },
  { label: "₹1,000 – ₹2,000", value: [1000, 2000] },
  { label: "₹2,000+", value: [2000, Infinity] },
];

/* ─────────────────────────────────────────────
   FilterSection  (stable, module-level component)
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
   FilterPanel  (stable, module-level component)
   *** MUST stay outside Services so React
       never remounts it during re-renders ***
───────────────────────────────────────────── */
const FilterPanel = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  categories,
  priceRange,
  setPriceRange,
  durationRange,
  setDurationRange,
  activeFilterCount,
  resetFilters,
}) => (
  <aside className="w-full">
    {/* Search */}
    <div className="relative mb-6">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
      <input
        type="text"
        placeholder="Search services…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-cream-50 border border-neutral-100 py-2.5 pl-10 pr-9 text-xs focus:outline-none focus:border-gold-400 transition-colors placeholder:text-neutral-300 rounded-sm italic font-serif"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2"
        >
          <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700 transition-colors" />
        </button>
      )}
    </div>

    {/* Category */}
    <FilterSection title="Category">
      <div className="flex flex-col gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-left text-xs px-3 py-2 rounded-sm transition-all duration-200 font-medium tracking-wide ${
              category === cat
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:bg-cream-100 hover:text-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </FilterSection>

    {/* Price */}
    <FilterSection title="Price Range">
      <div className="flex flex-col gap-1.5">
        {PRICE_OPTIONS.map((opt) => {
          const active =
            (!priceRange && !opt.value) ||
            (priceRange &&
              opt.value &&
              priceRange[0] === opt.value[0] &&
              priceRange[1] === opt.value[1]);
          return (
            <button
              key={opt.label}
              onClick={() => setPriceRange(opt.value)}
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

    {/* Duration */}
    <FilterSection title="Duration">
      <div className="flex flex-col gap-1.5">
        {DURATION_OPTIONS.map((opt) => {
          const active =
            (!durationRange && !opt.value) ||
            (durationRange &&
              opt.value &&
              durationRange[0] === opt.value[0] &&
              durationRange[1] === opt.value[1]);
          return (
            <button
              key={opt.label}
              onClick={() => setDurationRange(opt.value)}
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

    {/* Reset */}
    {activeFilterCount > 0 && (
      <button
        onClick={resetFilters}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors mt-2"
      >
        <FilterX className="w-3.5 h-3.5" />
        Clear all filters
      </button>
    )}
  </aside>
);

/* ─────────────────────────────────────────────
   Services (main page)
───────────────────────────────────────────── */
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [durationRange, setDurationRange] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "services"), where("isActive", "==", true));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ["All", ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((s) => {
    const matchCat = category === "All" || s.category === category;

    // Search across name, category AND description so results are broader
    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.category && s.category.toLowerCase().includes(term)) ||
      (s.description && s.description.toLowerCase().includes(term));

    const matchPrice =
      !priceRange || (s.price >= priceRange[0] && s.price < priceRange[1]);

    const matchDuration =
      !durationRange ||
      (s.duration >= durationRange[0] && s.duration < durationRange[1]);

    return matchCat && matchSearch && matchPrice && matchDuration;
  });

  const activeFilterCount = [
    category !== "All",
    !!priceRange,
    !!durationRange,
    searchTerm.trim() !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setCategory("All");
    setPriceRange(null);
    setDurationRange(null);
    setSearchTerm("");
  };

  // Props bundle passed to both desktop sidebar and mobile drawer
  const filterProps = {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    categories,
    priceRange,
    setPriceRange,
    durationRange,
    setDurationRange,
    activeFilterCount,
    resetFilters,
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Full-bleed hero header */}
      <PageHeader
        eyebrow="The Art of Transformation"
        titleStart="Our"
        titleItalic="Services"
        description="Explore our curated selection of Indian makeup artistry, from traditional bridal ceremonies to modern editorial glamour. Each service is tailored to enhance your natural beauty with precision and passion."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
          <p className="text-xs text-neutral-400 tracking-widest uppercase">
            {filteredServices.length} services
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
                    Filter Services
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

        {/* Desktop layout */}
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

          {/* Services grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-xs text-neutral-400 tracking-widest uppercase">
                {filteredServices.length}{" "}
                {filteredServices.length === 1 ? "service" : "services"} found
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  Curating the collections…
                </p>
              </div>
            ) : (
              <>
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredServices.map((service, idx) => (
                        <motion.div
                          key={service.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.04 }}
                          className="group bg-white border border-neutral-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.name}
                              onError={(e) => {
                                e.target.src =
                                  "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff";
                              }}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-neutral-800 shadow-sm border border-neutral-100">
                              {service.category}
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <h3
                                className="text-lg text-neutral-800 font-light group-hover:text-gold-600 transition-colors leading-snug"
                                style={{ fontFamily: "ui-serif, Georgia, serif" }}
                              >
                                {service.name}
                              </h3>
                              <span className="text-base font-semibold text-gold-600 ml-2 flex-shrink-0">
                                ₹{service.price}
                              </span>
                            </div>

                            <p className="text-neutral-500 text-xs font-light leading-relaxed mb-5 line-clamp-2">
                              {service.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-cream-100">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase tracking-widest font-medium">
                                  {service.duration} mins
                                </span>
                              </div>
                              <Link
                                to="/appointments"
                                state={{ selectedService: service }}
                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-neutral-800 hover:text-gold-500 transition-colors group/link"
                              >
                                Book Now
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-32 border-2 border-dashed border-cream-200">
                    <Sparkles className="w-12 h-12 text-cream-200 mx-auto mb-4" />
                    <h3
                      className="text-xl text-neutral-800 font-light mb-2"
                      style={{ fontFamily: "ui-serif, Georgia, serif" }}
                    >
                      No services found
                    </h3>
                    <p className="text-neutral-400 text-xs uppercase tracking-widest mb-6">
                      Adjust your filters or clear them to see all services
                    </p>
                    <button
                      onClick={resetFilters}
                      className="text-[10px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-700 underline underline-offset-4"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;