import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Phone, CheckCircle2, MapPin, Activity, ShieldAlert } from 'lucide-react';
import BloodGroupBadge from './BloodGroupBadge';
import StatusBadge from './StatusBadge';
import { useRequests } from '../lib/hooks/useRequests';
import { useAppStore } from '../store/useAppStore';
import MissionTracker from './MissionTracker';

interface Props {
  request: any | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DonorDetailPanel({ request, onClose, onUpdate }: Props) {
  const { updateStatus } = useRequests();
  const { addToast } = useAppStore();
  const [isLoading, setIsLoading] = React.useState(false);

  if (!request) return null;

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      await updateStatus(request._id, newStatus);
      if (newStatus === 'cancelled' || newStatus === 'completed') {
        useAppStore.getState().removeRequest(request._id);
        onClose();
      }
      addToast(`Request marked as ${newStatus}`, 'success');
      onUpdate();
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Failed to update status', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const StatusTimeline = () => {
    const steps = ['searching', 'matched', 'traveling', 'at_hospital', 'donating', 'completed'];
    const currentIndex = steps.indexOf(request.status);

    return (
      <div className="bg-[var(--bg-subtle)] p-5 rounded-2xl border border-[var(--border-light)] mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Live Mission Status</h4>
        <div className="relative flex justify-between">
           <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border-light)] -translate-y-1/2 rounded-full" />
           <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${Math.max(0, currentIndex) / (steps.length - 1) * 100}%` }} />
           
           {steps.map((step, i) => (
             <div key={step} className={`relative z-10 w-4 h-4 rounded-full border-2 ${
               i <= currentIndex ? 'bg-green-500 border-green-500 shadow-[var(--shadow-glow-green)]' : 'bg-[var(--bg-card)] border-[var(--border-light)]'
             }`} title={step.replace('_', ' ')} />
           ))}
        </div>
        <div className="text-center mt-3 font-bold text-[14px] text-[var(--text-primary)] capitalize">
           {request.status.replace('_', ' ')}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
      />
      
      <motion.div 
        initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 bottom-0 right-0 w-full sm:w-[440px] bg-[var(--bg-card)] border-l border-[var(--border-light)] z-[100] shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Emergency Details</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium font-mono mt-0.5">ID: {request._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-subtle)] rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          <div className="flex items-start justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <StatusBadge status={request.status} />
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                   request.urgency === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-[var(--orange-50)] text-[var(--orange-600)]'
                 }`}>{request.urgency}</span>
               </div>
               <div className="font-body text-sm text-[var(--text-muted)] flex items-center gap-2">
                  <Activity className="w-4 h-4"/> {request.unitsRequired} Units Required
               </div>
             </div>
             <BloodGroupBadge group={request.bloodGroup} size="lg" />
          </div>

          <StatusTimeline />

          {request.notes && (
             <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
               <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/>
               <div>
                  <h4 className="font-bold text-red-800 text-sm mb-1">Medical Notes</h4>
                  <p className="text-sm text-red-700">{request.notes}</p>
               </div>
             </div>
          )}

          {request.assignedDonorId ? (
            <div className="border border-[var(--border-light)] rounded-[1.5rem] overflow-hidden">
               <div className="bg-[var(--bg-subtle)] p-4 border-b border-[var(--border-light)] flex justify-between items-center">
                 <h4 className="font-bold text-[var(--text-primary)]">Assigned Donor</h4>
                 <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--orange-500)] shadow-sm"><Phone className="w-4 h-4" /></button>
                 </div>
               </div>
               <div className="p-5">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] text-white font-black text-2xl flex flex-shrink-0 flex-col items-center justify-center">
                      {request.assignedDonorId.name?.[0] || 'D'}
                   </div>
                   <div>
                     <h3 className="font-display font-bold text-lg">{request.assignedDonorId.name || 'Anonymous Donor'}</h3>
                     <p className="text-sm text-[var(--text-muted)] font-medium">{request.assignedDonorId.phone || 'Phone hidden'}</p>
                   </div>
                 </div>
                 
                 {['matched', 'traveling', 'at_hospital'].includes(request.status) ? (
                    <div className="mt-4 -mx-1">
                       <MissionTracker request={request} role="admin" />
                    </div>
                 ) : request.status === 'traveling' && (
                    <div className="bg-[var(--orange-50)] text-[var(--orange-800)] p-3 rounded-xl text-sm font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                         <Navigation className="w-4 h-4 text-[var(--orange-600)]"/>
                      </div>
                      Donor is currently traveling to your location. ETA ~15 mins.
                    </div>
                 )}
               </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-subtle)] rounded-2xl p-6 text-center border border-dashed border-[var(--border-light)]">
               <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm mx-auto mb-3">
                 <div className="w-4 h-4 border-2 border-[var(--orange-500)] border-t-transparent rounded-full animate-spin" />
               </div>
               <h4 className="font-bold text-[var(--text-primary)] mb-1">Searching for Match</h4>
               <p className="text-sm text-[var(--text-muted)]">Broadcasting to eligible {request.bloodGroup} donors heavily within a 10km radius...</p>
            </div>
          )}

        </div>

        {/* Action Bar */}
        {request.status !== 'completed' && request.status !== 'cancelled' && (
          <div className="p-5 border-t border-[var(--border-light)] bg-white space-y-3">
            {request.assignedDonorId && request.status === 'traveling' && (
              <button 
                disabled={isLoading} onClick={() => handleStatusChange('at_hospital')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--orange-400)] to-[var(--orange-600)] text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                 <MapPin className="w-5 h-5" /> Mark Donor as Arrived
              </button>
            )}
            {request.assignedDonorId && request.status === 'at_hospital' && (
              <button 
                disabled={isLoading} onClick={() => handleStatusChange('donating')}
                className="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                 <Activity className="w-5 h-5 animate-pulse" /> Begin Donation
              </button>
            )}
            {request.assignedDonorId && request.status === 'donating' && (
              <button 
                disabled={isLoading} onClick={() => handleStatusChange('completed')}
                className="w-full py-3.5 rounded-xl bg-green-500 text-white font-bold flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                 <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Donation Completed</span>
                 <span className="text-[10px] font-medium mt-0.5 opacity-80">(Awards 100 PTS to Donor)</span>
              </button>
            )}
            
            <button 
               disabled={isLoading} onClick={() => handleStatusChange('cancelled')}
               className="w-full py-3 rounded-xl bg-[var(--bg-subtle)] text-stone-600 font-bold hover:bg-stone-200 transition-colors"
            >
               Cancel Request
            </button>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
