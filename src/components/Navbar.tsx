import { useState, useEffect } from 'react';
import { Droplets, Bell, LogOut, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { role, donorProfile, adminProfile, requests, resetApp } = useAppStore();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const matchingAlertsCount = requests.filter(r =>
        r.status === 'Pending' && (r.bloodType === donorProfile.bloodGroup || r.bloodType === 'O-')
    ).length;

    if (location.pathname === '/verification') return null;

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-stone-950/80 backdrop-blur-md border-white/10 py-3'
                    : 'bg-transparent border-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-blood-600 rounded-2xl flex items-center justify-center pulse-red group-hover:rotate-12 transition-transform shadow-2xl">
                        <Droplets className="text-white w-7 h-7" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white font-outfit uppercase italic">
                        Blood<span className="text-blood-500">Bridge</span>
                    </span>
                </Link>

                {role && (
                    <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5 mx-8">
                        {role === 'donor' ? (
                            <>
                                <Link to="/donor" className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all", location.pathname === '/donor' ? "text-blood-500" : "text-stone-500 hover:text-white")}>My Dashboard</Link>
                                <Link to="/notifications" className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2", location.pathname === '/notifications' ? "text-blood-500" : "text-stone-500 hover:text-white")}>
                                    Alerts {matchingAlertsCount > 0 && <span className="bg-blood-600 text-[8px] px-1.5 py-0.5 rounded-full text-white">{matchingAlertsCount}</span>}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/admin" className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all", location.pathname === '/admin' ? "text-blood-500" : "text-stone-500 hover:text-white")}>Operation Room</Link>
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-all">Global Inventory</button>
                            </>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {role ? (
                        <div className="flex items-center gap-4">
                            {role === 'donor' && (
                                <Link to="/notifications" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-stone-400 hover:text-white transition-all relative">
                                    <Bell className="w-5 h-5" />
                                    {matchingAlertsCount > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-blood-600 rounded-full animate-pulse border-2 border-stone-950" />}
                                </Link>
                            )}

                            <div className="h-8 w-px bg-white/10 mx-2" />

                            <div className="flex items-center gap-4 group relative">
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-xl bg-blood-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                        {role === 'donor' ? donorProfile.name[0] : 'A'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[10px] font-black text-white leading-none mb-1 tracking-tight truncate max-w-[100px]">
                                            {role === 'donor' ? donorProfile.name : adminProfile.hospitalName || 'Admin'}
                                        </p>
                                        <p className="text-[8px] font-black text-stone-600 uppercase tracking-widest leading-none">
                                            {role === 'donor' ? `${donorProfile.bloodGroup} Verified` : 'Authorized'}
                                        </p>
                                    </div>
                                </div>

                                {/* Tooltip/Logout */}
                                <div className="absolute top-full right-0 mt-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all">
                                    <button
                                        onClick={resetApp}
                                        className="bg-stone-900 border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center gap-3 text-rose-500 hover:bg-rose-500/10 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                            className="bg-white text-stone-950 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all flex items-center gap-2"
                        >
                            Join Network <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
