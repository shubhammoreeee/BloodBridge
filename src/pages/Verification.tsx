import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { useAppStore } from '../store/useAppStore';
import { 
  User, Phone, Droplet, MapPin, 
  ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Building2, Lock
} from 'lucide-react';
import { pageVariants, slideFromRight } from '../components/animations';

export default function Verification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { registerDonor, registerAdmin } = useAuth();
  const { addToast } = useAppStore();
  
  const role = location.state?.role || 'donor';
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Donor Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    bloodGroup: '',
    dob: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  // Admin Form State
  const [adminData, setAdminData] = useState({
    hospitalName: '',
    employeeId: '',
    password: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  // Get location when entering location steps
  useEffect(() => {
    if ((role === 'donor' && step === 3) || (role === 'admin' && step === 2)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { 
              latitude: pos.coords.latitude.toString(), 
              longitude: pos.coords.longitude.toString() 
            };
            if (role === 'donor') setFormData(prev => ({ ...prev, ...coords }));
            else setAdminData(prev => ({ ...prev, ...coords }));
          },
          () => addToast('Could not automatically determine your location', 'info')
        );
      }
    }
  }, [step, role, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (role === 'donor') {
        const data = {
          ...formData,
          location: {
            address: formData.address,
            coordinates: [parseFloat(formData.longitude) || 0, parseFloat(formData.latitude) || 0]
          }
        };
        await registerDonor(data);
        addToast('Welcome to BloodBridge!', 'success');
        navigate('/donor');
      } else {
        const data = {
          ...adminData,
          location: {
            address: adminData.address,
            coordinates: [parseFloat(adminData.longitude) || 0, parseFloat(adminData.latitude) || 0]
          }
        };
        await registerAdmin(data);
        addToast('Hospital registered successfully', 'success');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => { setError(''); setStep(s => s + 1); };
  const prevStep = () => { setError(''); setStep(s => s - 1); };

  const DonorSteps = [
    // Step 1: Basic Info
    (
      <motion.div key="step1" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input 
              type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Date of Birth</label>
          <input 
            type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
            className="w-full px-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
          />
        </div>
        <button type="button" onClick={nextStep} disabled={!formData.name || !formData.dob}
          className="w-full mt-6 py-4 rounded-xl bg-[var(--bg-dark)] hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    ),
    // Step 2: Blood Group & Security
    (
      <motion.div key="step2" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Select Blood Group</label>
          <div className="grid grid-cols-4 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <button
                key={bg} type="button" onClick={() => setFormData({...formData, bloodGroup: bg})}
                className={`py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                  formData.bloodGroup === bg 
                    ? 'bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] text-white shadow-md border-transparent' 
                    : 'bg-white border border-[var(--border-light)] text-[var(--text-primary)] hover:border-[var(--orange-300)]'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5 mt-4">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input 
              type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="10-digit number" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input 
              type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="Secure password" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={prevStep} className="px-5 py-4 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] font-bold hover:bg-stone-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={nextStep} disabled={!formData.bloodGroup || !formData.phone || !formData.password}
            className="flex-1 py-4 rounded-xl bg-[var(--bg-dark)] hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    ),
    // Step 3: Location
    (
      <motion.div key="step3" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Full Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-[var(--text-muted)] w-5 h-5" />
            <textarea 
              required rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="Street address, City, State" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--orange-500)] outline-none resize-none"
            />
          </div>
        </div>
        <div className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-light)] flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--orange-500)] shrink-0" />
          <div>
            <h4 className="font-bold text-[14px] text-[var(--text-primary)]">Location Privacy</h4>
            <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-snug">Your exact location is encrypted and never shared publicly. It is strictly used to match you with critical emergencies in your immediate vicinity.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={prevStep} className="px-5 py-4 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] font-bold hover:bg-stone-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button type="submit" disabled={!formData.address || isLoading}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
            {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Complete Registration</>}
          </button>
        </div>
      </motion.div>
    )
  ];

  const AdminSteps = [
    // Admin Step 1
    (
      <motion.div key="admin1" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Hospital Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input 
              type="text" required value={adminData.hospitalName} onChange={e => setAdminData({...adminData, hospitalName: e.target.value})}
              placeholder="e.g. City General Hospital" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--bg-dark)] outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Official Employee/License ID</label>
          <input 
            type="text" required value={adminData.employeeId} onChange={e => setAdminData({...adminData, employeeId: e.target.value})}
            placeholder="HOS-XXXXX" 
            className="w-full px-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--bg-dark)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Admin Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input 
              type="password" required value={adminData.password} onChange={e => setAdminData({...adminData, password: e.target.value})}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--bg-dark)] outline-none"
            />
          </div>
        </div>
        <button type="button" onClick={nextStep} disabled={!adminData.hospitalName || !adminData.employeeId || !adminData.password}
          className="w-full mt-6 py-4 rounded-xl bg-[var(--bg-dark)] hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    ),
    // Admin Step 2
    (
      <motion.div key="admin2" variants={slideFromRight} initial="initial" animate="animate" exit="exit" className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Hospital Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-[var(--text-muted)] w-5 h-5" />
            <textarea 
              required rows={3} value={adminData.address} onChange={e => setAdminData({...adminData, address: e.target.value})}
              placeholder="Official hospital street address" 
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--border-light)] rounded-xl font-medium focus:ring-2 focus:ring-[var(--bg-dark)] outline-none resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={prevStep} className="px-5 py-4 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] font-bold hover:bg-stone-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button type="submit" disabled={!adminData.address || isLoading}
            className="flex-1 py-4 rounded-xl bg-[var(--bg-dark)] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
            {isLoading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Complete Setup</>}
          </button>
        </div>
      </motion.div>
    )
  ];

  return (
    <motion.div 
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-4 py-12 relative"
    >
      <div className="absolute inset-0 noise opacity-30 mix-blend-overlay pointer-events-none" />
      
      <div className="w-full max-w-lg mx-auto relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`w-16 h-16 mx-auto rounded-3xl mb-4 flex items-center justify-center shadow-[var(--shadow-md)] ${role === 'admin' ? 'bg-[var(--bg-dark)] text-white' : 'bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] text-white'}`}>
            {role === 'admin' ? <Building2 className="w-8 h-8" /> : <Droplet className="w-8 h-8" fill="currentColor" />}
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">
            {role === 'admin' ? 'Hospital Verification' : 'Join the Donor Fleet'}
          </h1>
          <p className="font-body text-sm text-[var(--text-muted)] mt-2 font-medium">
            {role === 'admin' ? 'Step 2 of 2: Location Config' : `Step ${step} of 3: ${['Basic Info', 'Blood Group', 'Location'][step-1]}`}
          </p>
        </div>

        {/* Stepper Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: role === 'admin' ? 2 : 3 }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i + 1 === step ? `w-8 ${role === 'admin' ? 'bg-[var(--bg-dark)]' : 'bg-[var(--orange-500)]'}` : 'w-2 bg-stone-200'
            }`} />
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-[var(--bg-card)] rounded-[2rem] p-6 sm:p-10 shadow-[var(--shadow-lg)] border border-[var(--border-light)] w-full">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-3 border border-red-100">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {role === 'donor' ? DonorSteps[step - 1] : AdminSteps[step - 1]}
            </AnimatePresence>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm font-bold text-[var(--text-secondary)]">
          Changed your mind? <button onClick={() => navigate('/role-selection')} className="text-[var(--orange-600)] hover:underline">Go back</button>
        </p>
      </div>
    </motion.div>
  );
}
