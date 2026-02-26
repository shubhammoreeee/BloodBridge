import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Activity, Filter, MapPin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import AlertCard from '../components/AlertCard';

export default function DonorNotifications() {
    const { requests, donorProfile } = useAppStore();

    const matchingAlerts = requests.filter(r =>
        r.status === 'Pending' && (r.bloodType === donorProfile.bloodGroup || r.bloodType === 'O-')
    );

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                        <Bell className="text-blood-500 w-10 h-10" />
                        Emergency <span className="text-blood-600 italic">Alerts</span>
                    </h1>
                    <p className="text-stone-400">Live requests matching your blood type in your current area.</p>
                </div>

                <div className="flex bg-stone-900/50 p-1 rounded-2xl border border-white/5">
                    <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blood-600 text-white shadow-lg">New Alerts</button>
                    <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-all">Past Alerts</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {matchingAlerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 lg:col-span-3 py-24 text-center glass rounded-[3rem] border-white/5"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Activity className="w-10 h-10 text-stone-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">System Scanning...</h3>
                            <p className="text-stone-500 text-sm max-w-sm mx-auto font-medium">We haven't found any active emergencies matching your profile in this location right now.</p>
                        </motion.div>
                    ) : (
                        matchingAlerts.map(alert => (
                            <AlertCard key={alert.id} alert={alert} />
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 p-8 glass rounded-[2.5rem] border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blood-600/10 rounded-2xl flex items-center justify-center border border-blood-500/20">
                        <MapPin className="text-blood-500 w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-lg">Location Filtering is Active</h4>
                        <p className="text-stone-500 text-sm font-medium">You are only seeing alerts within 10km of {donorProfile.location}.</p>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Filter className="w-4 h-4" /> Change Radius
                </button>
            </div>
        </div>
    );
}
