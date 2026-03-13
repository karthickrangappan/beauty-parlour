import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Appointments = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const services = [
    "Signature Silk Facial",
    "Golden Hour Body Polish",
    "Botanical Hair Revival",
    "Pearl Infusion Massage"
  ];

  const timeSlots = ["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Side: Visuals & Context */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-gold-500 uppercase tracking-[0.3em] text-xs font-medium mb-6">
            Reserve Your Time
          </h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-neutral-800 font-light mb-8 leading-tight" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            A moment <br/> of tranquility.
          </h1>
          <p className="text-neutral-500 text-lg font-light leading-relaxed max-w-md">
            Secure your preferred time for our curated treatments. Each session is a meticulously structured journey back to your most radiant self.
          </p>

          <div className="mt-12 aspect-[3/4] max-w-sm rounded overflow-hidden relative shadow-2xl shadow-gold-300/10">
            <div className="absolute inset-0 bg-gold-400/10 mix-blend-overlay z-10" />
            <img 
              src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop"
              alt="Booking aesthetic"
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </div>
        </motion.div>

        {/* Right Side: Booking Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-10 md:p-14 shadow-xl shadow-neutral-200/50 flex flex-col justify-center border border-gold-300/10 relative"
        >
          {/* Subtle decorative background blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blush-100/30 blur-3xl rounded-full pointer-events-none" />

          <h3 className="text-2xl text-neutral-800 font-light mb-10" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            Appointment Details
          </h3>

          <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* Treatment Selection */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Select Treatment</label>
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light appearance-none rounded-none"
              >
                <option value="" disabled>Choose a signature service...</option>
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Select Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light uppercase text-sm"
              />
            </div>

            {/* Time Selection Container */}
            <div className="space-y-4 pt-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Available Times</label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 text-xs tracking-widest transition-all duration-300 border ${
                      selectedTime === time 
                        ? 'bg-neutral-800 text-white border-neutral-800' 
                        : 'bg-transparent text-neutral-600 border-neutral-200 hover:border-gold-400'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button 
                type="submit"
                className="w-full bg-gold-400 hover:bg-gold-500 text-white py-4 uppercase tracking-[0.2em] text-sm font-medium transition-colors duration-300"
              >
                Confirm Reservation
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Appointments;
