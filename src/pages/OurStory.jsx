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

const OurStory = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={storyData.hero.image}
            alt="Nature and Wellness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/30" />
        </motion.div>

        <div className="relative text-center px-6">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl text-white font-light tracking-wider"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            {storyData.hero.title}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-white/80 text-xl md:text-2xl mt-6 tracking-widest font-light"
          >
            {storyData.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h2
              className="text-4xl md:text-5xl font-light text-neutral-900 leading-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              {storyData.philosophy.title} <br />
              <span className="italic font-serif">{storyData.philosophy.titleItalic}</span>
            </h2>
            {storyData.philosophy.paragraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl">
              <img
                src={storyData.philosophy.image}
                alt="Botanical focus"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Abstract decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold-200/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-cream-50 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <h3 className="text-gold-500 uppercase tracking-widest text-sm mb-4">{storyData.pillars.tagline}</h3>
            <h2 className="text-4xl font-light text-neutral-900" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{storyData.pillars.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {storyData.pillars.items.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 text-center space-y-4"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-medium text-neutral-900 tracking-wide uppercase text-sm">{value.title}</h4>
                <p className="text-neutral-500 leading-relaxed font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Story Section */}
      <section className="py-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:order-2 space-y-8"
          >
            <h2
              className="text-4xl md:text-5xl font-light text-neutral-900 leading-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              {storyData.deepStory.title} <br />
              <span className="italic font-serif">{storyData.deepStory.titleItalic}</span>
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              {storyData.deepStory.content}
            </p>
            <p className="text-neutral-600 text-lg leading-relaxed font-serif italic text-xl border-l-2 border-gold-300 pl-6 py-2">
              "{storyData.deepStory.quote}"
            </p>
          </motion.div>

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:order-1"
          >
            <div className="aspect-square rounded-full overflow-hidden shadow-2xl scale-90 md:scale-100">
              <img
                src={storyData.deepStory.image}
                alt="Product textures"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-neutral-900 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-8 font-serif italic">{storyData.cta.title}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              to="/shop"
              className="px-12 py-5 bg-gold-400 hover:bg-gold-500 text-white uppercase tracking-widest text-xs font-bold transition-all duration-300 rounded-full shadow-lg"
            >
              {storyData.cta.shopText}
            </Link>
            <Link
              to="/appointments"
              className="px-12 py-5 border border-white/30 hover:bg-white hover:text-neutral-900 uppercase tracking-widest text-xs font-bold transition-all duration-300 rounded-full"
            >
              {storyData.cta.bookingText}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default OurStory;
