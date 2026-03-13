import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Is it the home page? We want transparent navbar on home page top.
  const isHome = location.pathname === '/';
  const navBackground = isScrolled || !isHome ? 'bg-cream-50/90 backdrop-blur-md shadow-sm border-b border-gold-300/20' : 'bg-transparent';
  const textColor = isScrolled || !isHome ? 'text-neutral-800' : 'text-neutral-800 md:text-white';

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Our Story', path: '/about' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${navBackground}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 -ml-2 ${textColor}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Navigation Links - Left (Desktop only) */}
          <div className="hidden md:flex flex-1 items-center gap-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm tracking-[0.15em] uppercase hover:text-gold-500 transition-colors ${textColor}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex-1 md:flex-none flex justify-center">
            <Link to="/" className="text-2xl md:text-3xl tracking-widest uppercase font-light text-center">
              <span className={`block transition-colors duration-500 ${isScrolled || !isHome ? 'text-gold-500' : 'text-gold-300'}`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Lumière
              </span>
            </Link>
          </div>

          {/* Navigation Links & Icons - Right */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.slice(2, 4).map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm tracking-[0.15em] uppercase hover:text-gold-500 transition-colors ${textColor}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className={`flex items-center gap-4 ${textColor}`}>
              <button className="hover:text-gold-500 transition-colors">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <Link to="/wishlist" className="hover:text-gold-500 transition-colors relative">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blush-200 text-neutral-800 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link to="/auth/login" className="hover:text-gold-500 transition-colors">
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>
              <Link to="/cart" className="hover:text-gold-500 transition-colors relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gold-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cream-50/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <span className="text-2xl tracking-widest uppercase font-light text-gold-500" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Lumière
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-800 hover:text-gold-500 transition-colors"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl tracking-[0.2em] uppercase text-neutral-800 hover:text-gold-500 transition-colors font-light"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
