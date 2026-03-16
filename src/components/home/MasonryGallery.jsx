import React from 'react';
import { motion } from 'framer-motion';

const MasonryGallery = () => {
  return (
    <section className="py-24 bg-white text-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-gold-400 uppercase tracking-[0.3em] text-sm font-semibold mb-3">Portfolio</h3>
          <h2 className="text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
            Moments of <span className="italic">Beauty</span>
          </h2>
          <p className="text-neutral-400">A glimpse into the transformative experiences crafted at our atelier.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="col-span-2 row-span-2 relative overflow-hidden group">
            <img src="/images/gallery-1.jpg" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay: 0.1 }} className="col-span-2 md:col-span-1 row-span-1 relative overflow-hidden group">
            <img src="/images/gallery-2.jpg" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay: 0.2 }} className="col-span-2 md:col-span-1 row-span-2 relative overflow-hidden group">
            <img src="/images/gallery-3.jpg" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay: 0.3 }} className="col-span-2 md:col-span-1 row-span-1 relative overflow-hidden group">
            <img src="/images/gallery-4.jpg" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MasonryGallery;
