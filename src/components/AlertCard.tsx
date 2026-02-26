import { motion } from 'framer-motion';
import { MapPin, Clock, Hospital, Check, X, Bell } from 'lucide-react';
import { useAppStore, type BloodRequest } from '../store/useAppStore';
import { cn } from '../lib/utils';

interface AlertCardProps {
    alert: BloodRequest;
    onAccept?: () => void;
    onDecline?: () => void;
}

export default function AlertCard({ alert, onAccept, onDecline }: AlertCardProps) {
    const { updateRequestStatus, addNotification } = useAppStore();

    const handleAccept = () => {
        updateRequestStatus(alert.id, 'Accepted', 'me', 'Accepted');
        addNotification("Emergency request accepted. Proceed to hospital.", "success");
        onAccept?.();
    };

    const handleDecline = () => {
        updateRequestStatus(alert.id, 'Cancelled');
        addNotification("Alert dismissed.", "info");
        onDecline?.();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-stone-900/60 p-6 rounded-[2rem] border border-white/5 hover:border-blood-500/30 transition-all group relative overflow-hidden"
        >
            {alert.urgency === 'Critical' && (
                <div className="absolute top-0 right-0 p-4">
                    <Bell className="w-5 h-5 text-rose-500 animate-bounce" />
                </div>
            )}

            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blood-600/10 text-blood-500 rounded-2xl flex items-center justify-center font-black text-2xl border border-blood-500/20 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                    {alert.bloodType}
                </div>
                <div className="flex flex-col items-end">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black tracking-[0.1em] uppercase border",
                        alert.urgency === 'Critical' ? "bg-rose-500/20 text-rose-500 border-rose-500/20" : "bg-amber-500/20 text-amber-500 border-amber-500/20"
                    )}>
                        {alert.urgency}
                    </span>
                    <span className="text-[8px] text-stone-600 font-bold mt-2 uppercase tracking-tighter">Request ID: #{alert.id}</span>
                </div>
            </div>

            <h4 className="text-white font-black text-lg mb-1 tracking-tight flex items-center gap-2">
                <Hospital className="w-4 h-4 text-blood-500" /> {alert.hospital}
            </h4>
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <MapPin className="w-3.5 h-3.5 text-blood-500" /> {alert.location} (2.4 km away)
                </div>
                <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <Clock className="w-3.5 h-3.5 text-stone-500" /> Posted {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleDecline}
                    className="bg-white/5 hover:bg-white/10 text-stone-500 hover:text-white p-4 rounded-2xl flex items-center justify-center transition-all border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>
                <button
                    onClick={handleAccept}
                    className="blood-gradient text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs tracking-widest transition-all uppercase shadow-lg shadow-blood-900/20"
                >
                    <Check className="w-4 h-4" /> ACCEPT
                </button>
            </div>
        </motion.div>
    );
}
