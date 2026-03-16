import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const navBackground = isScrolled || !isHome
    ? 'bg-cream-50/95 backdrop-blur-md shadow-sm  border-gold-300/20'
    : 'bg-transparent ';
  const textColor = isScrolled || !isHome ? 'text-neutral-800' : 'text-neutral-800 lg:text-white';

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${navBackground}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 lg:h-24 flex items-center justify-between">

          <div className="flex-1 flex  items-center justify-start">
            <button
              className={`lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-black/5 transition-colors ${textColor}`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </button>

            <Link to="/" className="hidden lg:block text-2xl lg:text-3xl tracking-widest uppercase font-light">
              <span
                className={`block transition-colors duration-500 ${isScrolled || !isHome ? 'text-gold-500' : 'text-gold-300'}`}
                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
              >
                Lumière
              </span>
            </Link>
          </div>

          <div className="flex-1 text  flex items-center pr-3 justify-center">
            <Link to="/" className="lg:hidden text-xl sm:text-2xl tracking-widest uppercase font-light">
              <span
                className={`block transition-colors duration-500 ${isScrolled || !isHome ? 'text-gold-500' : 'text-gold-300'}`}
                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
              >
                Lumière
              </span>
            </Link>

            <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm tracking-[0.15em] uppercase hover:text-gold-500 transition-colors ${location.pathname === link.path ? 'text-gold-500' : textColor
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className={`flex items-center gap-1.5 sm:gap-2.5 lg:gap-4 ${textColor}`}>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 rounded-lg hover:text-gold-500 hover:bg-black/5 transition-all"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
              </button>

              <Link to="/wishlist" className="p-1.5 rounded-lg hover:text-gold-500 hover:bg-black/5 transition-all relative" aria-label="Wishlist">
                <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-400 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="p-1.5 rounded-lg hover:text-gold-500 hover:bg-black/5 transition-all relative" aria-label="Cart">
                <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-gold-400 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to={user ? '/profile' : '/auth/login'}
                className="p-1.5 rounded-lg hover:text-gold-500 hover:bg-black/5 transition-all relative"
                title={user ? user.displayName || 'Profile' : 'Sign In'}
                aria-label="Profile"
              >
                <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
                {user && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full ring-1 ring-white/80" />
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="p-1.5 rounded-lg hover:text-gold-500 hover:bg-black/5 transition-all hidden lg:flex items-center"
                  title="Admin Portal"
                  aria-label="Admin"
                >
                  <LayoutDashboard className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
                </Link>
              )}

              
            </div>
          </div>

        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[59] bg-neutral-900/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[60] w-[78vw] max-w-[300px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl tracking-widest uppercase font-light text-gold-500"
                  style={{ fontFamily: 'ui-serif, Georgia, serif' }}
                >
                  Lumière
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-neutral-500 hover:text-gold-500 transition-colors rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <div className="flex flex-col">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + idx * 0.06, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center py-3.5 text-sm tracking-[0.2em] uppercase font-light border-b border-neutral-100 transition-colors ${location.pathname === link.path
                            ? 'text-gold-500'
                            : 'text-neutral-600 hover:text-gold-500'
                          }`}
                      >
                        {link.name}
                        {location.pathname === link.path && (
                          <span className="ml-auto w-1 h-1 rounded-full bg-gold-400" />
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + navLinks.length * 0.06 }}
                  >
                    <Link
                      to={user ? '/profile' : '/auth/login'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-3.5 text-sm tracking-[0.2em] uppercase font-light border-b border-neutral-100 text-neutral-600 hover:text-gold-500 transition-colors"
                    >
                      <User className="w-4 h-4 stroke-[1.5]" />
                      {user ? 'My Profile' : 'Sign In'}
                    </Link>
                  </motion.div>

                  {isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + (navLinks.length + 1) * 0.06 }}
                    >
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-3.5 text-sm tracking-[0.2em] uppercase font-light text-gold-500 hover:text-gold-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 stroke-[1.5]" />
                        Admin Portal
                      </Link>
                    </motion.div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
