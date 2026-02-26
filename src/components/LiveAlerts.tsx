import { motion } from 'framer-motion';
import { MapPin, Clock, Check, X } from 'lucide-react';
import { emergencyRequests } from '../data/mockData';

export default function LiveAlerts() {
    return (
        <section className="py-24 bg-stone-900/40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Live Emergency Alerts</h2>
                        <p className="text-stone-400">Real-time requests in your current area.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blood-600/10 text-blood-500 px-4 py-2 rounded-full border border-blood-600/20">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blood-500"></span>
                        </span>
                        <span className="text-sm font-bold tracking-wider">LIVE</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {emergencyRequests.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass p-6 rounded-[2rem] border-white/5 hover:border-blood-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blood-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white">
                                        {request.type}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{request.location}</h4>
                                        <div className="flex items-center text-xs text-stone-500 gap-1">
                                            <Clock className="w-3 h-3" /> {request.time}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${request.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                                    }`}>
                                    {request.urgency}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
                                <MapPin className="w-4 h-4 text-blood-400" />
                                <span>Located approximately <b className="text-white">{request.distance}</b> away</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold">
                                    <X className="w-4 h-4" /> Decline
                                </button>
                                <button className="bg-blood-600 hover:bg-blood-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold shadow-lg shadow-blood-900/20 hover:scale-[1.05]">
                                    <Check className="w-4 h-4" /> Accept
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
