import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { Package, Calendar as CalendarIcon, Clock, ChevronRight, RefreshCw } from 'lucide-react';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     if (user) {
         if (activeTab === 'orders') fetchOrders();
         if (activeTab === 'appointments') fetchAppointments();
     }
  }, [activeTab, user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const fetchOrders = async () => {
      setIsLoading(true);
      try {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          const rawOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          rawOrders.sort((a,b) => {
              const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
              const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
          });
          setOrders(rawOrders);
      } catch (err) {
          console.error("Error fetching orders", err);
      } finally {
          setIsLoading(false);
      }
  };

  const fetchAppointments = async () => {
      setIsLoading(true);
      try {
          const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          const rawAppts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          rawAppts.sort((a,b) => {
              const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
              const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
          });
          setAppointments(rawAppts);
      } catch (err) {
          console.error("Error fetching appointments", err);
      } finally {
          setIsLoading(false);
      }
  };

  const requestReturn = async (orderId) => {
      if(window.confirm("Are you sure you want to request a return and refund for this order?")) {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: 'return requested', returnRequestedAt: Timestamp.now() });
            fetchOrders();
            alert("Return requested successfully. Subject to admin approval.");
        } catch (err) {
            console.error("Return failed", err);
        }
      }
  };

  const cancelAppointment = async (apptId) => {
      if(window.confirm("Are you sure you want to cancel this appointment?")) {
          try {
              await updateDoc(doc(db, 'appointments', apptId), { status: 'cancelled' });
              fetchAppointments();
          } catch (err) {
              console.error("Cancel failed", err);
          }
      }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-24">
        <p className="text-neutral-500 font-light">Please log in to view your profile.</p>
      </div>
    );
  }

  // Helper for Order Stepper
  const orderSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const getStepIndex = (status) => orderSteps.indexOf(status);

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-1 space-y-8"
        >
          <div>
            <h2 className="text-2xl text-neutral-800 font-light mb-2" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
              Welcome back
            </h2>
            <p className="text-gold-500 tracking-widest text-sm uppercase font-medium">
              {user?.displayName || 'Guest User'}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <button onClick={() => setActiveTab('profile')} className={`text-left text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'profile' ? 'text-neutral-900' : 'text-neutral-400 hover:text-gold-500'}`}>My Profile</button>
            <button onClick={() => setActiveTab('orders')} className={`text-left text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'orders' ? 'text-neutral-900' : 'text-neutral-400 hover:text-gold-500'}`}>Orders</button>
            <button onClick={() => setActiveTab('appointments')} className={`text-left text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === 'appointments' ? 'text-neutral-900' : 'text-neutral-400 hover:text-gold-500'}`}>Appointments</button>
            <button onClick={() => navigate('/wishlist')} className="text-left text-sm uppercase tracking-widest font-medium text-neutral-400 hover:text-gold-500 transition-colors">Wishlist</button>
            
            {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="text-left text-sm uppercase tracking-widest font-bold text-gold-500 hover:text-gold-600 transition-colors pt-4 mt-4 border-t border-neutral-200">
                    Admin Portal
                </button>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-red-400 hover:text-red-500 border-t border-neutral-200 pt-6 mt-8 w-full text-left transition-colors"
          >
            Sign Out
          </button>
        </motion.div>

        <motion.div
          key={activeTab} // re-animate on tab change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3 bg-white p-8 md:p-12 shadow-xl shadow-gold-300/5 relative overflow-hidden min-h-[500px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blush-100/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                  <div className="space-y-12">
                    <section>
                    <h3 className="text-xl text-neutral-800 font-light mb-6 border-b border-gold-300/30 pb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                        Account Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm border p-8 border-gold-300/10">
                        <div>
                        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
                        <p className="text-neutral-800 font-medium">{user.email}</p>
                        </div>
                        <div>
                        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Loyalty Points</label>
                        <p className="text-gold-600 font-bold">{user.loyaltyPoints || 0} pts</p>
                        </div>
                    </div>
                    </section>
                  </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                  <div>
                      <h3 className="text-xl text-neutral-800 font-light mb-8 border-b border-gold-300/30 pb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                        Order History
                      </h3>
                      {isLoading ? (
                          <div className="text-center py-10 text-neutral-400">Loading your treasures...</div>
                      ) : orders.length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-neutral-200">
                            <Package className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500 font-light font-serif italic mb-4">You have not placed any orders yet.</p>
                            <button onClick={()=>navigate('/shop')} className="text-[10px] uppercase tracking-widest text-gold-500 hover:text-neutral-900 border-b border-gold-500 pb-1">Discover Collection</button>
                          </div>
                      ) : (
                          <div className="space-y-8">
                              {orders.map(order => {
                                  let currentStep = getStepIndex(order.status);
                                  const isSpecialStatus = ['return requested', 'refunded', 'cancelled'].includes(order.status);

                                  return (
                                  <div key={order.id} className="border border-gold-300/20 shadow-sm">
                                      {/* Order Header */}
                                      <div className="bg-cream-50/50 p-6 flex flex-wrap gap-4 items-center justify-between border-b border-gold-300/10">
                                          <div>
                                              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Order Placed</p>
                                              <p className="text-sm font-medium text-neutral-800">
                                                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Total</p>
                                              <p className="text-sm font-medium text-neutral-800">${order.totalAmount?.toFixed(2)}</p>
                                          </div>
                                          <div className="text-right">
                                              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Order #</p>
                                              <p className="text-xs font-mono text-neutral-700">{order.id.slice(0, 8)}...</p>
                                          </div>
                                      </div>

                                      {/* Order Body & Stepper */}
                                      <div className="p-6">
                                          {!isSpecialStatus && (
                                              <div className="mb-10 px-4">
                                                  <div className="flex items-center justify-between relative">
                                                      <div className="absolute left-0 top-1/2 -mt-0.5 w-full h-1 bg-neutral-100 -z-10 rounded"></div>
                                                      {orderSteps.map((step, idx) => (
                                                          <div key={step} className="flex flex-col items-center gap-2 relative">
                                                              {idx < currentStep ? (
                                                                  <div className="w-4 h-4 rounded-full bg-green-500 shadow ring-4 ring-white"></div>
                                                              ) : idx === currentStep ? (
                                                                  <div className="w-4 h-4 rounded-full bg-gold-500 shadow ring-4 ring-white animate-pulse"></div>
                                                              ) : (
                                                                  <div className="w-4 h-4 rounded-full bg-neutral-200 shadow ring-4 ring-white"></div>
                                                              )}
                                                              <span className={`absolute top-6 text-[10px] uppercase tracking-widest ${idx <= currentStep ? 'text-neutral-800 font-bold' : 'text-neutral-400 font-medium'} max-w-[60px] text-center`}>{step}</span>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          )}

                                          {isSpecialStatus && (
                                              <div className="mb-6 bg-red-50 text-red-600 p-4 text-xs font-medium uppercase tracking-widest text-center">
                                                  Status: {order.status}
                                              </div>
                                          )}

                                          {/* Items */}
                                          <div className="space-y-4 pt-4 mt-6">
                                                {order.items?.map(item => (
                                                    <div key={item.id} className="flex gap-4 items-center">
                                                        <img src={item.image} alt={item.name} className="w-12 h-16 object-cover border border-gold-300/10" />
                                                        <div className="flex-1">
                                                            <h4 className="text-xs uppercase tracking-wider text-neutral-800">{item.name}</h4>
                                                            <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-sm font-medium text-neutral-800">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                          </div>

                                          {order.status === 'delivered' && (
                                              <div className="mt-8 pt-6 border-t border-gold-300/10 text-right">
                                                  <button onClick={() => requestReturn(order.id)} className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center justify-end gap-1 w-full text-right">
                                                      <RefreshCw className="w-3 h-3"/> Request Return
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              )})}
                          </div>
                      )}
                  </div>
              )}

              {/* APPOINTMENTS TAB */}
              {activeTab === 'appointments' && (
                  <div>
                      <h3 className="text-xl text-neutral-800 font-light mb-8 border-b border-gold-300/30 pb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                        Your Appointments
                      </h3>
                      {isLoading ? (
                          <div className="text-center py-10 text-neutral-400">Fetching reservations...</div>
                      ) : appointments.length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-neutral-200">
                            <CalendarIcon className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500 font-light font-serif italic mb-4">No upcoming appointments found.</p>
                            <button onClick={()=>navigate('/appointments')} className="text-[10px] uppercase tracking-widest text-gold-500 hover:text-neutral-900 border-b border-gold-500 pb-1">Reserve a Treatment</button>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {appointments.map(appt => (
                                  <div key={appt.id} className="border border-gold-300/20 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                                      <div className="space-y-2 flex-1">
                                          <div className="flex gap-2 items-center mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${appt.status === 'cancelled' ? 'bg-red-100 text-red-600' : appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gold-100 text-gold-700'}`}>
                                                {appt.status}
                                            </span>
                                            <span className="text-xs text-neutral-400 font-mono">#{appt.id.slice(0,6)}</span>
                                          </div>
                                          <h4 className="text-sm font-medium uppercase tracking-widest text-neutral-800">{appt.serviceName}</h4>
                                          <p className="text-xs text-neutral-500 italic font-serif flex items-center gap-1">
                                              <CalendarIcon className="w-3 h-3"/> {new Date(appt.date).toLocaleDateString()} &bull; {appt.time} &bull; {appt.duration}min
                                          </p>
                                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Specialist: {appt.staffName}</p>
                                      </div>
                                      
                                      <div className="w-full md:w-auto text-right">
                                          <p className="text-lg font-light text-neutral-800 mb-2">${appt.price.toFixed(2)}</p>
                                          {(appt.status === 'pending' || appt.status === 'confirmed') && (
                                              <button onClick={() => cancelAppointment(appt.id)} className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600">
                                                  Cancel Booking
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
