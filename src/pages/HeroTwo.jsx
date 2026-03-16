import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const heroTwoData = {
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
};

const HeroTwo = () => {
    const { scrollYProgress } = useScroll();
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-900">

            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{ y: yBg }}
            >
                <img
                    src={heroTwoData.imageSrc}
                    alt={heroTwoData.imageAlt}
                    className="w-full h-full object-cover scale-110"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)]"></div>
            </motion.div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                >

                    <div className="inline-flex items-center gap-2 px-5 py-2 border border-white/20 rounded-full backdrop-blur-lg bg-white/10 text-white text-xs uppercase tracking-[0.25em] mb-8 shadow-lg">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        {heroTwoData.badgeText}
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-light text-white leading-[1.15] tracking-tight mb-8"
                        style={{ fontFamily: "Playfair Display, serif" }}
                    >
                        <span className="block drop-shadow-md">
                            {heroTwoData.titleMain}
                        </span>

                        <span className="relative inline-block italic mt-2">

                            <span className="italic text-gold-300 font-serif">
                            </span>

                            
                            <span className="relative text-gold-400 bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-[#c7a75b] drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]">
                                {heroTwoData.titleHighlight}
                            </span>

                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-white/85 font-light mb-12 max-w-2xl leading-relaxed">
                        {heroTwoData.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">

                        {heroTwoData.actions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.url}
                                className={`group flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold rounded-full transition-all duration-300 ${action.variant === "primary"
                                        ? "bg-gold-500 text-white hover:bg-gold-400 shadow-lg hover:shadow-gold-500/30"
                                        : "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black"
                                    }`}
                            >
                                {action.label}

                                {action.variant === "primary" && (
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                )}
                            </Link>
                        ))}

                    </div>

                </motion.div>

            </div>

        </section>
    );
};

export default HeroTwo;