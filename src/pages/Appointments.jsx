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
  User,
  Sparkles,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CreditCard,
  Loader2
} from "lucide-react";

// Logic utilities
import { generateTimeSlots } from "../utils/logicUtils";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useToaster } from "../context/ToastContext";
import { APP_NAME } from "../constants/config";
import PageHeader from "../components/PageHeader";

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToaster();
  const location = useLocation();

  const [step, setStep] = useState(1);

  // Selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch Services & Staff
  useEffect(() => {
    const fetchData = async () => {
      const sSnap = await getDocs(collection(db, "services"));
      const sData = sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(sData);

      const stSnap = await getDocs(collection(db, "staff"));
      const stData = stSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(stData);

      // Handle service coming from navigation state
      if (location.state?.selectedService) {
        const preSelected = location.state.selectedService;
        setSelectedService(preSelected);
        setAvailableStaff(stData); // Show ALL specialists
        setStep(2);
      }
    };
    fetchData();
  }, [location.state]);

  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const resetSelections = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate("");
    setSelectedSlot("");
  };

  // Step 1: Select Service -> Filter Staff
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // Show all specialists for every service as requested
    setAvailableStaff(staffList);
    setSelectedStaff(null);
    setSelectedDate("");
    setSelectedSlot("");
    setStep(2);
  };

  // Step 2: Select Staff
  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setSelectedDate("");
    setSelectedSlot("");
    setStep(3);
  };

  // Step 3: Date & Slot Selection
  const handleDateSelect = async (e) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    setSelectedSlot("");

    if (!selectedStaff || !selectedService) return;

    // Slot Generation Logic using refined utility
    const allSlots = generateTimeSlots(selectedStaff, selectedService, dateStr);

    if (allSlots.length === 0) {
      setAvailableSlots([]);
      toast("No working sessions available on this day.", "info");
      return;
    }

    // Booked Slots Exclusion
    setIsLoadingSlots(true);
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("staffId", "==", selectedStaff.id),
        where("date", "==", dateStr),
      );
      const querySnapshot = await getDocs(q);

      // Check if ALREADY booked for this day (One booking per day rule)
      const confirmedBookings = querySnapshot.docs.filter(d => d.data().status !== "cancelled");

      if (confirmedBookings.length > 0) {
        setAvailableSlots([]);
        toast(`${selectedStaff.name} is fully booked for ${dateStr}`, "warning");
      } else {
        setAvailableSlots(allSlots);
      }
    } catch (error) {
      console.error("Slot check error:", error);
      toast("Failed to check availability. Please try again.", "error");
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  // Step 4: Confirm & Pay with Razorpay
  const confirmBooking = async () => {
    if (!user) {
      toast("Please login to book an appointment", "error");
      navigate("/auth/login", { state: { returnTo: "/appointments" } });
      return;
    }

    setIsBooking(true);

    try {
      // 1. Double check availability (Atomic check using individual slot ID)
      const slotDocId = `${selectedStaff.id}_${selectedDate}_${selectedSlot}`;
      const slotDocRef = doc(db, "appointments", slotDocId);

      const checkSnap = await getDocs(query(collection(db, "appointments"),
        where("staffId", "==", selectedStaff.id),
        where("date", "==", selectedDate)
      ));

      if (checkSnap.docs.some(d => d.data().status !== 'cancelled')) {
        throw new Error("This date was just claimed by someone else.");
      }

      // 2. Load Razorpay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your connection.");
      }

      const options = {
        key: "rzp_test_2ORD27rb7vGhwj",
        amount: selectedService.price * 100,
        currency: "INR",
        name: APP_NAME,
        description: `Booking: ${selectedService.name}`,
        handler: async function (response) {
          try {
            const appointmentData = {
              userId: user.uid,
              serviceId: selectedService.id,
              serviceName: selectedService.name,
              staffId: selectedStaff.id,
              staffName: selectedStaff.name,
              date: selectedDate,
              time: selectedSlot,
              duration: selectedService.duration,
              price: selectedService.price,
              paymentId: response.razorpay_payment_id,
              bookingId: `LUM-APT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              status: "confirmed",
              createdAt: Timestamp.now(),
            };

            await runTransaction(db, async (transaction) => {
              transaction.set(slotDocRef, appointmentData);
            });

            setSuccessMsg(`Reservation confirmed! Your payment ID is ${response.razorpay_payment_id}.`);
            toast("Appointment Booked Successfully!", "success");

            setTimeout(() => {
              navigate("/profile");
            }, 3000);
          } catch (err) {
            console.error("Post-payment save failed", err);
            toast("Payment successful but booking failed. Please contact support immediately.", "error");
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: { color: "#D4AF37" },
        modal: {
          ondismiss: () => {
            setIsBooking(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Booking failed:", error.message);
      toast(error.message || "Booking failed", "error");
      setIsBooking(false);
    }
  };

  // Minimum date for date picker (today)
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <PageHeader
        eyebrow="Reserve Your Journey"
        titleStart="A Moment of"
        titleItalic="Tranquility"
        description="Select your treatment, specialist, and preferred time. We will handle the rest with care and precision."
      />
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Progress Summary Panel */}
          <div className="lg:col-span-4 bg-white shadow-xl shadow-gold-300/5 border border-gold-300/10 sticky top-16 sm:top-20 lg:top-32 z-30 transition-all duration-300">
            <button 
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              className="w-full flex items-center justify-between p-6 lg:p-0 lg:px-10 lg:pt-10 lg:pb-8 text-left"
            >
              <h3 className="text-sm lg:text-xl text-neutral-800 uppercase tracking-widest lg:border-b lg:border-gold-300/20 lg:flex-1 lg:pb-4 m-0 font-bold lg:font-normal">
                Your Selection
                {selectedService && (
                  <span className="lg:hidden ml-2 text-[10px] text-gold-600 font-normal tracking-normal normal-case italic font-serif">
                    • {selectedService.name}
                  </span>
                )}
              </h3>
              <div className="lg:hidden">
                {isSummaryOpen ? <ChevronUp className="w-5 h-5 text-gold-500" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
              </div>
            </button>

            <div className={`${isSummaryOpen ? 'block' : 'hidden'} lg:block px-6 pb-6 lg:px-10 lg:pb-10 space-y-4 lg:space-y-6`}>
              {/* Service Summary */}
              <div
                className={`p-4 border ${selectedService ? "border-gold-300/40 bg-cream-50/30" : "border-neutral-100"} transition-all`}
              >
                <div className="flex gap-4 items-center mb-2">
                  <Sparkles
                    className={`w-5 h-5 ${selectedService ? "text-gold-500" : "text-neutral-300"}`}
                  />
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500">
                    Service
                  </h4>
                </div>
                {selectedService ? (
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-neutral-800">
                      {selectedService.name}
                    </p>
                    <p className="text-gold-600 text-xs italic font-serif">
                      ${selectedService.price} &bull; {selectedService.duration}{" "}
                      min
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-light italic">
                    Pending selection...
                  </p>
                )}
              </div>

              {/* Staff Summary */}
              <div
                className={`p-4 border ${selectedStaff ? "border-gold-300/40 bg-cream-50/30" : "border-neutral-100"} transition-all`}
              >
                <div className="flex gap-4 items-center mb-2">
                  <User
                    className={`w-5 h-5 ${selectedStaff ? "text-gold-500" : "text-neutral-300"}`}
                  />
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500">
                    Specialist
                  </h4>
                </div>
                {selectedStaff ? (
                  <div className="flex gap-3 items-center">
                    <img
                      src={selectedStaff.image}
                      alt={selectedStaff.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-neutral-800">
                      {selectedStaff.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-light italic">
                    Pending selection...
                  </p>
                )}
              </div>

              {/* Date & Time Summary */}
              <div
                className={`p-4 border ${selectedSlot ? "border-gold-300/40 bg-cream-50/30" : "border-neutral-100"} transition-all`}
              >
                <div className="flex gap-4 items-center mb-2">
                  <Calendar
                    className={`w-5 h-5 ${selectedSlot ? "text-gold-500" : "text-neutral-300"}`}
                  />
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500">
                    Time & Date
                  </h4>
                </div>
                {selectedDate && selectedSlot ? (
                  <p className="text-sm font-medium text-neutral-800">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {selectedSlot}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 font-light italic">
                    Pending selection...
                  </p>
                )}
              </div>

              {step > 1 && (
                <button
                  onClick={resetSelections}
                  className="w-full py-3 text-[10px] lg:text-xs lg:mt-4 uppercase tracking-widest text-neutral-400 hover:text-gold-500 transition-colors border-t border-neutral-100 lg:border-none"
                >
                  Reset Booking
                </button>
              )}
            </div>
          </div>

          {/* Right: Dynamic Selection Flow */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICES */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3
                    className="text-2xl text-neutral-800 font-light mb-8"
                    style={{ fontFamily: "ui-serif, Georgia, serif" }}
                  >
                    1. Select a Treatment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="group cursor-pointer bg-white border border-gold-300/10 p-6 hover:shadow-xl hover:shadow-gold-300/5 hover:border-gold-300/40 transition-all duration-500 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                        <h4 className="text-sm uppercase tracking-widest text-neutral-800 mb-2">
                          {service.name}
                        </h4>
                        <p className="text-neutral-400 text-xs italic font-serif mb-6">
                          {service.category}
                        </p>
                        <div className="flex justify-between items-center text-xs uppercase tracking-widest text-neutral-500">
                          <span>{service.duration} mins</span>
                          <span className="text-gold-600 font-medium">
                            ${service.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: STAFF */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3
                      className="text-2xl text-neutral-800 font-light"
                      style={{ fontFamily: "ui-serif, Georgia, serif" }}
                    >
                      2. Select a Specialist
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500"
                    >
                      Back
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableStaff.map((staff) => (
                      <div
                        key={staff.id}
                        onClick={() => handleStaffSelect(staff)}
                        className="group cursor-pointer bg-white border border-gold-300/10 p-6 hover:shadow-xl hover:shadow-gold-300/5 hover:border-gold-300/40 transition-all duration-500 flex items-center gap-6"
                      >
                        <img
                          src={staff.image}
                          alt={staff.name}
                          className="w-20 h-20 rounded-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-neutral-800 mb-1">
                            {staff.name}
                          </h4>
                          <p className="text-gold-500 text-[10px] uppercase tracking-widest">
                            Master Esthetician
                          </p>
                        </div>
                      </div>
                    ))}
                    {availableStaff.length === 0 && (
                      <p className="text-neutral-500 italic font-serif">
                        No specialists available for this service currently.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DATE & TIME */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3
                      className="text-2xl text-neutral-800 font-light"
                      style={{ fontFamily: "ui-serif, Georgia, serif" }}
                    >
                      3. Date & Time
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500"
                    >
                      Back
                    </button>
                  </div>

                  <div className="bg-white p-8 border border-gold-300/10 shadow-sm">
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-4">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={handleDateSelect}
                      className="w-full bg-cream-50/50 p-4 border border-gold-300/20 focus:outline-none focus:border-gold-500 transition-colors uppercase text-sm font-medium text-neutral-800"
                    />
                  </div>

                  {selectedDate && (
                    <div className="bg-white p-8 border border-gold-300/10 shadow-sm">
                      <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-6">
                        Available Time Slots
                      </label>
                      {isLoadingSlots ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleSlotSelect(time)}
                              className={`py-3 px-2 text-xs tracking-widest transition-all duration-300 border ${selectedSlot === time
                                  ? "bg-neutral-900 text-white border-neutral-900"
                                  : "bg-transparent text-neutral-800 border-gold-300/30 hover:border-gold-500"
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-neutral-500 italic font-serif">
                            No slots available for this period.
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-2">
                            Reason: Fully Booked or Non-working Day
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3
                      className="text-2xl text-neutral-800 font-light"
                      style={{ fontFamily: "ui-serif, Georgia, serif" }}
                    >
                      4. Finalize Reservation
                    </h3>
                    <button
                      onClick={() => setStep(3)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500"
                    >
                      Back
                    </button>
                  </div>

                  {successMsg ? (
                    <div className="bg-green-50 border border-green-200 p-8 text-center flex flex-col items-center justify-center space-y-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h4 className="text-lg text-green-800 font-medium">
                        Reservation Processed
                      </h4>
                      <p className="text-green-600 text-sm font-serif italic">
                        {successMsg}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white p-10 border border-gold-300/20 shadow-xl shadow-gold-300/5 text-center">
                      <div className="flex flex-col items-center justify-center p-4 mb-6 bg-gold-50/30 border border-gold-300/10 rounded-xl">
                        <CreditCard className="w-8 h-8 text-gold-600 mb-2" />
                        <p className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">Secure Razorpay Gateway</p>
                      </div>
                      <h4
                        className="text-xl text-neutral-800 font-light mb-6"
                        style={{ fontFamily: "ui-serif, Georgia, serif" }}
                      >
                        Ready to Experience Luxury
                      </h4>
                      <p className="text-neutral-500 text-sm font-light leading-relaxed mb-10 max-w-md mx-auto">
                        Your appointment for <span className="text-neutral-900 font-medium">{selectedService.name}</span> on <span className="text-neutral-900 font-medium">{selectedDate}</span> is ready for confirmation. A secure payment is required via <span className="font-bold">Razorpay</span> to finalize your booking.
                      </p>
                      <button
                        onClick={confirmBooking}
                        disabled={isBooking}
                        className="w-full md:w-auto md:px-16 bg-neutral-900 text-white py-5 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-all duration-500 disabled:opacity-50 mx-auto"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Initializing...
                          </>
                        ) : (
                          <>
                            Pay ₹{selectedService.price} & Confirm
                            <ShieldCheck className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
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
