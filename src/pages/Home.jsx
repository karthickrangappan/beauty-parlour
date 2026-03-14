import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const homeData = {
  hero: {
    tagline: "The Art of Radiance",
    titleLine1: "Awaken your",
    titleItalic: "purest essence",
    description: "Step into a sun-drenched sanctuary of calm where pearl and silk meet flawless precision.",
    backgroundImage: "public/images/bg_3.jpg",
    scrollText: "Scroll to explore"
  },
  sanctuary: {
    tagline: "Our Sanctuary",
    titleLine1: "Bathed in",
    titleLine2: "Golden Hour",
    description: "Experience the profound calm of our meticulously designed spa. Marble floors meet brushed gold accents, harmonizing with natural light to create an atmosphere of serene luxury.",
    image: "public/images/bg_2.jpg",
    ctaText: "Reserve a Moment"
  }
};

const CinematicSequence = () => {
  const { scrollYProgress } = useScroll();

  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 0.2], [0, 60]);

  return (
    <div className="relative bg-gradient-to-b from-cream-50 via-white to-cream-100 w-full min-h-screen overflow-hidden">


      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">


        <motion.div
          className="absolute inset-0"
          style={{ scale: scaleImage }}
        >
          <img
            src={homeData.hero.backgroundImage}
            alt="Cinematic sanctuary"
            className="absolute inset-0 w-full h-full object-cover"
          />


          <div className="absolute inset-0 bg-gradient-to-tr from-blush-200/40 via-transparent to-gold-300/30 mix-blend-overlay" />


          <div className="absolute inset-0 bg-black/20" />
        </motion.div>



        <div className="absolute inset-0 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/70 blur-[2px]"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -150],
                x: [0, Math.random() * 40 - 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 6 + 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>



        <motion.div
          className="relative z-20 text-center px-6 max-w-4xl"
          style={{ opacity: opacityText, y: yText }}
        >
          <motion.h3
            className="uppercase tracking-[0.35em] text-xs md:text-sm text-gold-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            {homeData.hero.tagline}
          </motion.h3>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl text-neutral-900 font-light leading-[1.05]"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.4 }}
          >
            {homeData.hero.titleLine1}
            <br />
            <span className="italic text-neutral-600">
              {homeData.hero.titleItalic}
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 text-lg md:text-xl text-neutral-500 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {homeData.hero.description}
          </motion.p>


          <motion.div
            className="mt-16 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="text-xs uppercase tracking-widest text-neutral-400">
              {homeData.hero.scrollText}
            </span>

            <motion.div
              className="w-[1px] h-16 bg-gradient-to-b from-neutral-400 to-transparent mt-3"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>



      <div className="relative py-32 md:py-48 px-6 md:px-12 max-w-7xl mx-auto">

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >


          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full shadow-2xl group">

            <motion.img
              src={homeData.sanctuary.image}
              alt="Luxury spa"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
            />


            <div className="absolute inset-0 bg-gradient-to-tr from-gold-200/20 to-transparent mix-blend-overlay" />

          </div>



          <div className="space-y-8">

            <h3 className="uppercase tracking-[0.3em] text-sm text-gold-500">
              {homeData.sanctuary.tagline}
            </h3>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              {homeData.sanctuary.titleLine1}
              <br />
              {homeData.sanctuary.titleLine2}
            </h2>

            <p className="text-neutral-500 text-lg leading-relaxed max-w-lg">
              {homeData.sanctuary.description}
            </p>

            <motion.button
              className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-300 pb-2 hover:border-neutral-900 transition"
              whileHover={{ x: 6 }}
            >
              {homeData.sanctuary.ctaText} →
            </motion.button>

          </div>
        </motion.div>
      </div>



      <motion.div
        className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(255,210,210,0.5), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default CinematicSequence;