import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Shield, MapPin, Phone } from 'lucide-react';
import { useDonor } from '../lib/hooks/useDonor';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useAppStore } from '../store/useAppStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: 'donor' | 'admin';
}

export default function ProfileEditor({ isOpen, onClose, role }: Props) {
  const { currentUser, setAuth, token, addToast } = useAppStore();
  const { updateProfile: updateDonorProfile, toggleEligibility } = useDonor();
  const { updateProfile: updateAdminProfile } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.hospitalName || '',
    phone: currentUser?.phone || currentUser?.employeeId || '',
    address: currentUser?.location?.address || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (role === 'donor') {
        const updated = await updateDonorProfile({
          name: formData.name,
          phone: formData.phone,
          location: { address: formData.address, coordinates: currentUser.location?.coordinates }
        });
        setAuth(token!, { ...currentUser, ...updated }, role);
      } else {
        const updated = await updateAdminProfile({
          hospitalName: formData.name,
          address: formData.address
        });
        setAuth(token!, { ...currentUser, ...updated }, role);
      }
      addToast('Profile updated safely.', 'success');
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEligibility = async () => {
    try {
      const updated = await toggleEligibility();
      setAuth(token!, { ...currentUser, ...updated }, role);
      addToast(`You are now marked as ${updated.isEligible ? 'eligible' : 'ineligible'} to donate.`, 'info');
    } catch {
       addToast('Failed to toggle eligibility status.', 'alert');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[var(--bg-dark)]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--bg-card)] rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[var(--border-light)]"
        >
          {/* Header */}
          <div className={`p-6 text-white ${role === 'donor' ? 'bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)]' : 'bg-[var(--bg-dark)]'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl font-bold">Profile Settings</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {role === 'donor' && (
              <div className="flex items-center justify-between bg-black/10 rounded-xl p-4 backdrop-blur-sm mt-4">
                <div>
                  <div className="font-bold text-sm">Donation Eligibility</div>
                  <div className="text-xs opacity-80 mt-1">Temporarily defer if you recently donated or are unwell.</div>
                </div>
                <button 
                  onClick={handleToggleEligibility}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--orange-500)] ${currentUser?.isEligible ? 'bg-green-500' : 'bg-white/30'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${currentUser?.isEligible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">{role === 'donor' ? 'Full Name' : 'Hospital Name'}</label>
              <input 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
              />
            </div>
            
            {role === 'donor' && (
               <div>
                 <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Phone Number</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                   <input 
                     value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full pl-11 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none"
                   />
                 </div>
               </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Primary Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                <textarea 
                  rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-light)]">
               <button 
                 type="submit" disabled={isLoading}
                 className={`w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all ${role === 'admin' ? 'bg-[var(--bg-dark)] hover:bg-black' : 'bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] shadow-md hover:shadow-lg'}`}
               >
                 {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
               </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
