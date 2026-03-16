import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles, Clock, IndianRupee } from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import ServiceQuickView from '../ServiceQuickView';
import ServiceCard from '../ServiceCard';

const TrendingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchTrendingServices = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "services"), 
          where("isActive", "==", true),
          limit(3)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      } catch (err) {
        console.error("Error fetching trending services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingServices();
  }, []);

  const handleQuickView = (service) => {
    setSelectedService(service);
    setIsQuickViewOpen(true);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold-200/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-100 text-gold-600 text-[10px] uppercase tracking-[0.2em] font-black mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Artisanal Rituals
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Trending <span className="italic text-gold-500">Services</span>
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl">
               Immerse yourself in our most requested sanctuary experiences, designed to harmonize your body and spirit using ancient wisdom and modern technique.
            </p>
          </div>
          <Link to="/services" className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-neutral-900 border-b border-neutral-200 pb-2 hover:border-gold-500 transition-all duration-500">
            View Full Palette 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-100 rounded-2xl mb-6 shadow-sm shadow-black/5" />
                    <div className="h-4 bg-neutral-100 w-2/3 rounded-full mb-3" />
                    <div className="h-3 bg-neutral-100 w-full rounded-full mb-2" />
                    <div className="h-3 bg-neutral-100 w-1/2 rounded-full" />
                </div>
             ))
          ) : (
            services.map((service, idx) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={idx} 
                onQuickView={() => handleQuickView(service)}
              />
            ))
          )}
        </div>
      </div>

      <ServiceQuickView 
        service={selectedService}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  );
};

export default TrendingServices;
