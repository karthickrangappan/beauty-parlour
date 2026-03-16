import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, IndianRupee, Eye, ArrowRight } from "lucide-react";

const ServiceCard = ({ service, index, onQuickView }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-700 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden bg-neutral-100">
        <img
          src={service.image}
          alt={service.name}
          onError={(e) => {
            e.target.src = "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff";
          }}
          className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm shadow-sm text-neutral-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-neutral-100">
            {service.category}
          </span>
        </div>

        {/* Dynamic Price Overlay */}
        <div className="absolute bottom-4 right-4 z-10">
            <div className="bg-neutral-900 text-white px-4 py-1.5 rounded-full flex items-center gap-1 shadow-xl">
                <IndianRupee className="w-3 h-3" />
                <span className="text-sm font-bold tracking-tight">{service.price}</span>
            </div>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-neutral-900/40  opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView();
            }}
            className="bg-white text-neutral-900 px-8 rounded-full py-3.5 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-black transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 shadow-2xl hover:bg-gold-500 hover:text-white"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4 text-gold-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">{service.duration} MINS</span>
            <div className="w-1 h-1 rounded-full bg-gold-200" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Sanctum Approved</span>
        </div>

        <h3
          className="text-2xl text-neutral-900 font-light mb-4 group-hover:text-gold-600 transition-colors leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {service.name}
        </h3>

        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-8 line-clamp-2 italic opacity-80">
          {service.description}
        </p>

        <div className="mt-auto pt-6 border-t border-neutral-50 flex items-center justify-between">
           <Link
             to="/appointments"
             state={{ selectedService: service }}
             className="text-[10px] uppercase tracking-[0.2em] font-black text-neutral-900 group-hover:text-gold-600 transition-colors flex items-center gap-2"
           >
             Reserve Ritual
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
           
           <div className="hidden sm:flex items-center gap-1">
               {Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className="w-1 h-1 rounded-full bg-gold-200" />
               ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
