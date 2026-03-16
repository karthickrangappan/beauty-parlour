import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const footerData = {
  brand: {
    name: "Lumière",
    description: "An elevated sanctuary dedicated to the meticulous art of radiant beauty. A calm escape for skin and soul.",
  },
  socialLinks: ['Instagram', 'Facebook', 'Pinterest'],
  exploreLinks: [
    { name: "The Collection", path: "/shop" },
    { name: "Sanctuary Services", path: "/services" },
    { name: "Our Story", path: "/about" },
    { name: "Appointments", path: "/appointments" }
  ],
  clientCareLinks: [
    { name: "FAQ", path: "/faq" },
    { name: "Shipping & Returns", path: "/shipping" },
    { name: "Contact", path: "/contact" }
  ],
  newsletter: {
    title: "The Newsletter",
    description: "Receive exclusive invitations and updates on our latest elixirs."
  },
  legalLinks: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" }
  ]
};

const Footer = () => {
  return (
    <footer className="bg-cream-50/95 pt-24 pb-12 relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-gold-500/20 to-transparent hidden md:block" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="text-3xl sm:text-4xl text-gold-300 tracking-[0.2em] uppercase font-light inline-block" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
              {footerData.brand.name}
            </Link>
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm lg:pr-8 text-sm sm:text-base">
              {footerData.brand.description}
            </p>
            <div className="flex items-center gap-6 pt-2">
              {footerData.socialLinks.map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gold-500 hover:text-gold-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-white text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold">Explore</h4>
              <nav className="flex flex-col gap-4">
                {footerData.exploreLinks.map(link => (
                  <Link key={link.name} to={link.path} className="text-neutral-500 hover:text-gold-300 transition-colors font-light text-sm sm:text-base">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold">Client Care</h4>
              <nav className="flex flex-col gap-4">
                {footerData.clientCareLinks.map(link => (
                  <Link key={link.name} to={link.path} className="text-neutral-500 hover:text-gold-300 transition-colors font-light text-sm sm:text-base">
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 sm:col-span-2 lg:col-start-10">
            <h4 className="text-white text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold">{footerData.newsletter.title}</h4>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              {footerData.newsletter.description}
            </p>
            <form className="relative group pt-2">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-transparent border-b border-neutral-800 pb-3 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-700 font-light"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-3 text-gold-500 hover:text-gold-300 transition-transform group-focus-within:translate-x-1"
              >
                <span className="text-lg">→</span>
              </button>
            </form>
          </div>
          
        </div>

        <div className="mt-20 sm:mt-24 pt-8 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
          <p className="text-neutral-600 text-[10px] sm:text-xs font-light tracking-wide order-2 sm:order-1">
            © {new Date().getFullYear()} {footerData.brand.name}. Crafted for timeless elegance.
          </p>
          <div className="flex gap-6 sm:gap-8 text-neutral-500 text-[10px] sm:text-xs font-light tracking-widest uppercase order-1 sm:order-2">
            {footerData.legalLinks.map(link => (
              <Link key={link.name} to={link.path} className="hover:text-gold-300 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
