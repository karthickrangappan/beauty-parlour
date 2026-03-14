import React from "react";
import { motion } from "framer-motion";

const Services = () => {
    const services = [
        {
            title: "Bridal Makeup",
            desc: "Complete traditional bridal makeover including HD makeup, hairstyling, saree draping and accessories styling to make you shine on your special day.",
            price: "₹15,000",
            time: "180 Min",
            img: "https://images.unsplash.com/photo-1604908812095-5d8a3f0d1f5c"
        },
        {
            title: "Party Makeup",
            desc: "Glamorous party makeup with flawless foundation, eye makeup, hairstyling and finishing touches perfect for receptions and special events.",
            price: "₹3,500",
            time: "90 Min",
            img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
        },
        {
            title: "Facial Treatment",
            desc: "Deep cleansing facial treatment that nourishes your skin, improves glow and reduces dullness using premium herbal products.",
            price: "₹1,800",
            time: "60 Min",
            img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15"
        },
        {
            title: "Mehendi Design",
            desc: "Beautiful traditional and Arabic mehendi designs for weddings, festivals and special occasions applied with natural henna.",
            price: "₹2,000",
            time: "120 Min",
            img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30"
        },
        {
            title: "Hair Spa",
            desc: "Relaxing hair spa treatment that repairs damaged hair, nourishes the scalp and restores silky smooth shine.",
            price: "₹1,500",
            time: "60 Min",
            img: "https://images.unsplash.com/photo-1562322140-8baeececf3df"
        },
        {
            title: "Threading & Eyebrows",
            desc: "Professional eyebrow shaping and facial threading to give your face a clean and well-defined look.",
            price: "₹200",
            time: "20 Min",
            img: "https://images.unsplash.com/photo-1621784564114-6eea05b89863"
        },
        {
            title: "Manicure & Pedicure",
            desc: "Complete nail care service including nail shaping, cuticle care, massage and polish for healthy and beautiful hands and feet.",
            price: "₹900",
            time: "45 Min",
            img: "https://images.unsplash.com/photo-1604654894610-df63bc536371"
        },
        {
            title: "Hair Styling",
            desc: "Trendy hair styling for weddings, parties and photoshoots including curls, braids and elegant updos.",
            price: "₹1,200",
            time: "40 Min",
            img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
        }
    ];


    return (
        <section className="min-h-screen bg-[#fdf8f3] pt-32 pb-28">

            <div className="max-w-4xl mx-auto text-center px-6 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <p className="uppercase tracking-[0.4em] text-xs text-[#c8a96a] mb-5">
                        Curated Offerings
                    </p>

                    <h1
                        className="text-5xl md:text-6xl text-neutral-800 font-light"
                        style={{ fontFamily: "Playfair Display, serif" }}
                    >
                        Sanctuary Services
                    </h1>

                    <div className="w-16 h-[2px] bg-[#c8a96a] mx-auto mt-8" />
                </motion.div>
            </div>



            <div className="max-w-6xl mx-auto px-6 space-y-20">

                {services.map((service, index) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                    >


                        <div className="relative overflow-hidden rounded-xl shadow-xl group">

                            <img
                                src={`${service.img}?q=80&w=1200&auto=format&fit=crop`}
                                alt={service.title}
                                className="w-full h-[420px] object-cover transition duration-[2000ms] group-hover:scale-110"
                            />


                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40"></div>
                        </div>



                        <div>

                            <div className="flex justify-between items-end border-b border-[#e6d7b8] pb-4 mb-6">

                                <h3
                                    className="text-3xl md:text-4xl text-neutral-800 font-light"
                                    style={{ fontFamily: "Playfair Display, serif" }}
                                >
                                    {service.title}
                                </h3>

                                <span className="text-[#c8a96a] text-lg  font-medium tracking-wider">
                                    {service.price}
                                </span>

                            </div>


                            <p className="text-neutral-600 leading-relaxed mb-8">
                                {service.desc}
                            </p>


                            <div className="flex items-center gap-8">

                                <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                                    {service.time}
                                </span>

                                <button className="px-6 py-3 text-xs uppercase tracking-widest rounded-full  border border-[#c8a96a] text-[#c8a96a] hover:bg-[#c8a96a] hover:text-white transition-all duration-300">
                                    Book Appointment
                                </button>

                            </div>

                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Services;