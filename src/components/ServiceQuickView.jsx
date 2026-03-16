import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Clock, IndianRupee, ArrowRight, ShieldCheck, Sparkles, 
  Calendar, Loader2, CheckCircle, CreditCard 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, runTransaction, Timestamp } from "firebase/firestore";
import { generateTimeSlots } from "../utils/logicUtils";
import { loadRazorpay } from "../utils/loadRazorpay";
import { toast } from "react-hot-toast";
import { APP_NAME, RAZORPAY_KEY_ID } from "../constants/config";

const ServiceQuickView = ({ service, staff = [], isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingStep, setBookingStep] = useState(0); // 0: Overview, 1: Schedule & Details, 2: Success
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [userDetails, setUserDetails] = useState({
    phone: "",
    needs: ""
  });

  useEffect(() => {
    if (!isOpen) {
      setBookingStep(0);
      setSelectedDate("");
      setAvailableSlots([]);
      setSelectedSlot("");
      setSuccessMsg("");
      setIsBooking(false);
      setUserDetails({ phone: "", needs: "" });
    }
  }, [isOpen]);

  if (!service) return null;

  const handleDateSelect = async (e) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    setSelectedSlot("");

    if (!service || staff.length === 0) return;

    setIsLoadingSlots(true);
    try {
      // Use first available staff for slot pattern
      const staffMember = staff[0];
      const allSlots = generateTimeSlots(staffMember, service, dateStr);
      
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("date", "==", dateStr),
      );
      const querySnapshot = await getDocs(q);
      
      const bookedSlots = querySnapshot.docs
        .filter(d => d.data().status !== "cancelled")
        .map(d => d.data().time);

      // Simple pool logic: if booked count < staff count, slot is available
      const slotCounts = bookedSlots.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});

      const filteredSlots = allSlots.filter(slot => (slotCounts[slot] || 0) < staff.length);
      setAvailableSlots(filteredSlots);
    } catch (error) {
      toast.error("Error checking availability");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const confirmBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      navigate("/auth/login");
      return;
    }

    if (!userDetails.phone) {
      toast.error("Please provide your contact number");
      return;
    }

    setIsBooking(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Payment system failed to load");

      const options = {
        key: RAZORPAY_KEY_ID || "rzp_test_2ORD27rb7vGhwj",
        amount: service.price * 100,
        currency: "INR",
        name: APP_NAME,
        description: `Booking: ${service.name}`,
        handler: async function (response) {
          try {
            const appointmentData = {
              userId: user.uid,
              serviceId: service.id,
              serviceName: service.name,
              staffId: "any",
              staffName: "TBD",
              date: selectedDate,
              time: selectedSlot,
              type: "onsite",
              customerName: user.displayName || "Guest",
              customerPhone: userDetails.phone,
              customerNeeds: userDetails.needs,
              price: service.price,
              paymentId: response.razorpay_payment_id,
              bookingId: `LUM-${Date.now()}`,
              status: "pending",
              createdAt: Timestamp.now(),
            };

            await runTransaction(db, async (t) => {
              const ref = doc(collection(db, "appointments"));
              t.set(ref, appointmentData);
            });

            setSuccessMsg("Experience Booked Successfully!");
            setBookingStep(2);
            toast.success("Booking Confirmed!");
          } catch (err) {
            toast.error("Save failed. Contact support.");
          }
        },
        prefill: { email: user.email, contact: userDetails.phone },
        theme: { color: "#D4AF37" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-neutral-100 flex-shrink-0">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-400 mb-2">{service.category}</p>
                <h2 className="text-3xl font-light italic" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{service.name}</h2>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
              <AnimatePresence mode="wait">
                {bookingStep === 0 && (
                  <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="mb-8">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-gold-600">
                          <IndianRupee className="w-5 h-5 font-bold" />
                          <span className="text-2xl font-bold tracking-tight">₹{service.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 border-l border-neutral-100 pl-6">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{service.duration} Mins</span>
                        </div>
                      </div>
                      <p className="text-neutral-500 font-light leading-relaxed text-sm mb-10 italic">
                        {service.description}
                      </p>
                    </div>
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="w-full py-4 bg-neutral-900 text-white flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-[10px] font-black hover:bg-gold-500 transition-all duration-500 shadow-xl"
                    >
                      Process Booking
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="mt-4 text-[9px] uppercase tracking-widest text-neutral-400 text-center font-medium">Quick reservation in 2 easy steps</p>
                  </motion.div>
                )}

                {bookingStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.3em] font-black text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Schedule & Requirements</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-2">Pick Date</label>
                        <input type="date" min={todayStr} value={selectedDate} onChange={handleDateSelect} className="w-full bg-neutral-50 border border-neutral-100 p-3 text-[10px] focus:outline-none focus:border-gold-500" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-2">Contact No</label>
                        <input type="tel" value={userDetails.phone} onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 p-3 text-[10px] focus:outline-none focus:border-gold-500" placeholder="+91..." />
                      </div>
                    </div>

                    <div>
                       <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-2">Specific Needs</label>
                       <textarea value={userDetails.needs} onChange={(e) => setUserDetails({...userDetails, needs: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 p-3 text-[10px] h-20 focus:outline-none focus:border-gold-500 transition-all" placeholder="Any special requests?"></textarea>
                    </div>

                    {selectedDate && (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">Available Slots</label>
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto no-scrollbar">
                          {isLoadingSlots ? <Loader2 className="w-4 h-4 animate-spin col-span-3 mx-auto" /> : availableSlots.map(t => (
                            <button key={t} onClick={() => setSelectedSlot(t)} className={`py-2 text-[9px] font-bold border ${selectedSlot === t ? "bg-gold-500 text-white border-gold-500" : "border-neutral-100 hover:border-gold-300"}`}>{t}</button>
                          ))}
                          {!isLoadingSlots && availableSlots.length === 0 && <p className="col-span-3 text-[10px] text-neutral-400 italic text-center py-4">No slots found</p>}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={confirmBooking}
                      disabled={!selectedSlot || !userDetails.phone || isBooking}
                      className="w-full py-4 bg-neutral-900 text-white uppercase tracking-[0.2em] text-[10px] font-black hover:bg-gold-500 transition-all disabled:opacity-20 flex items-center justify-center gap-2 mt-4"
                    >
                      {isBooking ? <Loader2 className="w-3 h-3 animate-spin"/> : <CreditCard className="w-3 h-3" />}
                      Pay ₹{service.price} & Book
                    </button>
                    <button onClick={() => setBookingStep(0)} className="w-full text-[9px] uppercase tracking-widest text-neutral-400 hover:text-neutral-600 font-bold">Back to Details</button>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                    <h3 className="text-2xl font-light italic mb-4" style={{ fontFamily: "ui-serif, Georgia, serif" }}>Booking Successful</h3>
                    <p className="text-sm text-neutral-500 font-light max-w-xs mb-8">Your sanctuary is prepared. You can view your appointment details in your profile.</p>
                    <button 
                      onClick={onClose}
                      className="px-8 py-3 bg-neutral-900 text-white uppercase text-[10px] tracking-widest font-black hover:bg-gold-500 transition-all"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceQuickView;
