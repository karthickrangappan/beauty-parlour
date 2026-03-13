import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setLoading, setError, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      });
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left side Image - Hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-400/10 mix-blend-overlay z-10" />
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop"
          alt="Spa calming environment"
          className="w-full h-full object-cover grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream-50/90 z-20" />
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white p-10 shadow-xl shadow-gold-300/5 relative z-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl text-neutral-800 font-light mb-2" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
              Welcome back
            </h2>
            <p className="text-neutral-500 text-sm font-light">
              Enter your details to access your sanctuary.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-sm font-light border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-500">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-gold-500 border-neutral-300 rounded-sm" />
                <span className="text-sm text-neutral-500 group-hover:text-gold-500 transition-colors font-light">Remember me</span>
              </label>
              <a href="#" className="text-sm text-neutral-500 hover:text-gold-500 transition-colors font-light">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-gold-500 text-white py-4 mt-4 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm font-light mt-8">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-gold-500 hover:text-gold-600 border-b border-transparent hover:border-gold-500 pb-1 transition-all">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
