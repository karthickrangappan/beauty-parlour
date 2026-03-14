import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 pt-24 pb-12 relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-gold-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        

        <div className="col-span-1 md:col-span-4 space-y-6">
          <Link to="/" className="text-3xl text-gold-300 tracking-widest uppercase font-light inline-block" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            Lumière
          </Link>
          <p className="text-neutral-400 font-light leading-relaxed pr-8">
            An elevated sanctuary dedicated to the meticulous art of radiant beauty.
            A calm escape for skin and soul.
          </p>
          <div className="flex items-center gap-6 pt-4">
            {['Instagram', 'Facebook', 'Pinterest'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-xs uppercase tracking-widest text-gold-500 hover:text-gold-300 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>


        <div className="col-span-1 md:col-span-2 md:col-start-7 space-y-6 flex flex-col">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Explore</h4>
          <Link to="/shop" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">The Collection</Link>
          <Link to="/services" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">Sanctuary Services</Link>
          <Link to="/about" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">Our Story</Link>
          <Link to="/appointments" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">Appointments</Link>
        </div>


        <div className="col-span-1 md:col-span-2 space-y-6 flex flex-col">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Client Care</h4>
          <Link to="/faq" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">FAQ</Link>
          <Link to="/shipping" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">Shipping & Returns</Link>
          <Link to="/contact" className="text-neutral-400 hover:text-gold-300 transition-colors font-light">Contact</Link>
        </div>


        <div className="col-span-1 md:col-span-2 space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">The Newsletter</h4>
          <p className="text-neutral-400 text-sm font-light">
            Receive exclusive invitations and updates on our latest elixirs.
          </p>
          <form className="relative mt-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="w-full bg-transparent border-b border-neutral-700 pb-3 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-600 font-light"
            />
            <button 
              type="submit"
              className="absolute right-0 bottom-3 text-gold-500 hover:text-gold-300 transition-colors"
            >
              →
            </button>
          </form>
        </div>
        
      </div>


      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-neutral-500 text-xs font-light">
          © {new Date().getFullYear()} Lumière. All rights reserved.
        </p>
        <div className="flex gap-6 text-neutral-500 text-xs font-light">
          <Link to="/privacy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gold-300 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
