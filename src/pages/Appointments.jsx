import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from '../firebase';
import {
  collection,
  query,
  getDocs,
  where,
  runTransaction,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Loader2,
  ChevronUp,
  ChevronDown
} from "lucide-react";

import { generateTimeSlots } from "../utils/logicUtils";
import { loadRazorpay } from "../utils/loadRazorpay";
import { toast } from "react-hot-toast";
import { APP_NAME, RAZORPAY_KEY_ID } from "../constants/config";
import PageHeader from "../components/PageHeader";

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: user?.displayName || "",
    phone: "",
    notes: "", // User's specific requirements or service-related info
  });
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sSnap = await getDocs(collection(db, "services"));
        setServices(sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const stSnap = await getDocs(collection(db, "staff"));
        setStaffCount(stSnap.docs.length);

        if (location.state?.selectedService) {
          setSelectedService(location.state.selectedService);
          setStep(2);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [location.state]);

  const resetSelections = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedSlot("");
    setUserDetails({ name: user?.displayName || "", phone: "", notes: "" });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedDate("");
    setSelectedSlot("");
    setStep(2);
  };

  const handleDateSelect = async (e) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    setSelectedSlot("");

    if (!selectedService || staffCount === 0) return;

    setIsLoadingSlots(true);
    try {
      // Fetch dummy/first staff to generate slot patterns
      const staffSnap = await getDocs(collection(db, "staff"));
      const firstStaff = staffSnap.docs[0]?.data();
      
      const allSlots = generateTimeSlots(firstStaff || {}, selectedService, dateStr);

      if (allSlots.length === 0) {
        setAvailableSlots([]);
        toast.error("No sessions available on this day.");
        return;
      }

      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, where("date", "==", dateStr));
      const querySnapshot = await getDocs(q);

      const bookedSlots = querySnapshot.docs
        .filter(d => d.data().status !== "cancelled")
        .map(d => d.data().time);

      const slotUsage = bookedSlots.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});

      // A slot is available if current bookings < total staff count
      const filteredSlots = allSlots.filter(slot => (slotUsage[slot] || 0) < staffCount);
      
      setAvailableSlots(filteredSlots);
    } catch (error) {
      toast.error("Availability check failed.");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const confirmBooking = async () => {
    if (!user) {
      toast.error("Login required for booking");
      navigate("/auth/login", { state: { returnTo: "/appointments" } });
      return;
    }

    if (!userDetails.phone) {
      toast.error("Phone number is required");
      return;
    }

    setIsBooking(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Payment system unavailable");

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: selectedService.price * 100,
        currency: "INR",
        name: APP_NAME,
        description: `Experience: ${selectedService.name}`,
        handler: async function (response) {
          try {
            const appointmentData = {
              userId: user.uid,
              serviceId: selectedService.id,
              serviceName: selectedService.name,
              date: selectedDate,
              time: selectedSlot,
              customerName: userDetails.name,
              customerPhone: userDetails.phone,
              customerNotes: userDetails.notes,
              price: selectedService.price,
              paymentId: response.razorpay_payment_id,
              bookingId: `LUM-${Date.now()}`,
              status: "pending",
              staffId: "any", 
              createdAt: Timestamp.now(),
            };

            await runTransaction(db, async (t) => {
              const ref = doc(collection(db, "appointments"));
              t.set(ref, appointmentData);
            });

            setSuccessMsg("Your sanctuary awaits. Booking confirmed!");
            setStep(4);
            toast.success("Experience Booked!");
          } catch (err) {
            toast.error("Payment received but save failed. Contact Us.");
          }
        },
        prefill: { email: user.email },
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
    <div className="min-h-screen bg-cream-50 pb-24 font-inter">
      <PageHeader
        eyebrow="Boutique Experience"
        titleStart="Your Personalized"
        titleItalic="Ritual"
        description="Select your desired treatment and schedule. Provide any specific details to help us tailor your experience."
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
            <div className="bg-white border border-gold-300/10 shadow-xl shadow-gold-300/5 overflow-hidden">
              <button 
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                className="w-full flex items-center justify-between p-6 lg:p-8 bg-neutral-900 text-white"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] font-black">Your Selection</h3>
                <div className="lg:hidden">{isSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
              </button>

              <div className={`${isSummaryOpen ? 'block' : 'hidden'} lg:block p-8 space-y-6`}>
                <div className={`p-4 border transition-all ${selectedService ? "border-gold-300 bg-gold-50/20" : "border-neutral-100 italic text-neutral-400"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Treatment</span>
                  </div>
                  {selectedService ? (
                    <div>
                      <p className="text-sm font-bold text-neutral-800">{selectedService.name}</p>
                      <p className="text-[10px] text-gold-600 mt-1 uppercase font-black">₹{selectedService.price} &bull; {selectedService.duration}m</p>
                    </div>
                  ) : <p className="text-xs">Unselected</p>}
                </div>

                <div className={`p-4 border transition-all ${selectedSlot ? "border-gold-300 bg-gold-50/20" : "border-neutral-100 italic text-neutral-400"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Schedule</span>
                  </div>
                  {selectedSlot ? (
                    <div>
                      <p className="text-sm font-bold text-neutral-800">{new Date(selectedDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gold-600 mt-1 uppercase font-black">{selectedSlot}</p>
                    </div>
                  ) : <p className="text-xs">Unscheduled</p>}
                </div>

                {step > 1 && (
                  <button onClick={resetSelections} className="w-full text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-600 font-black pt-4 border-t border-neutral-100">
                    Restart Booking
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <h3 className="text-2xl font-light italic border-b border-gold-200 pb-4" style={{ fontFamily: "ui-serif, Georgia, serif" }}>1. Explore Treatments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => handleServiceSelect(s)}
                        className="group cursor-pointer bg-white p-8 border border-neutral-100 hover:border-gold-400 transition-all duration-500 shadow-sm hover:shadow-xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50/50 rounded-full blur-3xl group-hover:bg-gold-200/50 transition-colors" />
                        <span className="text-[9px] uppercase tracking-widest text-gold-600 font-bold block mb-2">{s.category}</span>
                        <h4 className="text-lg font-bold text-neutral-800 mb-2">{s.name}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 italic mb-6">{s.description}</p>
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-neutral-500">
                           <span>{s.duration} min</span>
                           <span className="text-gold-700">₹{s.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center border-b border-gold-200 pb-4">
                    <h3 className="text-2xl font-light italic" style={{ fontFamily: "ui-serif, Georgia, serif" }}>2. Ritual Schedule</h3>
                    <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500">Back</button>
                  </div>
                  
                  <div className="bg-white p-8 border border-neutral-100 space-y-8">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-4">Preferred Date</label>
                      <input type="date" min={todayStr} value={selectedDate} onChange={handleDateSelect} className="w-full bg-neutral-50 border border-neutral-100 p-4 text-sm focus:outline-none focus:border-gold-500" />
                    </div>

                    {selectedDate && (
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">Available Time Slots</label>
                        {isLoadingSlots ? <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" /> : (
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {availableSlots.map(t => (
                              <button key={t} onClick={() => { setSelectedSlot(t); setStep(3); }} className={`p-3 text-[10px] font-bold border transition-all ${selectedSlot === t ? "bg-neutral-900 text-white border-neutral-900" : "hover:border-gold-500"}`}>{t}</button>
                            ))}
                          </div>
                        )}
                        {!isLoadingSlots && availableSlots.length === 0 && <p className="text-xs italic text-neutral-400 text-center py-10">No availability for this date. Please try another day.</p>}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center border-b border-gold-200 pb-4">
                    <h3 className="text-2xl font-light italic" style={{ fontFamily: "ui-serif, Georgia, serif" }}>3. Your Details</h3>
                    <button onClick={() => setStep(2)} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500">Back</button>
                  </div>

                  <div className="bg-white p-10 border border-neutral-100 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Full Name</label>
                        <input value={userDetails.name} onChange={e => setUserDetails({...userDetails, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 p-4 text-sm focus:outline-none focus:border-gold-500" placeholder="Required" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Phone Line</label>
                        <input type="tel" value={userDetails.phone} onChange={e => setUserDetails({...userDetails, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 p-4 text-sm focus:outline-none focus:border-gold-500" placeholder="+91..." />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Special Requests / Treatment Notes</label>
                      <textarea value={userDetails.notes} onChange={e => setUserDetails({...userDetails, notes: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 p-4 text-sm focus:outline-none focus:border-gold-500 h-32" placeholder="Tell us anything that helps us prepare for your visit..."></textarea>
                    </div>
                    <button onClick={() => setStep(4)} disabled={!userDetails.name || !userDetails.phone} className="w-full py-5 bg-neutral-900 text-white uppercase tracking-[0.3em] text-xs font-black hover:bg-gold-500 transition-all disabled:opacity-20 shadow-xl">Complete Registration</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <h3 className="text-2xl font-light italic border-b border-gold-200 pb-4" style={{ fontFamily: "ui-serif, Georgia, serif" }}>4. Finalize Reservation</h3>
                  
                  <div className="bg-white p-12 border border-gold-300/20 text-center shadow-2xl shadow-gold-300/5">
                    {successMsg ? (
                      <div className="space-y-6">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                        <h4 className="text-2xl font-bold text-neutral-800">Reservation Secured</h4>
                        <p className="text-neutral-500 italic max-w-sm mx-auto">{successMsg}</p>
                        <button onClick={() => navigate('/profile')} className="px-12 py-4 bg-neutral-900 text-white uppercase text-[10px] tracking-widest font-black">View My Bookings</button>
                      </div>
                    ) : (
                      <div className="space-y-10">
                         <div className="max-w-md mx-auto space-y-4">
                            <ShieldCheck className="w-12 h-12 text-gold-500 mx-auto" />
                            <h4 className="text-xl font-bold">Secure Checkout</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed italic">Your booking for <span className="text-neutral-800 font-black">{selectedService.name}</span> on <span className="text-neutral-800 font-black">{selectedDate}</span> is ready. Finalize with a secure payment.</p>
                         </div>
                         <button 
                            onClick={confirmBooking} 
                            disabled={isBooking}
                            className="w-full max-w-sm py-5 bg-neutral-900 text-white uppercase tracking-[0.25em] text-[10px] font-black hover:bg-gold-500 transition-all flex items-center justify-center gap-3 mx-auto"
                         >
                           {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Confirm & Pay ₹{selectedService.price}</>}
                         </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
