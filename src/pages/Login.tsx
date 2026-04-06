import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { useAppStore } from '../store/useAppStore';
import { Droplet, Phone, Lock, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { pageVariants, slideFromRight } from '../components/animations';

export default function Login() {
  const navigate = useNavigate();
  const { loginDonor, loginAdmin } = useAuth();
  const { addToast } = useAppStore();
  
  const [role, setRole] = useState<'donor' | 'admin'>('donor');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (role === 'donor') {
        await loginDonor(phone, password);
        addToast('Successfully signed in as Donor', 'success');
        navigate('/donor');
      } else {
        await loginAdmin(employeeId, password);
        addToast('Successfully signed in as Hospital Admin', 'success');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[var(--bg-base)] flex"
    >
      {/* Left Panel - Visual/Brand */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[var(--orange-50)] to-[var(--bg-inset)] overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 noise opacity-30 mix-blend-overlay" />
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <Droplet className="text-[var(--orange-500)] w-8 h-8" fill="currentColor" />
          <span className="font-display font-black text-2xl text-[var(--text-primary)] tracking-tight">BloodBridge</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-[var(--shadow-xl)] relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--orange-400)]/30 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="font-display text-4xl font-extrabold text-[var(--text-primary)] mb-6 leading-tight">
              Welcome back to the network.
            </h2>
            <p className="font-body text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
              Every drop makes a difference. Sign in to track your impact, view emergency requests, and continue saving lives.
            </p>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-[var(--orange-300)] to-[var(--orange-500)] flex items-center justify-center text-white font-bold shadow-sm z-[${5-i}]`}>
                    D{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Join 10,000+ active donors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-20 relative">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <Droplet className="text-[var(--orange-500)] w-6 h-6" fill="currentColor" />
          <span className="font-display font-black text-lg">BloodBridge</span>
        </div>

        <div className="w-full max-w-[440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)] mb-2">Sign In</h1>
            <p className="font-body text-[var(--text-secondary)] font-medium mb-8">
              Access your dashboard to continue.
            </p>

            {/* Role Switcher */}
            <div className="flex p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-light)] mb-8 relative z-0">
              <div className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out z-0" 
                   style={{ left: role === 'donor' ? '4px' : 'calc(50% + 0px)' }} />
              
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${role === 'donor' ? 'text-[var(--orange-600)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${role === 'admin' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                Hospital Admin
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {role === 'donor' ? (
                  <motion.div key="donorFields" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] focus:border-[var(--orange-500)] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="adminFields" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Employee/Hospital ID</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          placeholder="e.g. HOS-12345"
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--bg-dark)] focus:border-[var(--bg-dark)] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] focus:border-[var(--orange-500)] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 ${
                  role === 'admin' ? 'bg-[var(--bg-dark)]' : 'bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)]'
                }`}
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[var(--text-secondary)] font-medium text-sm">
                Don't have an account?{' '}
                <button onClick={() => navigate('/role-selection')} className="text-[var(--orange-600)] font-bold hover:underline">
                  Create one now
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
