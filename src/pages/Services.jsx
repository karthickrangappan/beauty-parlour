import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Sparkles, Clock, ArrowRight, Loader2, Search } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "services"), where("isActive", "==", true));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ["All", ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(s => {
    const matchCategory = filter === "All" || s.category === filter;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-gold-500 uppercase tracking-[0.4em] text-xs font-semibold mb-4 text-center">
              The Art of Transformation
            </h2>
            <h1 
              className="text-5xl md:text-7xl text-neutral-800 font-light mb-8"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              Our <span className="italic">Services</span>
            </h1>
            <p className="max-w-2xl mx-auto text-neutral-500 font-light leading-relaxed text-sm md:text-base">
              Explore our curated selection of Indian makeup artistry, from traditional bridal ceremonies to modern editorial glamour. Each service is tailored to enhance your natural beauty with precision and passion.
            </p>
          </motion.div>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b border-cream-200 pb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-medium transition-all duration-300 rounded-full border ${
                  filter === cat
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/10"
                    : "bg-white text-neutral-500 border-neutral-100 hover:border-gold-300 hover:text-gold-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-neutral-100 py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300 rounded-sm italic font-serif"
            />
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Curating the collections...</p>
          </div>
        ) : (
          <>
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredServices.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="group bg-white border border-neutral-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 block"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff"; }}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-neutral-800 shadow-sm border border-neutral-100">
                          {service.category}
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 
                            className="text-xl text-neutral-800 font-light group-hover:text-gold-600 transition-colors"
                            style={{ fontFamily: "ui-serif, Georgia, serif" }}
                          >
                            {service.name}
                          </h3>
                          <span className="text-lg font-medium text-gold-600">₹{service.price}</span>
                        </div>
                        
                        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-cream-100">
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-widest font-medium">{service.duration} mins</span>
                          </div>
                          <Link 
                            to="/appointments" 
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-800 hover:text-gold-500 transition-colors group/link"
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
                <h3 className="text-xl text-neutral-800 font-light mb-2" style={{ fontFamily: "ui-serif, Georgia, serif" }}>No services found</h3>
                <p className="text-neutral-400 text-xs uppercase tracking-widest">Adjust your search or category filter</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
  