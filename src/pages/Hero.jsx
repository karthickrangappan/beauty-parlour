import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const heroData = {
    backgroundImg: "/images/bg_3.jpg",
    backgroundAlt: "Luxury Spa Background",
    badgeText: "The Art of Radiance",
    titleMain: "Awaken Your ",
    titleHighlight: "Purest Essence",
    description: "Step into a sun-drenched sanctuary of calm. We blend traditional beauty rituals with modern perfection to reveal your natural glow.",
    actions: [
        {
            label: "Reserve a Moment",
            url: "/appointments",
            variant: "primary"
        },
        {
            label: "Explore Services",
            url: "/services",
            variant: "secondary"
        }
    ],
    scrollIndicator: "Scroll"
};

const Hero = () => {
    const { scrollYProgress } = useScroll();
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ y: yBg }}
          >
            <img
              src={heroData.backgroundImg}
              alt={heroData.backgroundAlt}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-neutral-900/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-white" />
            </motion.div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm bg-white/10 text-white/90 text-xs font-medium uppercase tracking-[0.2em] mb-8"
                >
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>{heroData.badgeText}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg"
                    style={{ fontFamily: "ui-serif, Georgia, serif" }}
                >
                    {heroData.titleMain} <br className="hidden md:block" />
                    <span className="italic text-gold-300 font-serif">{heroData.titleHighlight}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-lg md:text-xl text-white/80 max-w-2xl font-light mb-12 drop-shadow-md"
                >
                    {heroData.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    {heroData.actions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.url}
                            className={`px-8 py-4 transition-all duration-300 ease-in-out text-sm uppercase tracking-[0.15em] font-medium ${action.variant === "primary"
                                    ? "bg-neutral-900 text-white hover:bg-gold-500 rounded-full hover:text-white"
                                    : "bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-neutral-900"
                                }`}
                        >
                            {action.label}
                        </Link>
                    ))}
                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3">{heroData.scrollIndicator}</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
                />
            </motion.div>
        </section>
    );
};

export default Hero;
