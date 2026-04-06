import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Building2, CheckCircle2 } from 'lucide-react';
import { cardVariants, staggerContainer, pageVariants } from '../components/animations';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { setAuth } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<'donor' | 'admin' | null>(null);

  const handleContinue = (role: 'donor' | 'admin') => {
    // We set a temporary 'unverified' state placeholder for routing purposes 
    // real auth happens in Verification or Login
    navigate('/verification', { state: { role } });
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 noise pointer-events-none opacity-40 mix-blend-overlay" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--orange-100), transparent 70%)' }} 
      />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-4xl">💧</span>
          <span className="font-display text-2xl font-black text-[var(--text-primary)]">BloodBridge</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Choose How You Want to Help
        </h1>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="initial" animate="animate"
        className="flex flex-col md:flex-row gap-6 w-full max-w-4xl relative z-10"
      >
        {/* Donor Card */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedRole('donor')}
          className={`flex-1 bg-[var(--bg-card)] rounded-[2rem] p-8 cursor-pointer transition-all duration-300 relative border ${
            selectedRole === 'donor' 
              ? 'border-[var(--orange-500)] shadow-[var(--shadow-glow)]' 
              : 'border-[var(--border-light)] shadow-[var(--shadow-md)] hover:border-[var(--orange-300)] hover:shadow-[var(--shadow-xl)]'
          }`}
        >
          {selectedRole === 'donor' && <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] rounded-b-xl" />}
          
          <div className="absolute top-6 right-6 bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-sm">
            Most Popular
          </div>

          <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--orange-500)]/20 blur-xl rounded-full" />
            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="relative z-10 text-6xl drop-shadow-xl"
            >
              🩸
            </motion.div>
          </div>

          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] text-center mb-3">
            I'm a Donor
          </h2>
          <p className="font-body text-[15px] text-[var(--text-secondary)] text-center leading-relaxed max-w-[280px] mx-auto mb-8 font-medium">
            Receive emergency alerts matching your blood type and save lives nearby.
          </p>

          <ul className="space-y-3 mb-10 w-fit mx-auto">
            {['Blood-type matched alerts', 'Real-time location tracking', 'Earn reward badges & points'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--orange-500)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button 
            onClick={(e) => { e.stopPropagation(); handleContinue('donor'); }}
            className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${
              selectedRole === 'donor' 
                ? 'bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white shadow-md' 
                : 'bg-[var(--bg-subtle)] text-[var(--orange-600)] hover:bg-[var(--orange-100)]'
            }`}
          >
            Continue as Donor
          </button>
        </motion.div>

        {/* Admin Card */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedRole('admin')}
          className={`flex-1 bg-[var(--bg-card)] rounded-[2rem] p-8 cursor-pointer transition-all duration-300 relative border ${
            selectedRole === 'admin' 
              ? 'border-[var(--orange-500)] shadow-[var(--shadow-glow)]' 
              : 'border-[var(--border-light)] shadow-[var(--shadow-md)] hover:border-[var(--orange-300)] hover:shadow-[var(--shadow-xl)]'
          }`}
        >
          {selectedRole === 'admin' && <div className="absolute top-0 left-8 right-8 h-1 bg-[var(--bg-dark)] rounded-b-xl" />}

          <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-stone-200/50 blur-xl rounded-full" />
            <motion.div 
              animate={{ y: [-3, 3, -3] }} 
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
              className="relative z-10 w-16 h-16 rounded-full bg-[var(--bg-dark)] flex items-center justify-center shadow-lg"
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] text-center mb-3">
            I'm a Hospital
          </h2>
          <p className="font-body text-[15px] text-[var(--text-secondary)] text-center leading-relaxed max-w-[280px] mx-auto mb-8 font-medium">
            Broadcast emergency requests and coordinate donations in real-time.
          </p>

          <ul className="space-y-3 mb-10 w-fit mx-auto">
            {['Emergency broadcast system', 'Live donor coordination map', 'Blood inventory management'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--orange-500)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button 
            onClick={(e) => { e.stopPropagation(); handleContinue('admin'); }}
            className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${
              selectedRole === 'admin' 
                ? 'bg-[var(--bg-dark)] text-white shadow-md' 
                : 'bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-stone-200'
            }`}
          >
            Continue as Admin
          </button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-12 text-center relative z-10"
      >
        <p className="text-[var(--text-secondary)] font-medium">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-[var(--orange-600)] font-bold hover:underline">
            Sign In
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
