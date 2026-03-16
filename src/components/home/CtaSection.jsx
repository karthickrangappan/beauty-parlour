import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, CalendarDays, ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0">
          <img 
            src="/images/intro.jpg" 
            alt="Sanctuary Atmosphere" 
            className="w-full h-full object-cover scale-110" 
          />
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-[2px]" />
          {/* Animated Gradient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(0,0,0,0)_100%)]" />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl px-8">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
         >
            <div className="w-20 h-20 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-400/10 text-gold-400 mb-10">
                <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="text-5xl md:text-8xl text-white font-light mb-10 leading-[1.1]" style={{ fontFamily: "Playfair Display, serif" }}>
                Ready to Reveal <br/>
                Your <span className="italic text-gold-400">Radiance?</span>
            </h2>

            <p className="text-white/60 text-lg md:text-xl font-light mb-14 max-w-2xl mx-auto leading-relaxed">
                Step into a sanctuary where science meets serenity. Allow our master practitioners to curate a ritual designed uniquely for your essence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                    <Link 
                        to="/appointments" 
                        className="h-20 px-14 bg-gold-500 text-white rounded-2xl flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-black hover:bg-gold-400 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(181,149,47,0.4)]"
                    >
                        <CalendarDays className="w-5 h-5" />
                        Schedule Your Escape
                    </Link>
                </motion.div>

                <Link 
                    to="/services" 
                    className="group flex items-center gap-3 text-white/50 hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-black"
                >
                    Explore The Palette
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
         </motion.div>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
    </section>
  );
};

export default CtaSection;
