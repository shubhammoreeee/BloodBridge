import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Activity, AlertTriangle, Thermometer } from 'lucide-react';
import { leaderboard } from '../data/mockData';
import { useAppStore, type BloodGroup } from '../store/useAppStore';

export default function LeaderboardAndInventory() {
    const { inventory } = useAppStore();

    return (
        <section className="py-24 bg-stone-900/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Leaderboard */}
                    <div id="leaderboard">
                        <div className="flex items-center gap-4 mb-10">
                            <Trophy className="w-10 h-10 text-amber-500" />
                            <div>
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Top Lifesavers</h2>
                                <p className="text-stone-400">Our most dedicated blood donors this month.</p>
                            </div>
                        </div>

                        <div className="glass rounded-[2.5rem] overflow-hidden border-white/5">
                            <div className="p-4 bg-white/5 grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-stone-500 border-b border-white/10">
                                <div className="col-span-2 px-4">Rank</div>
                                <div className="col-span-6">Donor</div>
                                <div className="col-span-2 text-center">Donations</div>
                                <div className="col-span-2 text-right px-4">Points</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {leaderboard.map((donor, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        className="p-5 grid grid-cols-12 items-center hover:bg-white/5 transition-colors"
                                    >
                                        <div className="col-span-2 flex justify-center">
                                            {idx === 0 ? <Crown className="w-6 h-6 text-amber-500" /> :
                                                idx === 1 ? <Medal className="w-5 h-5 text-stone-300" /> :
                                                    idx === 2 ? <Medal className="w-5 h-5 text-orange-600" /> :
                                                        <span className="text-stone-600 font-bold">{donor.rank}</span>}
                                        </div>
                                        <div className="col-span-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center font-bold text-sm text-stone-400">
                                                {donor.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-white font-semibold">{donor.name}</span>
                                        </div>
                                        <div className="col-span-2 text-center text-stone-400 font-medium">
                                            {donor.donations}
                                        </div>
                                        <div className="col-span-2 text-right px-4 text-blood-400 font-bold">
                                            {donor.points}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Blood Bank Inventory */}
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <Activity className="w-10 h-10 text-blood-500" />
                            <div>
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Global Inventory</h2>
                                <p className="text-stone-400">Real-time stock monitoring across all regional banks.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {(Object.entries(inventory) as [BloodGroup, number][]).map(([group, stock]) => (
                                <div
                                    key={group}
                                    className="glass p-4 rounded-3xl border-white/5 relative overflow-hidden group"
                                >
                                    <div className={`absolute bottom-0 left-0 h-1 bg-blood-600 transition-all duration-1000`} style={{ width: `${Math.min(stock, 100)}%` }} />
                                    <div className="text-blood-500 font-black text-2xl mb-1">{group}</div>
                                    <div className="text-xs text-stone-500 font-bold uppercase">{stock} Units</div>
                                    <div className={`mt-2 text-[8px] font-black tracking-tighter uppercase px-2 py-0.5 rounded-full inline-block ${stock < 20 ? 'bg-rose-500/20 text-rose-500' :
                                            stock < 50 ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                                        }`}>
                                        {stock < 20 ? 'Critical' : stock < 50 ? 'Low' : 'Stable'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="glass p-8 rounded-[2rem] border-white/5 border-dashed border-2">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2 text-gradient">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Critical Shortage Heatmap
                                </h4>
                            </div>
                            <div className="h-48 rounded-2xl bg-stone-900/50 flex flex-col items-center justify-center text-center p-6 border border-white/5 relative overflow-hidden">
                                <div className="w-full h-full absolute inset-0 opacity-10 pointer-events-none">
                                    <svg width="100%" height="100%">
                                        <pattern id="grid-mini" width="30" height="30" patternUnits="userSpaceOnUse">
                                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                                        </pattern>
                                        <rect width="100%" height="100%" fill="url(#grid-mini)" />
                                    </svg>
                                </div>
                                <Thermometer className="w-12 h-12 text-blood-500 mb-4 animate-pulse" />
                                <p className="text-xs text-stone-500 max-w-xs uppercase font-black tracking-widest">Metropolitan Area Analysis</p>
                                <div className="mt-4 flex gap-2">
                                    <div className="px-3 py-1 bg-blood-600 text-white text-[10px] font-bold rounded-lg">ZONE A (High)</div>
                                    <div className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-lg">ZONE B (Med)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
