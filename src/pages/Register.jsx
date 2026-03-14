import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PageHeader from '../components/PageHeader';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const { setUser, setLoading, setError, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'customer',
        loyaltyPoints: 0,
        wishlist: []
      });

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        role: 'customer',
        loyaltyPoints: 0,
        wishlist: []
      });
      
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <PageHeader
        eyebrow="A New Journey"
        titleStart="Create"
        titleItalic="Account"
        description="Join our sanctuary to track your curated orders and effortlessly book luxury treatments."
      />

      <div className="max-w-7xl mx-auto px-6 flex justify-center -mt-10 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white p-10 shadow-2xl shadow-gold-300/10 border border-gold-300/20"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl text-neutral-800 font-light mb-2 uppercase tracking-widest">
              Join Us
            </h2>
            <p className="text-neutral-500 text-sm font-light italic font-serif">
              Begin your journey to wellness.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-sm font-light border border-red-100">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-500 text-white py-4 mt-6 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm font-light mt-8">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-gold-500 hover:text-gold-600 border-b border-transparent hover:border-gold-500 pb-1 transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
