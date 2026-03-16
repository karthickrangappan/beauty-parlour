import React, { useState, useEffect, useRef } from 'react';
import { fmtCurrency } from '../constants/config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
            setSearchQuery(''); 
        }
    }, [isOpen]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        const searchProducts = async () => {
            try {
                const q = query(
                    collection(db, 'products'),
                    where('isActive', '==', true)
                );
                const snapshot = await getDocs(q);
                const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                const lowerQuery = debouncedQuery.toLowerCase();
                const matched = allProducts.filter(p =>
                    p.name?.toLowerCase().includes(lowerQuery) ||
                    p.category?.toLowerCase().includes(lowerQuery) ||
                    p.shortDesc?.toLowerCase().includes(lowerQuery) ||
                    (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery)))
                ).slice(0, 5);

                setResults(matched);
            } catch (err) {
                console.error('Search error', err);
                setResults([]);
            }
        };

        searchProducts();
    }, [debouncedQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        saveRecentSearch(searchQuery.trim());
        onClose();
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    const handleResultClick = (product) => {
        saveRecentSearch(product.name);
        onClose();
        navigate(`/product/${product.id}`);
    };

    const saveRecentSearch = (searchTerm) => {
        let updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)];
        updatedSearches = updatedSearches.slice(0, 5); 
        setRecentSearches(updatedSearches);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-cream-50/95 backdrop-blur-xl flex justify-center pt-20 md:pt-32 px-4 md:px-6 overflow-y-auto"
                >
                    <div className="w-full max-w-4xl">
                        
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-neutral-500 font-medium" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Discover</h2>
                           <button onClick={onClose} className="p-2 text-neutral-800 hover:text-gold-500 transition-colors">
                               <X className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                           </button>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="relative mb-12">
                            <input 
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, treatments..."
                                className="w-full bg-transparent border-b-2 border-neutral-300 pb-2 md:pb-3 text-xl md:text-4xl lg:text-4xl font-light text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300"
                                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
                            />
                            <button type="submit" className="absolute right-0 bottom-4 md:bottom-6 text-neutral-400 hover:text-gold-500 transition-colors">
                                <Search className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            
                            <div className="md:col-span-8">
                                {searchQuery.trim() === '' ? (
                                    <div className="space-y-6 opacity-60">
                                        <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Trending Searches</h3>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {['Cleansers', 'Serums', 'Treatments', 'rose water'].map(term => (
                                                <button 
                                                    key={term}
                                                    onClick={() => setSearchQuery(term)}
                                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/50 border border-neutral-200 text-[9px] md:text-xs uppercase tracking-widest text-neutral-600 hover:border-gold-500 hover:text-gold-600 transition-colors rounded-full"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-6">Top Matches ({results.length})</h3>
                                        
                                        {results.length > 0 ? (
                                            <div className="space-y-4">
                                                <AnimatePresence>
                                                    {results.map((product, idx) => (
                                                        <motion.div 
                                                            key={product.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            onClick={() => handleResultClick(product)}
                                                            className="flex items-center gap-4 md:gap-6 p-3 md:p-4 bg-white hover:shadow-lg hover:shadow-gold-300/10 border border-transparent hover:border-gold-300/30 transition-all cursor-pointer group rounded-sm"
                                                        >
                                                            <div className="w-12 h-16 md:w-16 md:h-20 bg-neutral-100 overflow-hidden flex-shrink-0">
                                                                <img src={product.image} alt={product.name} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-xs md:text-sm uppercase tracking-widest text-neutral-800 font-medium mb-1 group-hover:text-gold-600 transition-colors">{product.name}</h4>
                                                                <p className="text-[9px] md:text-[10px] text-neutral-400 font-serif italic mb-1 md:mb-2">{product.category}</p>
                                                                <p className="text-[10px] md:text-xs text-neutral-500 line-clamp-1">{product.shortDesc}</p>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end gap-1 md:gap-2 pl-2 md:pl-4">
                                                                <p className="text-xs md:text-sm font-medium text-neutral-900">{fmtCurrency(product.price)}</p>
                                                                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-neutral-300 group-hover:text-gold-500 transition-colors" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-neutral-400 italic font-serif">
                                                No matches found for "{debouncedQuery}".
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-4 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-neutral-200/50 pt-8 md:pt-0 mb-12 md:mb-0">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Recent Searches
                                    </h3>
                                    {recentSearches.length > 0 && (
                                        <button onClick={clearRecentSearches} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 transition-colors">Clear</button>
                                    )}
                                </div>
                                
                                {recentSearches.length > 0 ? (
                                    <ul className="space-y-4">
                                        {recentSearches.map((term, idx) => (
                                            <li key={idx}>
                                                <button 
                                                    onClick={() => setSearchQuery(term)}
                                                    className="text-sm text-neutral-600 hover:text-gold-600 transition-colors flex items-center justify-between w-full text-left"
                                                >
                                                    <span>{term}</span>
                                                    <Search className="w-3 h-3 opacity-50" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-neutral-400 italic font-serif">Your recent searches will appear here.</p>
                                )}
                            </div>

                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
