import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedServices = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h3 className="text-gold-500 uppercase tracking-[0.3em] text-sm font-semibold mb-3">
              Curated Treatments
            </h3>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Signature <span className="italic">Services</span>
            </h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-medium text-neutral-900 border-b border-neutral-300 pb-1 hover:border-gold-500 hover:text-gold-500 transition-colors">
            View All Palette <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Bridal Makeup",
              desc: "Complete traditional makeover ensuring you shine impeccably on your special day.",
              img: "/images/offer-deal-1.jpg",
              price: "₹15,000"
            },
            {
              title: "Luxury Facial",
              desc: "Deep cleansing facial that nourishes skin to improve glow and reduce dullness.",
              img: "/images/offer-deal-3.jpg",
              price: "₹1,800"
            },
            {
              title: "Hair Spa Ritual",
              desc: "Relaxing treatment repairing damaged hair, nourishing the scalp to restore silly shine.",
              img: "/images/image_4.jpg",
              price: "₹1,500"
            }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-sm">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-neutral-900 z-20">
                  {service.price}
                </div>
              </div>
              <h4 className="text-xl text-neutral-900 mb-2 font-light" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{service.title}</h4>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">{service.desc}</p>
              <Link to="/appointments" className="text-xs uppercase tracking-widest text-gold-600 font-bold group-hover:text-neutral-900 transition-colors mt-auto inline-block">
                Book Now →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
