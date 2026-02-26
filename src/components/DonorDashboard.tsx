import { motion } from 'framer-motion';
import { Award, Calendar, Droplet, History, TrendingUp } from 'lucide-react';
import { donorHistory } from '../data/mockData';

export default function DonorDashboard() {
    return (
        <section id="dashboard" className="py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-12">Donor Dashboard</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass rounded-[2.5rem] p-8 relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blood-600/10 blur-3xl -mr-16 -mt-16" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-stone-800 border-4 border-blood-600 p-1 mb-4">
                                <div className="w-full h-full rounded-full bg-stone-700 flex items-center justify-center text-3xl font-bold text-white">
                                    JD
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white">John Doe</h3>
                            <p className="text-stone-500 mb-6">Platinum Donor</p>

                            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-stone-900/50 rounded-2xl p-4 border border-white/5">
                                    <div className="text-stone-500 text-xs mb-1 uppercase font-black">Blood Group</div>
                                    <div className="text-2xl font-bold text-blood-500">O+</div>
                                </div>
                                <div className="bg-stone-900/50 rounded-2xl p-4 border border-white/5">
                                    <div className="text-stone-500 text-xs mb-1 uppercase font-black">Points</div>
                                    <div className="text-2xl font-bold text-white">1,250</div>
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-stone-400">Eligibility Status</span>
                                    <span className="text-green-500 font-bold flex items-center gap-1">
                                        <Droplet className="w-4 h-4" /> Eligible
                                    </span>
                                </div>
                                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                                <p className="text-[10px] text-stone-500 italic">You last donated 124 days ago. You are eligible to donate today!</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity & History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass p-6 rounded-3xl border-white/5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                        <Award className="text-amber-500 w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-bold">Rewards Earned</h4>
                                </div>
                                <p className="text-stone-400 text-sm mb-4">3 more donations until your next free health checkup.</p>
                                <div className="w-full bg-stone-800 h-2 rounded-full mb-2">
                                    <div className="w-1/3 h-full bg-amber-500" />
                                </div>
                                <div className="text-[10px] text-right text-stone-500">1/3 MILSTONE</div>
                            </div>

                            <div className="glass p-6 rounded-3xl border-white/5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-blood-500/10 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="text-blood-500 w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-bold">Contribution</h4>
                                </div>
                                <p className="text-stone-400 text-sm">You have saved approximately <b className="text-white">9 lives</b> through your donations.</p>
                            </div>
                        </div>

                        <div className="glass rounded-[2rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                    <History className="w-5 h-5 text-blood-500" /> Donation History
                                </h4>
                                <button className="text-sm text-blood-400 hover:text-blood-300 font-semibold">View All</button>
                            </div>

                            <div className="space-y-6">
                                {donorHistory.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-blood-600 group-hover:scale-125 transition-transform" />
                                            {idx !== donorHistory.length - 1 && <div className="w-0.5 h-12 bg-white/5 mt-1" />}
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                                            <div>
                                                <div className="text-white font-bold">{item.location}</div>
                                                <div className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3" /> {item.date}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-blood-400 font-bold">+{item.points} pts</div>
                                                <div className="text-[10px] text-stone-500 uppercase">{item.units} UNIT</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

