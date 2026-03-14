import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const storyData = {
  hero: {
    title: "The Art of Lumière",
    subtitle: "A LEGACY OF RADIANCE & SERENITY",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=2000&auto=format&fit=crop"
  },
  philosophy: {
    title: "Born from the",
    titleItalic: "serenity of nature",
    paragraphs: [
      "Founded in 2012, Lumière was born from a simple yet profound desire: to merge the raw power of botanical active ingredients with the sophisticated precision of modern skincare science.",
      "We believe that beauty is not merely a surface aesthetic, but a reflection of inner balance and light. Our sanctuary was designed to be more than just a parlour; it is a portal to peace in a fast-paced world."
    ],
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop"
  },
  pillars: {
    tagline: "Our Core Pillars",
    title: "Crafted with Intention",
    items: [
      {
        title: "Pure Sourcing",
        desc: "Every extract, oil, and mineral is ethically sourced from trusted growers who honor the earth.",
        icon: "🌿"
      },
      {
        title: "Cinematic Science",
        desc: "We utilize cutting-edge delivery systems to ensure ingredients perform at their peak deep within the skin.",
        icon: "🔬"
      },
      {
        title: "Inner Rituals",
        desc: "Our treatments are designed to soothe the nervous system as much as they illuminate the complexion.",
        icon: "✨"
      }
    ]
  },
  deepStory: {
    title: "Experience the",
    titleItalic: "Gold Standard",
    content: "Over the last decade, Lumière has grown into a globally recognized beacon of skin wellness. Our products, once only available inside our boutique spa, are now delivered to those who seek high-performance results without compromising on clean ingredients.",
    quote: "We believe every individual carries a natural light. Our only job is to provide the canvas for it to shine.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop"
  },
  cta: {
    title: "Your journey to radiance begins here.",
    shopText: "Browse The Collection",
    bookingText: "Book an Appointment"
  }
};

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={storyData.hero.image}
            alt="Nature and Wellness"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-neutral-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-neutral-900/40" />
        </motion.div>

        <div className="relative text-center px-4 sm:px-6 w-full max-w-5xl mx-auto z-10 pt-20">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white font-light tracking-wide leading-tight drop-shadow-lg"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {storyData.hero.title}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-4 sm:mt-6 tracking-[0.2em] sm:tracking-[0.3em] font-medium uppercase drop-shadow-md"
          >
            {storyData.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-6 sm:space-y-8"
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-neutral-900 leading-[1.1] font-light"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="block">{storyData.philosophy.title}</span>
              <span className="italic text-gold-500 font-serif">{storyData.philosophy.titleItalic}</span>
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {storyData.philosophy.paragraphs.map((p, i) => (
                <p key={i} className="text-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed font-light">
                  {p}
                </p>
              ))}
            </div>
            <div className="w-16 sm:w-20 h-[1px] bg-gold-400 mt-8" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative mt-8 lg:mt-0"
          >
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-w-md mx-auto lg:max-w-full rounded-t-full overflow-hidden shadow-2xl border-4 sm:border-8 border-white relative z-10">
              <img
                src={storyData.philosophy.image}
                alt="Botanical focus"
                className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
              />
            </div>
            <div className="absolute bottom-10 -right-4 sm:-right-10 w-40 h-40 sm:w-56 sm:h-56 bg-gold-200/40 rounded-full blur-3xl z-0" />
            <div className="absolute top-10 -left-4 sm:-left-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#fdf8f3] rounded-full blur-3xl z-0" />
          </motion.div>
        </div>
      </section>

      {/* 3. Pillars Section */}
      <section className="bg-[#fdf8f3] py-20 sm:py-24 md:py-32">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16 sm:mb-20">
            <h3 className="text-gold-500 font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm mb-4">
              {storyData.pillars.tagline}
            </h3>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900" 
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {storyData.pillars.title}
            </h2>
            <div className="w-16 sm:w-24 h-[1px] bg-gold-300 mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
            {storyData.pillars.items.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                className="bg-white p-8 sm:p-10 xl:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 text-center flex flex-col items-center group"
              >
                <div className="text-4xl sm:text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-medium text-neutral-900 tracking-wider uppercase mb-4">
                  {value.title}
                </h4>
                <p className="text-neutral-500 text-sm sm:text-base leading-relaxed font-light">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Deep Story Section */}
      <section className="py-20 sm:py-24 md:py-32 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col-reverse lg:flex-row gap-12 md:gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 aspect-square max-w-md mx-auto lg:max-w-full rounded-full overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 border-4 sm:border-8 border-white rounded-full z-10 pointer-events-none" />
            <img
              src={storyData.deepStory.image}
              alt="Product textures"
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-6 sm:space-y-8"
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 leading-[1.1]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="block">{storyData.deepStory.title}</span>
              <span className="italic text-gold-500 font-serif">{storyData.deepStory.titleItalic}</span>
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed font-light">
              {storyData.deepStory.content}
            </p>
            <div className="border-l-2 border-gold-400 pl-6 sm:pl-8 py-2 mt-8">
              <p className="text-neutral-800 text-lg sm:text-xl lg:text-2xl leading-relaxed font-serif italic mb-0">
                "{storyData.deepStory.quote}"
              </p>
            </div>
            <div className="w-16 sm:w-20 h-[1px] bg-gold-400 mt-8" />
          </motion.div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="relative py-24 sm:py-32 bg-neutral-900 overflow-hidden text-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl mx-auto px-6"
        >
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-12 text-white font-serif italic drop-shadow-lg"
          >
            {storyData.cta.title}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-gold-500 hover:bg-gold-400 text-white uppercase tracking-widest text-xs sm:text-sm font-semibold transition-all duration-300 rounded-full shadow-lg hover:shadow-gold-500/20"
            >
              {storyData.cta.shopText}
            </Link>
            <Link
              to="/appointments"
              className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 border border-white/30 text-white hover:bg-white hover:text-neutral-900 uppercase tracking-widest text-xs sm:text-sm font-semibold transition-all duration-300 rounded-full"
            >
              {storyData.cta.bookingText}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
