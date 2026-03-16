import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import ProductCard from '../ProductCard';
import ProductQuickView from '../ProductQuickView';
import { useInfiniteProducts } from '../../utils/useInfiniteProducts';

const RecentlyAddedProducts = () => {
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);

    // useInfiniteProducts orders by createdAt desc by default
    const { products, loading } = useInfiniteProducts({
        collectionId: 'all'
    });

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setIsQuickViewOpen(true);
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Artistic Background Elements */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gold-200/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] uppercase tracking-[0.2em] font-black mb-6">
                            <Clock className="w-3.5 h-3.5" />
                            Freshly Arrived
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                            Latest <span className="italic text-gold-500">Revelations</span>
                        </h2>
                        <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl">
                            Be the first to experience our newest laboratory-refined elixirs, freshly added to our sanctuary collection.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/shop" className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-neutral-900 border-b border-neutral-200 pb-2 hover:border-black transition-all duration-500">
                            Discover All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
                    {loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-neutral-100 rounded-2xl mb-6 shadow-sm shadow-black/5" />
                                <div className="space-y-3 px-4 text-center">
                                    <div className="h-3 bg-neutral-100 w-1/3 rounded-full mx-auto" />
                                    <div className="h-4 bg-neutral-100 w-2/3 rounded-full mx-auto" />
                                    <div className="h-3 bg-neutral-100 w-1/4 rounded-full mx-auto" />
                                </div>
                            </div>
                        ))
                    ) : (
                        products.slice(0, 4).map((product, idx) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                index={idx} 
                                onQuickView={() => handleQuickView(product)}
                            />
                        ))
                    )}
                </div>
            </div>

            <ProductQuickView 
                product={selectedProduct} 
                isOpen={isQuickViewOpen} 
                onClose={() => setIsQuickViewOpen(false)} 
            />
        </section>
    );
};

export default RecentlyAddedProducts;
