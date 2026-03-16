import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

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
      <PageHeader
        eyebrow="A Legacy of Radiance & Serenity"
        titleStart="The Art of"
        titleItalic="Lumière"
        description="Where the raw power of botanical ingredients meets the sophisticated precision of modern skincare science."
      />

      <section className="py-20 sm:py-24 md:py-32 lg:py-40 px-6 sm:px-10 lg:px-16 xl:px-24 w-full max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-20 lg:gap-24 xl:gap-32 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8 sm:space-y-10"
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-neutral-900 leading-[1.05] font-light"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="block">{storyData.philosophy.title}</span>
              <span className="italic text-gold-500 font-serif">{storyData.philosophy.titleItalic}</span>
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {storyData.philosophy.paragraphs.map((p, i) => (
                <p key={i} className="text-neutral-600 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed font-light">
                  {p}
                </p>
              ))}
            </div>
            <div className="w-20 sm:w-24 h-[1px] bg-gold-400 mt-10" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative mt-12 lg:mt-0"
          >
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-w-lg mx-auto lg:max-w-full rounded-t-full overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-8 sm:border-[12px] border-white relative z-10 transition-transform duration-700 hover:scale-[1.02]">
              <img
                src={storyData.philosophy.image}
                alt="Botanical focus"
                className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-110"
              />
            </div>
            <div className="absolute bottom-10 -right-8 sm:-right-16 w-64 h-64 sm:w-80 sm:h-80 bg-gold-100/40 rounded-full blur-[80px] z-0" />
            <div className="absolute top-10 -left-8 sm:-left-16 w-48 h-48 sm:w-64 sm:h-64 bg-[#fdf8f3] rounded-full blur-[80px] z-0" />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#fdf8f3] py-24 sm:py-32 md:py-40">
        <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-20 sm:mb-24">
            <h3 className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-6">
              {storyData.pillars.tagline}
            </h3>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-neutral-900 leading-tight" 
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {storyData.pillars.title}
            </h2>
            <div className="w-20 sm:w-28 h-[1px] bg-gold-400/50 mx-auto mt-10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 xl:gap-20">
            {storyData.pillars.items.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2, duration: 1, ease: "easeOut" }}
                className="bg-white p-10 sm:p-12 xl:p-14 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 text-center flex flex-col items-center group cursor-default"
              >
                <div className="text-5xl sm:text-6xl mb-8 group-hover:scale-125 transition-transform duration-700 ease-out grayscale-[0.5] group-hover:grayscale-0">
                  {value.icon}
                </div>
                <h4 className="text-lg sm:text-xl xl:text-2xl font-semibold text-neutral-900 tracking-widest uppercase mb-6">
                  {value.title}
                </h4>
                <p className="text-neutral-500 text-sm sm:text-base xl:text-lg leading-relaxed font-light">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 md:py-40 px-6 sm:px-10 lg:px-16 xl:px-24 w-full max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex flex-col-reverse lg:flex-row gap-16 md:gap-20 lg:gap-24 xl:gap-32 items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 aspect-square max-w-lg mx-auto lg:max-w-full rounded-full overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.25)] relative group"
          >
            <div className="absolute inset-0 border-8 sm:border-[16px] border-white rounded-full z-10 pointer-events-none" />
            <img
              src={storyData.deepStory.image}
              alt="Product textures"
              className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8 sm:space-y-10"
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light text-neutral-900 leading-[1.05]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="block">{storyData.deepStory.title}</span>
              <span className="italic text-gold-500 font-serif">{storyData.deepStory.titleItalic}</span>
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed font-light">
              {storyData.deepStory.content}
            </p>
            <div className="border-l-[3px] border-gold-400 pl-8 sm:pl-10 py-3 mt-10">
              <p className="text-neutral-800 text-xl sm:text-2xl xl:text-3xl leading-relaxed font-serif italic mb-0 text-gold-600/90">
                "{storyData.deepStory.quote}"
              </p>
            </div>
            <div className="w-20 sm:w-24 h-[1px] bg-gold-400 mt-10" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 sm:py-40 lg:py-52 bg-neutral-900 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.18)_0%,rgba(0,0,0,0)_75%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6"
        >
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-16 text-white font-serif italic tracking-tight"
          >
            {storyData.cta.title}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-12 py-5 sm:py-6 bg-gold-400 hover:bg-gold-400 text-white uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold transition-all duration-500 rounded-full shadow-[0_10px_30px_-5px_rgba(201,169,106,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(201,169,106,0.6)] hover:-translate-y-1"
            >
              {storyData.cta.shopText}
            </Link>
            <Link
              to="/appointments"
              className="w-full sm:w-auto px-12 py-5 sm:py-6 bg-gold-400  hover:bg-gold-400 text-white uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold transition-all duration-500 rounded-full shadow-[0_10px_30px_-5px_rgba(201,169,106,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(201,169,106,0.6)] hover:-translate-y-1"
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
