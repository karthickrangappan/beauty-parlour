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
    <footer className="bg-neutral-900 pt-24 pb-12 relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-gold-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        

        <div className="col-span-1 md:col-span-4 space-y-6">
          <Link to="/" className="text-3xl text-gold-300 tracking-widest uppercase font-light inline-block" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            {footerData.brand.name}
          </Link>
          <p className="text-neutral-400 font-light leading-relaxed pr-8">
            {footerData.brand.description}
          </p>
          <div className="flex items-center gap-6 pt-4">
            {footerData.socialLinks.map((social) => (
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
          {footerData.exploreLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-neutral-400 hover:text-gold-300 transition-colors font-light">
              {link.name}
            </Link>
          ))}
        </div>


        <div className="col-span-1 md:col-span-2 space-y-6 flex flex-col">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Client Care</h4>
          {footerData.clientCareLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-neutral-400 hover:text-gold-300 transition-colors font-light">
              {link.name}
            </Link>
          ))}
        </div>


        <div className="col-span-1 md:col-span-2 space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">{footerData.newsletter.title}</h4>
          <p className="text-neutral-400 text-sm font-light">
            {footerData.newsletter.description}
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
          © {new Date().getFullYear()} {footerData.brand.name}. All rights reserved.
        </p>
        <div className="flex gap-6 text-neutral-500 text-xs font-light">
          {footerData.legalLinks.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-gold-300 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
