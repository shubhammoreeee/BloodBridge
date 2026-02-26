import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Hospital, Droplets, Send, CheckCircle2, Loader2, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EmergencyForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        }, 2000);
    };

    return (
        <section id="emergency" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                            Request <span className="text-blood-500">Emergency</span> Blood
                        </motion.h2>
                        <p className="text-stone-400 text-lg">Broadcast an alert to all nearby donors in seconds.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-red p-8 md:p-12 rounded-[2.5rem] relative"
                    >
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-300 ml-1">Blood Group Needed</label>
                                <div className="relative">
                                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blood-400 w-5 h-5" />
                                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blood-500 transition-all appearance-none cursor-pointer">
                                        <option value="" disabled selected>Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                                            <option key={type} value={type} className="bg-stone-900">{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-300 ml-1">Units Required</label>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-blood-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        placeholder="E.g. 2"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blood-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-stone-300 ml-1">Hospital Name</label>
                                <div className="relative">
                                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 text-blood-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Enter Hospital Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blood-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-300 ml-1">Location / City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blood-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Detecting location..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blood-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-stone-300 ml-1">Urgency Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Normal', 'Urgent', 'Critical'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            className={cn(
                                                "py-4 rounded-2xl text-xs font-bold transition-all border",
                                                level === 'Critical'
                                                    ? "bg-blood-600/20 border-blood-600 text-blood-400"
                                                    : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                                            )}
                                        >
                                            {level.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <button
                                    disabled={isSubmitting}
                                    className="w-full blood-gradient text-white py-5 rounded-[2rem] font-bold text-lg shadow-lg shadow-blood-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Notifying Nearby Donors...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Request Emergency Blood
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 bg-stone-900/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 z-10"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Alert Broadcasted!</h3>
                                    <p className="text-stone-400 max-w-sm">We've notified 24 nearby donors with O+ blood type. You'll be notified as soon as someone accepts.</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-8 text-blood-400 font-semibold underline underline-offset-4"
                                    >
                                        Send another request
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

