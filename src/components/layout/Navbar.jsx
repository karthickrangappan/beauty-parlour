import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, Heart } from "lucide-react";
import { SlCalender } from "react-icons/sl";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import SearchOverlay from "./SearchOverlay";

const navbarData = {
  brandName: "Lumière",
  links: [
    { name: "Shop", path: "/shop" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" }
  ]
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  const navBackground =
    isScrolled || !isHome
      ? "bg-cream-50/90 backdrop-blur-lg shadow-sm border-gold-200/20"
      : "bg-transparent";

  const textColor =
    isScrolled || !isHome
      ? "text-neutral-800"
      : "text-neutral-800 md:text-white";

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${navBackground}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 lg:flex-1">
            <button
              className={`lg:hidden p-2 -ml-2 ${textColor}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <Link
              to="/"
              className="text-xl sm:text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.25em] uppercase font-light"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              <span
                className={`transition-colors duration-500 ${
                  isScrolled || !isHome ? "text-gold-500" : "text-gold-300"
                }`}
              >
                {navbarData.brandName}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 lg:gap-8 xl:gap-12 w-full">
            {navbarData.links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs xl:text-sm tracking-[0.15em] xl:tracking-[0.18em] uppercase font-medium hover:text-gold-500 transition-colors ${textColor}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className={`flex items-center justify-end gap-2 sm:gap-4 md:gap-5 lg:flex-1 ${textColor}`}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-gold-500 transition p-1"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <Link to="/wishlist" className="relative hover:text-gold-500 transition p-1">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-1 md:-right-2 bg-blush-200 text-neutral-800 text-[9px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-gold-500 transition p-1">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-1 md:-right-2 bg-gold-400 text-white text-[9px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to="/auth/login" className="hover:text-gold-500 transition p-1">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </Link>

            <Link to="/appointments" className="hover:text-gold-500 transition p-1 hidden sm:block">
              <SlCalender className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cream-50/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <span
                className="text-xl tracking-widest uppercase text-gold-500"
                style={{ fontFamily: "ui-serif, Georgia, serif" }}
              >
                {navbarData.brandName}
              </span>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-800 hover:text-gold-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navbarData.links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl tracking-[0.2em] uppercase text-neutral-800 hover:text-gold-500 transition"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;