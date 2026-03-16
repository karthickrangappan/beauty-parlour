import React from "react";
import { motion } from "framer-motion";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop";

const PageHeader = ({
  eyebrow,
  titleStart,
  titleItalic,
  titleEnd = "",
  description,
  image = BG_IMAGE,
  className = "",
}) => {
  return (
    <header
      className={`relative w-full mb-20 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/60 to-neutral-900/50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 pt-32 pb-8"
      >
        {eyebrow && (
          <p className="text-gold-400 uppercase tracking-[0.4em] text-xs font-semibold mb-5 drop-shadow">
            {eyebrow}
          </p>
        )}

        <h1
          className="text-5xl md:text-7xl text-white font-light mb-8 drop-shadow-lg"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {titleStart && <span>{titleStart} </span>}
          {titleItalic && <span className=" italic text-gold-400 drop-shadow">{titleItalic}</span>}
          {titleEnd && <span> {titleEnd}</span>}
        </h1>

        {description && (
          <p className="max-w-2xl mx-auto text-white/70 font-light leading-relaxed text-sm md:text-base drop-shadow">
            {description}
          </p>
        )}

        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="block w-16 h-px bg-gold-400/50" />
          <span className="block w-2 h-2 rounded-full bg-gold-400/60" />
          <span className="block w-16 h-px bg-gold-400/50" />
        </div>
      </motion.div>
    </header>
  );
};

export default PageHeader;
