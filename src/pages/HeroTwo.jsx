import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const heroSlides = [
    {
        badgeText: "Bespoke Treatments",
        titleMain: "Refined",
        titleHighlight: "Elegance",
        description:
            "Immerse yourself in a world where time stands still. Our signature treatments are designed to rejuvenate your body, mind, and soul in the most luxurious setting.",
        imageSrc: "/images/bg_3.jpg",
        imageAlt: "Luxurious Treatment Room",
        actions: [
            {
                label: "Book Your Journey",
                url: "/appointments",
                variant: "primary"
            },
            {
                label: "Our Philosophy",
                url: "/about",
                variant: "secondary"
            }
        ]
    },
    {
        badgeText: "Botanical Radiance",
        titleMain: "Pure",
        titleHighlight: "Illumination",
        description:
            "Discover the potency of Earth's finest extracts. Our botanical-infused skincare rituals reveal your skin's natural glow with scientific precision and natural grace.",
        imageSrc: "/images/hero_skincare.png",
        imageAlt: "Premium Skincare Ritual",
        actions: [
            {
                label: "Explore Skincare",
                url: "/shop",
                variant: "primary"
            },
            {
                label: "View Services",
                url: "/services",
                variant: "secondary"
            }
        ]
    },
    {
        badgeText: "Crowning Glory",
        titleMain: "Exquisite",
        titleHighlight: "Artistry",
        description:
            "Elevate your tresses with our master stylists. From precision cuts to transformative treatments, we craft hair that speaks of sophistication and effortless beauty.",
        imageSrc: "/images/hero_haircare.png",
        imageAlt: "Luxury Hair Treatment",
        actions: [
            {
                label: "Hair Rituals",
                url: "/services",
                variant: "primary"
            },
            {
                label: "Book Stylist",
                url: "/appointments",
                variant: "secondary"
            }
        ]
    }
];

const HeroTwo = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-neutral-900">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                speed={1000}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.hero-pagination',
                }}
                navigation={{
                    nextEl: '.hero-next',
                    prevEl: '.hero-prev',
                }}
                className="w-full h-full"
            >
                {heroSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Background Image with Ken Burns Effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.img
                                    src={slide.imageSrc}
                                    alt={slide.imageAlt}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1.15 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 7, ease: "easeOut" }}
                                />
                                {/* Overlays */}
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/30 rounded-full backdrop-blur-md bg-white/5 text-white text-[10px] uppercase tracking-[0.3em] mb-6 shadow-2xl">
                                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                                        {slide.badgeText}
                                    </div>

                                    <h1
                                        className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[1.1] tracking-tight mb-8"
                                        style={{ fontFamily: "Playfair Display, serif" }}
                                    >
                                        <span className="block mb-2">{slide.titleMain}</span>
                                        <span className="italic text-gold-400 drop-shadow-2xl">
                                            {slide.titleHighlight}
                                        </span>
                                    </h1>

                                    <p className="text-sm md:text-lg text-white/80 font-light max-w-2xl mb-12 leading-relaxed">
                                        {slide.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                                        {slide.actions.map((action, actionIdx) => (
                                            <Link
                                                key={actionIdx}
                                                to={action.url}
                                                className={`group relative overflow-hidden px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-500 ${
                                                    action.variant === "primary"
                                                        ? "bg-gold-500 text-white hover:bg-gold-400 shadow-xl shadow-gold-500/20"
                                                        : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-neutral-900"
                                                }`}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {action.label}
                                                    {action.variant === "primary" && (
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                    )}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
                    <button className="hero-prev w-12 h-12 flex items-center justify-center text-white/50 hover:text-gold-400 border border-white/20 hover:border-gold-400 rounded-full transition-all duration-300">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="hero-pagination flex items-center gap-3"></div>
                    
                    <button className="hero-next w-12 h-12 flex items-center justify-center text-white/50 hover:text-gold-400 border border-white/20 hover:border-gold-400 rounded-full transition-all duration-300">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </Swiper>

            <style dangerouslySetInnerHTML={{ __html: `
                .hero-pagination .swiper-pagination-bullet {
                    width: 4px;
                    height: 4px;
                    background: white;
                    opacity: 0.3;
                    transition: all 0.3s ease;
                    border-radius: 0;
                }
                .hero-pagination .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #d4af37;
                    transform: scale(2);
                }
            ` }} />
        </section>
    );
};

export default HeroTwo;
