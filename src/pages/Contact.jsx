import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";

const contactData = {
  header: {
    titleMain: "Get in",
    titleHighlight: "Touch",
    subtitle: "WE WOULD BE DELIGHTED TO HEAR FROM YOU",
    description: "Whether you have a question about our treatments, products, or wish to schedule an exclusive consultation, our dedicated team is at your service.",
  },
  details: [
    {
      icon: <MapPin className="w-5 h-5 text-gold-500" />,
      label: "Our Sanctuary",
      value: "123 Luxury Avenue, Suite 400\nNew York, NY 10001",
    },
    {
      icon: <Phone className="w-5 h-5 text-gold-500" />,
      label: "Direct Line",
      value: "+1 (555) 123-4567\n+1 (555) 987-6543",
    },
    {
      icon: <Mail className="w-5 h-5 text-gold-500" />,
      label: "Electronic Mail",
      value: "concierge@lumiere.com\npress@lumiere.com",
    },
    {
      icon: <Clock className="w-5 h-5 text-gold-500" />,
      label: "Opening Hours",
      value: "Monday - Friday: 9am - 8pm\nSaturday & Sunday: 10am - 6pm",
    }
  ],
  imageSrc: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1200&auto=format&fit=crop"
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] pb-24">
      <PageHeader
        eyebrow="Concierge"
        titleStart="Get in"
        titleItalic="Touch"
        description="Whether you have a question about our treatments, products, or wish to schedule an exclusive consultation, our dedicated team is at your service."
      />

      {/* 2. Main Content Layout */}
      <section className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Contact Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8"
          >
            {contactData.details.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex items-start gap-6 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-cream-50 flex items-center justify-center shrink-0 border border-gold-100 group-hover:bg-gold-50 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800 mb-2">
                    {item.label}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed font-light text-sm sm:text-base whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-neutral-100 relative overflow-hidden">
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
              
              <h2 
                className="text-3xl md:text-4xl text-neutral-900 font-light mb-8 lg:mb-10"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Send a <span className="italic text-gold-500">Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light placeholder:text-neutral-300" 
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light placeholder:text-neutral-300" 
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light placeholder:text-neutral-300" 
                    placeholder="How can we assist you?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">Your Message</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light placeholder:text-neutral-300 resize-none" 
                    placeholder="Please provide any details..."
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`group flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-neutral-900 text-white text-xs sm:text-sm uppercase tracking-widest font-bold rounded-full transition-all duration-300 shadow-xl ${
                      isSubmitting 
                        ? "opacity-70 cursor-not-allowed" 
                        : "hover:bg-gold-500 hover:shadow-gold-500/30"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                    {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>

                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-green-600 text-sm font-medium tracking-wide"
                      >
                        Message sent successfully.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Image Break Section */}
      <section className="mt-24 sm:mt-32 w-full h-[400px] sm:h-[500px] md:h-[60vh] relative overflow-hidden">
        <motion.div
           initial={{ scale: 1.05 }}
           whileInView={{ scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="w-full h-full"
        >
          <img 
            src={contactData.imageSrc} 
            alt="Spa Elements" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-neutral-900/20 mix-blend-multiply" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <h3 
              className="text-4xl sm:text-5xl md:text-7xl text-white font-light drop-shadow-xl px-6 text-center"
              style={{ fontFamily: "Playfair Display, serif" }}
           >
              Awaiting your <span className="italic text-gold-200">arrival.</span>
           </h3>
        </div>
      </section>
    </div>
  );
};

export default Contact;
