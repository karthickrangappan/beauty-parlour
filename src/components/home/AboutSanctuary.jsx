import React from 'react';
import { motion } from 'framer-motion';

const AboutSanctuary = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto relative z-10 bg-[#fdf8f3]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.h3 variants={fadeIn} className="text-gold-500 uppercase tracking-[0.3em] text-sm font-semibold">
            Our Experience
          </motion.h3>
          <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-light text-neutral-900 leading-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
            Bathed in <br/>
            <span className="italic text-neutral-600">Golden Hour</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-neutral-500 text-lg leading-relaxed max-w-lg">
            Experience the profound calm of our meticulously designed beauty parlour. Marble floors meet brushed gold accents, harmonizing with natural light to create an atmosphere of serene luxury. Our expert stylists and therapists are dedicated to curating a bespoke experience just for you.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex items-center gap-8 pt-4">
            <div>
              <h4 className="text-3xl font-light text-neutral-900 mb-1" style={{ fontFamily: "ui-serif, Georgia, serif" }}>10+</h4>
              <p className="text-xs uppercase tracking-widest text-neutral-400">Years Exp</p>
            </div>
            <div className="w-[1px] h-12 bg-neutral-200"></div>
            <div>
              <h4 className="text-3xl font-light text-neutral-900 mb-1" style={{ fontFamily: "ui-serif, Georgia, serif" }}>5k+</h4>
              <p className="text-xs uppercase tracking-widest text-neutral-400">Happy Clients</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative h-[600px] w-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-4/5 h-4/5 ml-auto rounded-t-full overflow-hidden shadow-2xl z-10"
          >
            <img src="/images/bg-img4.png" alt="Sanctuary" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-tr-3xl overflow-hidden shadow-xl border-4 border-[#fdf8f3] z-20"
          >
            <img src="/images/image_1.jpg" alt="Details" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSanctuary;
