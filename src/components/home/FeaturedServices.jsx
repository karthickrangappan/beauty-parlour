import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import ServiceQuickView from '../ServiceQuickView';

const FeaturedServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (service) => {
    setSelectedService(service);
    setIsQuickViewOpen(true);
  };

  const trendingServices = [
    {
      name: "Bridal Makeup",
      description: "Complete traditional makeover ensuring you shine impeccably on your special day. Includes pre-wedding consultation and premium product application.",
      image: "/images/offer-deal-1.jpg",
      price: "15,000",
      duration: "180",
      category: "Bridal"
    },
    {
      name: "Luxury Facial",
      description: "Deep cleansing facial that nourishes skin to improve glow and reduce dullness. Uses gold-infused elixirs for a truly luminous finish.",
      image: "/images/offer-deal-3.jpg",
      price: "1,800",
      duration: "60",
      category: "Skin Care"
    },
    {
      name: "Hair Spa Ritual",
      description: "Relaxing treatment repairing damaged hair, nourishing the scalp to restore silky shine. Includes a relaxing therapeutic head massage.",
      image: "/images/image_4.jpg",
      price: "1,500",
      duration: "45",
      category: "Hair Care"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h3 className="text-gold-500 uppercase tracking-[0.3em] text-sm font-semibold mb-3">
              Curated Treatments
            </h3>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Trending <span className="italic">Services</span>
            </h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-medium text-neutral-900 border-b border-neutral-300 pb-1 hover:border-gold-500 hover:text-gold-500 transition-colors">
            View All Palette <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingServices.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-sm bg-neutral-100">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-neutral-900 z-10 shadow-sm">
                  ₹{service.price}
                </div>
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <button 
                    onClick={() => handleQuickView(service)}
                    className="bg-white text-neutral-900 px-6 py-2.5 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:bg-gold-500 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </button>
                </div>
              </div>
              <h4 className="text-xl text-neutral-900 mb-2 font-light" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{service.name}</h4>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">{service.description}</p>
              <Link 
                to="/appointments" 
                state={{ selectedService: service }}
                className="text-xs uppercase tracking-widest text-gold-600 font-bold hover:text-neutral-900 transition-colors mt-auto inline-flex items-center gap-2"
              >
                Book Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
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

export default FeaturedServices;

