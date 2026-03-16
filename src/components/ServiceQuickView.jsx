import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, IndianRupee, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceQuickView = ({ service, isOpen, onClose }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-neutral-100">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gold-50 text-gold-600 text-[10px] uppercase tracking-[0.2em] font-bold border border-gold-200 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-gold-500">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Premium Ritual</span>
                  </div>
                </div>

                <h2 
                  className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 leading-tight"
                  style={{ fontFamily: "ui-serif, Georgia, serif" }}
                >
                  {service.name}
                </h2>

                <div className="flex items-center gap-6 mb-8">
                 <div className="flex items-center gap-2 text-gold-600">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-2xl font-semibold tracking-tight">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 border-l border-neutral-100 pl-6">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-medium">{service.duration} Mins</span>
                  </div>
                </div>

                <div className="space-y-4 text-neutral-600 leading-relaxed text-sm md:text-base font-light">
                  <p>{service.description}</p>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                       <ShieldCheck className="w-4 h-4 text-gold-400" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">Expert Care</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                       <ShieldCheck className="w-4 h-4 text-gold-400" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">Organic Products</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <Link
                  to="/appointments"
                  state={{ selectedService: service }}
                  onClick={onClose}
                  className="w-full py-4 bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-xs font-bold hover:bg-gold-500 transition-all duration-500 shadow-xl"
                >
                  Book This Experience
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 text-center leading-relaxed">
                  Secure checkout hosted by Razorpay. <br/>Complimentary consultation included.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceQuickView;
