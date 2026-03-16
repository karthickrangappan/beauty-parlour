import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const HeartIcon = () => (
  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 text-gold-400">
    <Star className="w-6 h-6" />
  </div>
);

const CtaSection = () => {
  return (
    <section className="py-32 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
          <img src="/images/intro.jpg" alt="Book Appointment Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-900/70" />
      </div>
      
      <div className="relative z-10 text-center max-w-3xl px-6">
         <HeartIcon />
         <h2 className="text-4xl md:text-6xl text-white font-light mb-8 mt-6" style={{ fontFamily: "ui-serif, Georgia, serif" }}>Ready to reveal your radiance?</h2>
         <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Join us for a personalized consultation and allow us to tailor a beauty ritual exclusively for you.</p>
         <Link to="/appointments" className="bg-gold-500 text-white px-10 py-5 rounded-full hover:bg-gold-400 shadow-lg hover:shadow-gold-500/30">
            Schedule Your Visit
         </Link>
      </div>
    </section>
  );
};

export default CtaSection;
