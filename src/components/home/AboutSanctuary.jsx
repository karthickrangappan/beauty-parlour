import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ShieldCheck, Flower2, Leaf, Droplets } from 'lucide-react';

const AboutSanctuary = () => {
  const stats = [
    { label: "Years of Mastery", value: "12+", icon: ShieldCheck },
    { label: "Happy Souls", value: "5.4k", icon: Heart },
    { label: "Expert Stylists", value: "15", icon: Flower2 },
  ];

  return (
    <section className="py-32 px-6 lg:px-12 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gold-200/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-rose-200/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Visual Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] md:aspect-[3/4] max-w-md mx-auto lg:max-w-none">
              
              {/* Decorative Background Frame */}
              <div className="absolute inset-0 translate-x-6 translate-y-6 md:translate-x-8 md:translate-y-8 rounded-t-[120px] rounded-b-[40px] border-2 border-gold-200/40 -z-10" />

              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full h-full rounded-t-[120px] rounded-b-[40px] overflow-hidden shadow-2xl shadow-neutral-900/10 relative z-20 border-8 border-white bg-white"
              >
                <img 
                  src="/images/bg-img4.png" 
                  alt="Sanctuary Interior" 
                  className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Overlay Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute -bottom-8 -left-4 md:-left-12 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 z-30 border border-white max-w-[260px] hidden sm:block"
              >
                <div className="w-12 h-12 bg-gold-50/50 rounded-full flex items-center justify-center text-gold-600 mb-5 border border-gold-100/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-lg md:text-xl font-medium text-neutral-900 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Curated <span className="italic text-gold-600">Excellence</span>
                </h4>
                <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-light">
                  Every ritual is a masterfully choreographed dance of science and soul.
                </p>
              </motion.div>

              {/* Secondary Visual Accent */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-12 -right-8 md:-right-12 w-40 h-40 md:w-48 md:h-48 rounded-full border-4 md:border-8 border-white shadow-xl flex items-center justify-center pointer-events-none z-30 bg-neutral-100 overflow-hidden"
              >
                <img src="/images/image_1.jpg" alt="Ritual" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </motion.div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-10 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50/50 border border-gold-100 text-gold-700 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                The Sanctuary Legacy
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                Crafting <span className="italic text-gold-500">Luminous</span> <br/>
                Beauty Since 2012
              </h2>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed font-light max-w-xl">
                Lumière is more than a salon; it's a meticulously crafted sanctuary where marble thresholds meet botanical alchemy. We believe beauty is a ritual, not a routine.
              </p>
            </motion.div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-8 rounded-[24px] bg-white border border-neutral-100 hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-gold-50 group-hover:text-gold-600 mb-5 transition-colors duration-500">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-medium text-neutral-900 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>Our Philosophy</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  Bridging the gap between laboratory precision and sensory indulgence.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8 rounded-[24px] bg-white border border-neutral-100 hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-500 group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-gold-50 group-hover:text-gold-600 mb-5 transition-colors duration-500">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-medium text-neutral-900 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>Pure Rituals</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">
                  100% organic formulations paired with state-of-the-art dermatological tech.
                </p>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-10 md:gap-16 pt-8 border-t border-neutral-200/60">
               {stats.map((stat, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i*0.1), duration: 0.5 }}
                    className="flex flex-col"
                 >
                    <span className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mb-2" style={{ fontFamily: "Playfair Display, serif" }}>{stat.value}</span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 flex items-center gap-2">
                        <stat.icon className="w-3.5 h-3.5 text-gold-400" />
                        {stat.label}
                    </span>
                 </motion.div>
               ))}
            </div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.7 }}
               className="pt-4"
            >
                <button className="group h-14 md:h-16 px-8 md:px-10 bg-neutral-900 text-white rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold hover:bg-gold-600 transition-colors duration-500 shadow-xl shadow-neutral-900/10 flex items-center gap-4">
                    Our Full Story
                    <span className="w-6 md:w-8 h-[1px] bg-white/30 group-hover:w-10 group-hover:bg-white transition-all duration-500" />
                </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSanctuary;
