import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    MapPin,
    Phone,
    History,
    Award,
    Zap,
    CheckCircle,
    Clock,
    Droplets,
    MessageSquare,
    Plus
} from 'lucide-react';
import { useAppStore, type BloodRequest, type DonationProgress } from '../store/useAppStore';
import { cn } from '../lib/utils';

interface DonorDetailPanelProps {
    request: BloodRequest | null;
    onClose: () => void;
}

export default function DonorDetailPanel({ request, onClose }: DonorDetailPanelProps) {
    const { updateRequestStatus, addNotification, mockDonors } = useAppStore();

    if (!request) return null;

    // Find donor info if accepted
    const donor = request.acceptedBy
        ? (mockDonors.find(d => d.name === request.acceptedBy) || {
            name: request.acceptedBy,
            bloodGroup: request.bloodType,
            distance: '2.1 km',
            points: 450,
            lastDonation: '3 months ago',
            phone: '+91 98765 43210'
        })
        : null;

    const steps: DonationProgress[] = ['Accepted', 'Traveling', 'At Hospital', 'Donating', 'Completed'];
    const currentStepIndex = request.progress ? steps.indexOf(request.progress) : -1;

    const handleAction = (nextProgress: DonationProgress, message: string) => {
        const nextStatus = nextProgress === 'Completed' ? 'Completed' : 'Accepted';
        updateRequestStatus(request.id, nextStatus, request.acceptedBy, nextProgress);
        addNotification(message, nextStatus === 'Completed' ? 'success' : 'info');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex justify-end"
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-stone-900 border-l border-white/5 h-full overflow-y-auto font-outfit relative"
                >
                    <div className="p-8 pb-32">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-white italic tracking-tighter">
                                Request <span className="text-blood-600">Details</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 text-stone-500 hover:text-white rounded-2xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Hospital Info Card */}
                        <div className="bg-stone-950 p-6 rounded-[2rem] border border-white/5 mb-8">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 bg-blood-600 rounded-[1.2rem] flex items-center justify-center text-2xl font-black text-white shadow-2xl">
                                    {request.bloodType}
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-xl leading-tight mb-1">{request.hospital}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-stone-500 uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 text-blood-500" /> {request.location}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Urgency</p>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                        request.urgency === 'Critical' ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"
                                    )}>{request.urgency}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Units Needed</p>
                                    <span className="text-white font-black">{request.units}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Status</p>
                                    <span className="text-blood-500 font-black text-[9px] uppercase tracking-widest">{request.status}</span>
                                </div>
                            </div>
                        </div>

                        {!donor ? (
                            <div className="text-center py-12 border-2 border-dashed border-stone-800 rounded-[2.5rem] bg-stone-900/50">
                                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                                    <div className="absolute inset-0 bg-blood-600/20 rounded-full animate-ping" />
                                    <Clock className="w-8 h-8 text-stone-500 animate-pulse" />
                                </div>
                                <h4 className="text-white font-black text-lg mb-1 uppercase tracking-tight">Searching for Donor</h4>
                                <p className="text-stone-500 text-xs px-10">System is broadcasting signals to local {request.bloodType} donors.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Donor Profile */}
                                <div>
                                    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">Life-Saver Profile</h4>
                                    <div className="bg-stone-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blood-600/5 blur-3xl" />

                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-20 h-20 bg-blood-600 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl relative">
                                                {donor.name[0]}
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-stone-900 flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-black text-2xl leading-tight mb-1">{donor.name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-stone-500 uppercase">
                                                        <Droplets className="w-3 h-3 text-blood-500" /> {donor.bloodGroup}
                                                    </span>
                                                    <span className="w-1 h-1 bg-stone-800 rounded-full" />
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-stone-500 uppercase">
                                                        <MapPin className="w-3 h-3 text-blue-500" /> {donor.distance || '2.1 KM'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Rewards</p>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-amber-500" />
                                                    <span className="text-white font-black text-sm">{(donor as any).points || 450} Pts</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Last Date</p>
                                                <div className="flex items-center gap-2">
                                                    <History className="w-4 h-4 text-blue-500" />
                                                    <span className="text-white font-black text-sm">{(donor as any).lastDonation || '3m ago'}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-green-500" />
                                                    <span className="text-white font-black text-sm">{(donor as any).phone || '+91 98765 43210'}</span>
                                                </div>
                                                <button className="p-2 bg-blood-600 rounded-xl text-white">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Donation Progress */}
                                <div>
                                    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4">Donation Mission Status</h4>
                                    <div className="bg-stone-900 border border-white/5 rounded-[2.5rem] p-8">
                                        <div className="space-y-6">
                                            {steps.map((step, idx) => {
                                                const isPast = idx < currentStepIndex;
                                                const isCurrent = idx === currentStepIndex;

                                                return (
                                                    <div key={step} className="flex gap-4 group">
                                                        <div className="flex flex-col items-center">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                                                                isPast ? "bg-green-500 border-green-400" :
                                                                    isCurrent ? "bg-blood-600 border-blood-400 animate-pulse" :
                                                                        "bg-stone-800 border-white/5"
                                                            )}>
                                                                {isPast ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                                                            </div>
                                                            {idx !== steps.length - 1 && (
                                                                <div className={cn(
                                                                    "w-px h-10 transition-colors duration-300",
                                                                    isPast ? "bg-green-500" : "bg-stone-800"
                                                                )} />
                                                            )}
                                                        </div>
                                                        <div className="pt-0.5">
                                                            <h5 className={cn(
                                                                "font-black text-sm uppercase tracking-tight",
                                                                isPast ? "text-green-500" : isCurrent ? "text-white" : "text-stone-600"
                                                            )}>{step}</h5>
                                                            {isCurrent && <p className="text-[9px] text-blood-500 font-bold uppercase mt-1">Live Action Required</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Persistent Footer Actions */}
                    {donor && request.status !== 'Completed' && (
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-stone-900/95 backdrop-blur-md border-t border-white/5">
                            <div className="grid grid-cols-1 gap-4">
                                {request.progress === 'Accepted' && (
                                    <button
                                        onClick={() => handleAction('Traveling', 'Pickup request assigned to donor.')}
                                        className="w-full blood-gradient text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blood-900/40"
                                    >
                                        <Zap className="w-5 h-5" /> Assign Pickup
                                    </button>
                                )}
                                {request.progress === 'Traveling' && (
                                    <button
                                        onClick={() => handleAction('At Hospital', 'Donor status updated to: Arrived at Facility.')}
                                        className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40"
                                    >
                                        <MapPin className="w-5 h-5" /> Mark Reached Hospital
                                    </button>
                                )}
                                {request.progress === 'At Hospital' && (
                                    <button
                                        onClick={() => handleAction('Donating', 'Blood extraction process started.')}
                                        className="w-full bg-amber-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/40"
                                    >
                                        <Plus className="w-5 h-5" /> Start Donation Process
                                    </button>
                                )}
                                {request.progress === 'Donating' && (
                                    <button
                                        onClick={() => handleAction('Completed', 'Donation MISSION COMPLETED. Point awarded.')}
                                        className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-green-900/40"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Mark Donation Completed
                                    </button>
                                )}
                                <button className="w-full bg-white/5 text-stone-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5">
                                    <MessageSquare className="w-4 h-4" /> Contact Emergency Response
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
