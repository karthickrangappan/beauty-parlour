import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ShieldCheck, Flower2 } from 'lucide-react';

const AboutSanctuary = () => {
  const stats = [
    { label: "Years of Mastery", value: "12+", icon: ShieldCheck },
    { label: "Happy Souls", value: "5.4k", icon: Heart },
    { label: "Expert Stylists", value: "15", icon: Flower2 },
  ];

  return (
    <section className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gold-200/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blush-100/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Visual Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              {/* Main Image with decorative frame */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl relative z-20 border border-neutral-100"
              >
                <img 
                  src="/images/bg-img4.png" 
                  alt="Sanctuary Interior" 
                  className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Overlay Card */}
              <motion.div 
                initial={{ opacity: 0, x: -50, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-10 -left-6 md:-left-12 bg-white p-8 md:p-10 rounded-3xl shadow-2xl z-30 border border-neutral-50 max-w-[280px] hidden md:block"
              >
                <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-gold-600 mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-medium text-neutral-900 mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  Curated <span className="italic">Excellence</span>
                </h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  Every ritual at Lumière is a masterfully choreographed dance of science and soul.
                </p>
              </motion.div>

              {/* Secondary Visual Accent */}
              <motion.div 
                initial={{ opacity: 0, x: 50, y: -50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-gold-200/30 flex items-center justify-center -rotate-12 pointer-events-none hidden lg:flex"
              >
                <div className="w-44 h-44 rounded-full border border-gold-400/20 bg-gold-50/5 flex items-center justify-center overflow-hidden">
                   <img src="/images/image_1.jpg" alt="Ritual" className="w-full h-full object-cover opacity-60 scale-125" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50/50 border border-gold-100 text-gold-600 text-[10px] uppercase tracking-[0.3em] font-black mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                The Sanctuary Legacy
              </div>
              <h2 className="text-5xl md:text-7xl font-light text-neutral-900 leading-[1.05] mb-8" style={{ fontFamily: "Playfair Display, serif" }}>
                Crafting <span className="italic text-gold-500">Luminous</span> <br/>
                Beauty Since 2012
              </h2>
              <p className="text-neutral-500 text-lg md:text-xl leading-relaxed font-light max-w-xl">
                Lumière is more than a salon; it's a meticulously crafted sanctuary where marble thresholds meet botanical alchemy. We believe beauty is a ritual, not a routine.
              </p>
            </motion.div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-neutral-50/50 border border-neutral-100 transition-all duration-500"
              >
                <h4 className="text-lg font-medium text-neutral-900 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>Our Philosophy</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  Bridging the gap between laboratory precision and sensory indulgence.
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-gold-50/20 border border-gold-100/20 transition-all duration-500"
              >
                <h4 className="text-lg font-medium text-neutral-900 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>Pure Rituals</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  100% organic formulations paired with state-of-the-art dermatological tech.
                </p>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-12 pt-8 border-t border-neutral-100">
               {stats.map((stat, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i*0.1) }}
                    className="flex flex-col"
                 >
                    <span className="text-3xl font-bold text-neutral-900 tracking-tighter mb-1">{stat.value}</span>
                    <span className="text-[10px] uppercase tracking-widest font-black text-neutral-400">{stat.label}</span>
                 </motion.div>
               ))}
            </div>

            <motion.div
               whileHover={{ x: 5 }}
               transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <button className="h-16 px-12 bg-neutral-900 text-white rounded-2xl text-xs uppercase tracking-[0.3em] font-black hover:bg-gold-600 transition-all duration-500 shadow-2xl flex items-center gap-4">
                    Our Full Story
                    <div className="w-8 h-[1px] bg-white/30" />
                </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSanctuary;
