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
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

// Logic utilities
import { generateTimeSlots } from "../utils/logicUtils";

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Fetch Services & Staff
  useEffect(() => {
    const fetchData = async () => {
      const sSnap = await getDocs(collection(db, "services"));
      setServices(sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const stSnap = await getDocs(collection(db, "staff"));
      setStaffList(stSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

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
    // Filter staff by specialization logic
    const filtered = staffList.filter((st) =>
      st.specializations?.includes(service.id)
    );
    setAvailableStaff(filtered);
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
      return;
    }

    // Booked Slots Exclusion
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("staffId", "==", selectedStaff.id),
        where("date", "==", dateStr),
      );
      const querySnapshot = await getDocs(q);

      const bookedSlots = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status !== "cancelled") {
          bookedSlots.push(data.time);
        }
      });

      const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
      setAvailableSlots(freeSlots);
    } catch (error) {
      console.error("Error fetching assignments", error);
      setAvailableSlots(allSlots); // fallback
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  // Step 4: Confirm & Pay
  const confirmBooking = async () => {
    if (!user) {
      alert("Please login to book an appointment");
      navigate("/auth/login", { state: { returnTo: "/appointments" } });
      return;
    }

    setIsBooking(true);
    try {
      // Double Booking Prevention
      // We use slotId as document ID: {staffId}_{date}_{time}
      const slotDocId = `${selectedStaff.id}_${selectedDate}_${selectedSlot}`;
      const slotDocRef = doc(db, "appointments", slotDocId);

      await runTransaction(db, async (transaction) => {
        const slotDoc = await transaction.get(slotDocRef);
        if (slotDoc.exists() && slotDoc.data().status !== "cancelled") {
          throw new Error("Sorry, this slot was just booked by someone else.");
        }

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
          status: "pending", // Will become confirmed after payment
          createdAt: Timestamp.now(),
        };

        transaction.set(slotDocRef, appointmentData);
      });

      // If transaction succeeds, proceed to Mock Payment
      setSuccessMsg(
        `Reservation secured for ${selectedDate} at ${selectedSlot}. redirecting to payment...`,
      );

      // Here you would redirect to a Payment gateway. For brevity, mock it:
      setTimeout(() => {
        alert(
          `Payment simulation successful for $${selectedService.price}. Appointment Confirmed!`,
        );
        navigate("/profile"); // Redirect to profile where they can see appointments
      }, 2500);
    } catch (error) {
      console.error("Booking failed:", error.message);
      alert(error.message || "Failed to book appointment");
      setStep(3); // Go back to slot selection
      // Refresh slots
      handleDateSelect({ target: { value: selectedDate } });
    } finally {
      setIsBooking(false);
    }
  };

  // Minimum date for date picker (today)
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-gold-500 uppercase tracking-[0.3em] text-xs font-medium mb-4">
              Reserve Your Journey
            </h2>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-neutral-800 font-light mb-6"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              A moment of <span className="italic">tranquility.</span>
            </h1>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Progress Summary Panel */}
          <div className="lg:col-span-4 bg-white p-8 lg:p-10 shadow-xl shadow-gold-300/5 border border-gold-300/10 sticky top-32">
            <h3 className="text-xl text-neutral-800 uppercase tracking-widest mb-8 border-b border-gold-300/20 pb-4">
              Your Selection
            </h3>

            <div className="space-y-6">
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
            </div>

            {step > 1 && (
              <button
                onClick={resetSelections}
                className="w-full mt-8 py-3 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-gold-500 transition-colors"
              >
                Reset Booking
              </button>
            )}
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
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleSlotSelect(time)}
                              className={`py-3 px-2 text-xs tracking-widest transition-all duration-300 border ${
                                selectedSlot === time
                                  ? "bg-neutral-900 text-white border-neutral-900"
                                  : "bg-transparent text-neutral-800 border-gold-300/30 hover:border-gold-500"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 italic font-serif py-4 text-center">
                          No slots available for this date. Please try another
                          date.
                        </p>
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
                      <h4
                        className="text-xl text-neutral-800 font-light mb-6"
                        style={{ fontFamily: "ui-serif, Georgia, serif" }}
                      >
                        Ready to Experience Luxury
                      </h4>
                      <p className="text-neutral-500 text-sm font-light leading-relaxed mb-10 max-w-md mx-auto">
                        By proceeding, you agree to our 24-hour cancellation
                        policy. A secure payment is required to finalize your
                        booking.
                      </p>
                      <button
                        onClick={confirmBooking}
                        disabled={isBooking}
                        className="w-full md:w-auto md:px-16 bg-neutral-900 text-white py-5 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-all duration-500 disabled:opacity-50 mx-auto"
                      >
                        {isBooking ? "Securing Slot..." : "Proceed to Payment"}
                        {!isBooking && <ChevronRight className="w-4 h-4" />}
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
