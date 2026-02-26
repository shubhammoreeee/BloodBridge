import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    History,
    TrendingUp,
    MapPin,
    Check,
    Activity,
    Bell,
    Heart,
    Edit3
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ProfileEditor from '../components/ProfileEditor';
import { Link } from 'react-router-dom';

export default function DonorDashboard() {
    const { donorProfile, requests } = useAppStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const activeDonation = requests.find(r => r.status === 'Accepted' && (r.donorId === 'me' || r.donorId === donorProfile.name));

    const matchingAlertsCount = requests.filter(r =>
        r.status === 'Pending' && (r.bloodType === donorProfile.bloodGroup || r.bloodType === 'O-')
    ).length;

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Dashboard <span className="text-blood-600">Overview</span>
                    </h1>
                    <p className="text-stone-400">Welcome back, <span className="text-white font-bold">{donorProfile.name}</span>. You are saving lives today.</p>
                </div>

                <Link to="/notifications" className="relative group">
                    <div className="bg-stone-900 border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 hover:border-blood-500 transition-all shadow-xl">
                        <div className="relative">
                            <Bell className="w-6 h-6 text-blood-500" />
                            {matchingAlertsCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blood-600 rounded-full animate-pulse border-2 border-stone-900" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">Emergency Alerts</p>
                            <p className="text-sm font-black text-white leading-none">{matchingAlertsCount} Matches Nearby</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Stats Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blood-600/10 blur-[80px] -mr-20 -mt-20 -z-10" />

                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-8">
                                <div className="w-32 h-32 rounded-[2rem] bg-stone-900 border-2 border-blood-600 p-1 rotate-3 shadow-2xl">
                                    <div className="w-full h-full rounded-[1.5rem] bg-stone-800 flex items-center justify-center text-4xl font-black text-white -rotate-3 uppercase">
                                        {donorProfile.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="absolute -bottom-2 -right-2 bg-white text-stone-950 p-3 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-stone-950"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-1 tracking-tighter">{donorProfile.name}</h3>
                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-[10px] font-black text-blood-500 uppercase tracking-[0.2em] bg-blood-600/10 px-3 py-1 rounded-full border border-blood-600/20 shadow-sm">
                                    {donorProfile.bloodGroup} Donor
                                </span>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    Eligible
                                </span>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="bg-stone-950/50 p-5 rounded-3xl border border-white/5">
                                    <div className="text-[9px] font-black text-stone-600 uppercase mb-1 tracking-widest">Global Rank</div>
                                    <div className="text-xl font-black text-white italic">#12</div>
                                </div>
                                <div className="bg-stone-950/50 p-5 rounded-3xl border border-white/5">
                                    <div className="text-[9px] font-black text-stone-600 uppercase mb-1 tracking-widest">My Points</div>
                                    <div className="text-xl font-black text-blood-500">{donorProfile.points}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[3rem] p-8 border-white/5">
                        <h4 className="text-[10px] font-black text-stone-500 mb-8 uppercase tracking-[0.3em]">Lifetime Engagement</h4>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                                    <TrendingUp className="text-rose-500 w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{donorProfile.donationsCount}</div>
                                    <div className="text-[10px] font-black text-stone-600 uppercase tracking-widest mt-1">Units Contributed</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                    <Heart className="text-blue-500 w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{donorProfile.donationsCount * 3}</div>
                                    <div className="text-[10px] font-black text-stone-600 uppercase tracking-widest mt-1">Estimated Lives Saved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Donation Tracker */}
                    {activeDonation && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="blood-gradient p-10 rounded-[3rem] shadow-2xl shadow-blood-900/60 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Activity className="w-48 h-48" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 bg-black/20 text-white w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Active Matching Proceeding
                                </div>
                                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">Proceed to {activeDonation.hospital}</h3>
                                <p className="text-blood-100 mb-10 max-w-md font-medium text-lg leading-relaxed opacity-90">Please arrive at the facility. Your matching profile has been verified by the medical team.</p>

                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-white text-blood-700 px-10 py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.05] transition-all shadow-2xl">
                                        <MapPin className="w-5 h-5 inline mr-2" /> Navigate
                                    </button>
                                    <button className="bg-black/20 text-white border border-white/20 px-10 py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase hover:bg-black/40 transition-all">
                                        Help Support
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Donation Timeline / History Placeholder */}
                    <div className="glass rounded-[3rem] p-10 border-white/5 h-full">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <History className="text-stone-500 w-8 h-8" />
                                Donation <span className="text-blood-600">Timeline</span>
                            </h2>
                        </div>

                        <div className="relative border-l-2 border-white/5 ml-4 pl-12 space-y-12 pb-4">
                            {[
                                { date: 'Oct 15, 2023', hospital: 'City General', status: 'Completed', reward: '+50 pts' },
                                { date: 'July 22, 2023', hospital: 'Red Cross Center', status: 'Completed', reward: '+50 pts' },
                                { date: 'Mar 10, 2023', hospital: 'St. Mary\'s', status: 'Completed', reward: '+50 pts' }
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[61px] top-0 w-6 h-6 bg-stone-900 border-2 border-blood-600 rounded-full group-hover:bg-blood-600 transition-colors" />
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-stone-600 uppercase mb-1 tracking-widest">{item.date}</p>
                                            <h4 className="text-white font-black text-xl tracking-tight">{item.hospital}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-[10px] font-bold text-stone-500 uppercase">Donation Successful</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 group-hover:border-blood-500/30 transition-all">
                                            <span className="text-[10px] font-black text-blood-400 uppercase tracking-[0.2em]">{item.reward}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ProfileEditor isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
        </div>
    );
}
