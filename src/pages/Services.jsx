import React from "react";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      title: "Signature Silk Facial",
      desc: "A meticulous 90-minute journey restoring the skin barrier with pearl extracts, finished with a cooling silk compress that leaves skin luminous and renewed.",
      price: "$150",
      time: "90 Min",
      img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15"
    },
    {
      title: "Golden Hour Body Polish",
      desc: "A luxurious full-body exfoliation using crushed amber and Moroccan oil that melts away tension while revealing radiant, glowing skin.",
      price: "$210",
      time: "120 Min",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
    },
    {
      title: "Botanical Hair Revival",
      desc: "A relaxing scalp ritual followed by a steam-infused botanical hair mask designed to strengthen, nourish and restore silky shine.",
      price: "$95",
      time: "60 Min",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
    }
  ];

  return (
    <section className="min-h-screen bg-[#fdf8f3] pt-32 pb-28">

      {/* HEADER */}
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


      {/* SERVICES */}
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`grid md:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >

            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-xl shadow-xl group">

              <img
                src={`${service.img}?q=80&w=1200&auto=format&fit=crop`}
                alt={service.title}
                className="w-full h-[420px] object-cover transition duration-[2000ms] group-hover:scale-110"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40"></div>
            </div>


            {/* TEXT */}
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