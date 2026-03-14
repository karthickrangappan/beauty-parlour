import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products'; // we'll use local products for mock search

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Initialize recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                setRecentSearches([]);
            }
        }
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
            setQuery(''); // Reset query on open
        }
    }, [isOpen]);

    // Debounce Logic (300ms)
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timerId);
    }, [query]);

    // Perform Search
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = debouncedQuery.toLowerCase();
        
        // Advanced client side filtering mimicking full-text Algolia
        const matched = products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.shortDesc.toLowerCase().includes(lowerQuery) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery)))
        ).slice(0, 5); // Return top 5 matches as requested

        setResults(matched);

    }, [debouncedQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        saveRecentSearch(query.trim());
        onClose();
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    };

    const handleResultClick = (product) => {
        saveRecentSearch(product.name);
        onClose();
        navigate(`/product/${product.id}`);
    };

    const saveRecentSearch = (searchTerm) => {
        let updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)];
        updatedSearches = updatedSearches.slice(0, 5); // keep max 5
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-cream-50/95 backdrop-blur-xl flex justify-center pt-24 md:pt-32 px-6"
                >
                    <div className="w-full max-w-4xl">
                        
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-sm uppercase tracking-widest text-neutral-500 font-medium" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Discover</h2>
                           <button onClick={onClose} className="p-2 text-neutral-800 hover:text-gold-500 transition-colors">
                               <X className="w-6 h-6 stroke-[1.5]" />
                           </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative mb-12">
                            <input 
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, treatments, or ingredients..."
                                className="w-full bg-transparent border-b-2 border-neutral-300 pb-6 text-2xl md:text-4xl lg:text-5xl font-light text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300"
                                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
                            />
                            <button type="submit" className="absolute right-0 bottom-6 text-neutral-400 hover:text-gold-500 transition-colors">
                                <Search className="w-8 h-8 stroke-[1.5]" />
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            
                            {/* Suggestions / Results Panel */}
                            <div className="md:col-span-8">
                                {query.trim() === '' ? (
                                    <div className="space-y-6 opacity-60">
                                        <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Trending Searches</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {['Silk Facial', 'Vitamin C Serum', 'Bridal Package', 'Rose Water', 'Exfoliant'].map(term => (
                                                <button 
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="px-4 py-2 bg-white/50 border border-neutral-200 text-xs uppercase tracking-widest text-neutral-600 hover:border-gold-500 hover:text-gold-600 transition-colors rounded-full"
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
                                                            className="flex items-center gap-6 p-4 bg-white hover:shadow-lg hover:shadow-gold-300/10 border border-transparent hover:border-gold-300/30 transition-all cursor-pointer group rounded-sm"
                                                        >
                                                            <div className="w-16 h-20 bg-neutral-100 overflow-hidden flex-shrink-0">
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-sm uppercase tracking-widest text-neutral-800 font-medium mb-1 group-hover:text-gold-600 transition-colors">{product.name}</h4>
                                                                <p className="text-[10px] text-neutral-400 font-serif italic mb-2">{product.category}</p>
                                                                <p className="text-xs text-neutral-500 line-clamp-1">{product.shortDesc}</p>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end gap-2 pl-4">
                                                                <p className="text-sm font-medium text-neutral-900">${product.price}</p>
                                                                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-gold-500 transition-colors" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-neutral-400 italic font-serif">
                                                No matches found for "{query}".
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Recent Searches Panel */}
                            <div className="md:col-span-4 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-neutral-200/50 pt-8 md:pt-0">
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
                                                    onClick={() => setQuery(term)}
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
