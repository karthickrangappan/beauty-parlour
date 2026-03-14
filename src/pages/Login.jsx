import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Mail, Phone, Lock, KeyRound } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { setUser, setLoading, setError, loading, error } = useAuth();
  const navigate = useNavigate();

    
    useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          
        }
      });
    }
  }, []);

  const initializeUserDocIfNeeded = async (firebaseUser) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        name: firebaseUser.displayName || 'Guest User',
        email: firebaseUser.email || '',
        role: 'customer',
        loyaltyPoints: 0,
        wishlist: []
      });
    }
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.phoneNumber || 'Guest User',
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await initializeUserDocIfNeeded(userCredential.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        await initializeUserDocIfNeeded(result.user);
        navigate('/profile');
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await initializeUserDocIfNeeded(result.user);
      navigate('/profile');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
          setError('Google Sign-in was cancelled.');
      } else {
          setError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <PageHeader
        eyebrow="Sanctuary Access"
        titleStart="Welcome"
        titleItalic="Back"
        description="Sign in to track your curated elixirs and manage your luxury appointments."
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
              Sign In
            </h2>
            <p className="text-neutral-500 text-sm font-light italic font-serif">
              Enter details to access your sanctuary.
            </p>
          </div>

          <div id="recaptcha-container"></div>

          
          <div className="flex bg-cream-50 rounded-sm mb-6 p-1">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm transition-colors ${loginMethod === 'email' ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => { setLoginMethod('phone'); setShowOtpInput(false); }}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm transition-colors ${loginMethod === 'phone' ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-sm font-light border border-red-100 mb-6">
              {error}
            </div>
          )}

          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1 w-4 h-4 text-neutral-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-neutral-300 pl-8 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1 w-4 h-4 text-neutral-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-neutral-300 pl-8 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                    placeholder="••••••••"
                  />
                </div>
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
                className="w-full bg-neutral-900 hover:bg-gold-500 text-white py-4 mt-4 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {loginMethod === 'phone' && (
            !showOtpInput ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1 w-4 h-4 text-neutral-400" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-neutral-300 pl-8 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light"
                      placeholder="10 digit number"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">Include country code if outside India (eg. +1)</p>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full bg-neutral-900 hover:bg-gold-500 text-white py-4 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send Magic Link'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">Enter OTP</label>
                  <div className="relative">
                    <KeyRound className="absolute left-0 top-1 w-4 h-4 text-neutral-400" />
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-neutral-300 pl-8 pb-3 text-neutral-800 focus:outline-none focus:border-gold-500 transition-colors font-light tracking-[0.5em] text-center"
                      placeholder="------"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-neutral-900 hover:bg-gold-500 text-white py-4 uppercase tracking-[0.2em] text-sm transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="w-full text-xs text-neutral-500 hover:text-gold-500 uppercase tracking-widest py-2 transition-colors"
                >
                  Back
                </button>
              </form>
            )
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-neutral-200"></div>
            <span className="text-xs uppercase tracking-widest text-neutral-400">Or continue with</span>
            <div className="flex-1 border-t border-neutral-200"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-neutral-200 text-neutral-600 hover:bg-cream-50 py-4 mt-6 uppercase tracking-[0.2em] text-sm transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

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
