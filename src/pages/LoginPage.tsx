import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    }
  };

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <KarakalpakPattern className="absolute inset-0 opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10 cinematic-glow"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-red flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-xl">
            <span className="text-2xl font-bold">AK</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase text-white">AFISHA-KK</h1>
          <p className="text-neutral-500 text-sm">{t('discover')}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs mb-6 text-center italic">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isEmailLogin ? (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white text-black hover:bg-neutral-200 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                {t('login')} with Google
              </button>
              
              <button
                onClick={() => setIsEmailLogin(true)}
                className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-colors"
              >
                <Mail className="w-5 h-5 text-brand-gold" />
                {t('login')} with Email
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleEmailAction}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-amber transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-amber transition-all"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-brand-red text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
              >
                {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isRegistering ? t('signup') : t('login')}
              </button>

              <div className="flex justify-between items-center px-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs font-bold text-brand-gold hover:underline uppercase"
                >
                  {isRegistering ? "Already have account? Login" : "Need account? Register"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmailLogin(false)}
                  className="text-xs font-bold text-neutral-500 hover:text-white uppercase"
                >
                  Back
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center mt-10 text-[10px] text-neutral-600 uppercase tracking-widest font-bold">
          SECURE AUTHENTICATION POWERED BY FIREBASE
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
