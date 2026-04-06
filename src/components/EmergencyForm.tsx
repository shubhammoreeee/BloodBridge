import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Droplet, Users, HeartPulse, Send } from 'lucide-react';
import { useRequests } from '../lib/hooks/useRequests';
import { useAppStore } from '../store/useAppStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyForm({ isOpen, onClose }: Props) {
  const { createRequest } = useRequests();
  const { currentUser, addToast } = useAppStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsRequired: 1,
    urgency: 'Urgent',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Explicitly pass coordinate data from the store to ensure backend doesn't use stale/default data
      const requestPayload = {
        ...formData,
        location: currentUser?.location || {
          type: 'Point',
          coordinates: [72.8621, 19.2841], // Mumbai fallback
          address: 'Wockhardt Hospital, Mira Road'
        }
      };
      await createRequest(requestPayload);
      addToast('Emergency Request broadcasted successfully. Searching for nearby donors...', 'success');
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to broadcast request', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-[var(--bg-base)] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border-light)] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 sm:p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none mix-blend-overlay">
              <HeartPulse className="w-48 h-48" />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black">Declare Emergency</h2>
                  <p className="text-red-100 text-sm font-medium">Broadcast immediate request to nearby compatible donors</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-[var(--bg-card)]">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Blood Group */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Required Blood Group</label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <button
                      key={bg} type="button" onClick={() => setFormData({...formData, bloodGroup: bg})}
                      className={`py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                        formData.bloodGroup === bg 
                          ? 'bg-red-500 text-white shadow-md border-transparent' 
                          : 'bg-[var(--bg-subtle)] border border-[var(--border-light)] text-[var(--text-primary)] hover:border-red-300'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units & Urgency */}
              <div className="space-y-6">
                <div>
                   <label className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)] mb-2">
                     Units Required <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs">{formData.unitsRequired} Units</span>
                   </label>
                   <div className="flex items-center gap-3">
                     <button type="button" onClick={() => setFormData(f => ({...f, unitsRequired: Math.max(1, f.unitsRequired - 1)}))} className="w-10 h-10 rounded-lg border border-[var(--border-light)] bg-[var(--bg-base)] flex items-center justify-center font-bold text-lg hover:bg-stone-100">-</button>
                     <input type="number" min="1" max="10" value={formData.unitsRequired} onChange={(e) => setFormData(f => ({...f, unitsRequired: parseInt(e.target.value)||1}))} className="flex-1 w-full text-center py-2 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-lg font-bold" />
                     <button type="button" onClick={() => setFormData(f => ({...f, unitsRequired: Math.min(10, f.unitsRequired + 1)}))} className="w-10 h-10 rounded-lg border border-[var(--border-light)] bg-[var(--bg-base)] flex items-center justify-center font-bold text-lg hover:bg-stone-100">+</button>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Urgency Level</label>
                  <div className="flex bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-light)]">
                    {['Normal', 'Urgent', 'Critical'].map(level => (
                      <button
                        key={level} type="button" onClick={() => setFormData({...formData, urgency: level})}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          formData.urgency === level 
                             ? (level === 'Critical' ? 'bg-red-500 text-white shadow-sm' : level === 'Urgent' ? 'bg-[var(--orange-500)] text-white shadow-sm' : 'bg-green-500 text-white shadow-sm')
                             : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Medical Notes (Optional)</label>
              <textarea 
                rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="e.g. For open heart surgery. Requires immediate arrival." 
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none text-[14px]"
              />
            </div>

            <div className="pt-2">
               <button 
                 type="submit" disabled={isLoading || !formData.bloodGroup}
                 className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-red-500 to-red-700 shadow-lg hover:shadow-xl disabled:opacity-50"
               >
                 {isLoading 
                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                    : <><Send className="w-5 h-5" /> Broadcast Emergency Request</>}
               </button>
            </div>
            
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
