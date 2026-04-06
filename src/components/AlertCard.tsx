import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useRequests } from '../lib/hooks/useRequests';
import { useAppStore } from '../store/useAppStore';

interface AlertCardProps {
  alert: any;
  onAccepted: () => void;
  onDecline: () => void;
}

export default function AlertCard({ alert, onAccepted, onDecline }: AlertCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { assignDonor } = useRequests();
  const { currentUser, addToast } = useAppStore();

  const isAccepted = alert.assignedDonorId === currentUser._id || alert.status !== 'active';

  const urgencyConfig = {
    Critical: 'border-red-500',
    Urgent: 'border-[var(--orange-500)]',
    Normal: 'border-green-500'
  }[alert.urgency] || 'border-stone-500';

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await assignDonor(alert._id, currentUser._id);
      addToast('Successfully accepted donation request!', 'success');
      onAccepted();
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Failed to accept request', 'alert');
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={!isAccepted ? { y: -2, scale: 1.01 } : {}}
      className={`bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border border-[var(--border-light)] ${!isAccepted && 'hover:shadow-md hover:border-[var(--orange-300)]'} transition-all relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${isAccepted ? 'bg-gradient-to-b from-green-400 to-green-600' : urgencyConfig}`} />
      
      {!isAccepted && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          New
        </div>
      )}

      {isAccepted && (
        <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
          ✅ You've accepted this request
        </div>
      )}

      <div className="pl-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pr-16 max-w-[85%]">
          <div>
            <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
               alert.urgency === 'Critical' ? 'bg-red-50 text-red-600' : 
               alert.urgency === 'Urgent' ? 'bg-orange-50 text-[var(--orange-600)]' : 
               'bg-stone-100 text-stone-600'
            }`}>
              {alert.urgency}
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] leading-tight">
              {alert.hospitalName}
            </h3>
          </div>
        </div>

        {/* Big Alert Display */}
        <div className="flex items-end gap-4 mb-4">
          <div className="font-display text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-700)] leading-none tracking-tighter">
            {alert.bloodGroup}
          </div>
          <div className="pb-1">
            <div className="font-body text-[15px] font-semibold text-[var(--text-primary)]">
              {alert.unitsRequired} units required
            </div>
            <div className="text-[12px] font-medium text-green-600 flex items-center gap-1">
              ✓ Your {currentUser.bloodGroup} is compatible
            </div>
          </div>
        </div>

        {/* Location Row */}
        <div className="flex items-center gap-2 text-[14px] text-[var(--text-muted)] mb-6 font-medium">
          <MapPin className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
          <span className="truncate">{alert.location?.address || 'Location unavailable'}</span>
          <span className="shrink-0 text-stone-400">&bull;</span>
          <span className="shrink-0 font-bold text-[var(--orange-600)]">~ {alert.distance || '2.3'} km</span>
        </div>

        {/* Actions */}
        {!isAccepted && (
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-light)] relative">
            <AnimatePresence mode="wait">
              {isConfirming ? (
                <motion.div 
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full flex items-center flex-col sm:flex-row gap-3"
                >
                  <div className="text-sm font-bold text-[var(--text-primary)] text-center sm:text-left flex-grow">
                    Confirm commitment to donate?
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsConfirming(false)}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAccept}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 flex justify-center"
                    >
                      {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-between"
                >
                  <button onClick={onDecline} className="text-[13px] font-bold text-[var(--text-muted)] hover:text-stone-800 transition-colors px-2 py-2">
                    I Cannot Help
                  </button>
                  <button 
                    onClick={() => setIsConfirming(true)}
                    className="group bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:shadow-[var(--shadow-md)] transition-all transform hover:-translate-y-0.5"
                  >
                    Accept & Respond
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
