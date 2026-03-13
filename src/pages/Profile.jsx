import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-24">
        <p className="text-neutral-500 font-light">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Sidebar Menu */}
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
            <button className="text-left text-sm uppercase tracking-widest text-neutral-800 font-medium">My Profile</button>
            <button className="text-left text-sm uppercase tracking-widest text-neutral-500 hover:text-gold-500 transition-colors">Orders</button>
            <button className="text-left text-sm uppercase tracking-widest text-neutral-500 hover:text-gold-500 transition-colors">Appointments</button>
            <button className="text-left text-sm uppercase tracking-widest text-neutral-500 hover:text-gold-500 transition-colors">Wishlist</button>
          </div>

          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-400 border-t border-neutral-200 pt-6 mt-8 w-full text-left transition-colors"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-3 bg-white p-10 md:p-14 shadow-xl shadow-gold-300/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blush-100/30 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-12">
            <section>
              <h3 className="text-xl text-neutral-800 font-light mb-6 border-b border-gold-300/30 pb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
                  <p className="text-neutral-800 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Phone</label>
                  <p className="text-neutral-800 font-medium">Not added yet</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl text-neutral-800 font-light mb-6 border-b border-gold-300/30 pb-4" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Recent Appointments
              </h3>
              <div className="text-center py-12 border-2 border-dashed border-neutral-200">
                <p className="text-neutral-500 font-light">You have no upcoming appointments.</p>
                <button className="mt-4 text-xs uppercase tracking-widest text-gold-500 hover:text-gold-600 border-b border-gold-500 pb-1">
                  Book A Treatment
                </button>
              </div>
            </section>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
