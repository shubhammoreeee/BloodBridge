import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Users,
    Droplets,
    MapPin,
    AlertTriangle,
    History,
    XCircle,
    Clock,
    LayoutDashboard,
    Send,
    Zap,
    ArrowRight
} from 'lucide-react';
import DonorDetailPanel from '../components/DonorDetailPanel';
import { useAppStore, type BloodRequest, type BloodGroup, type Urgency } from '../store/useAppStore';
import { cn } from '../lib/utils';
import MapView from '../components/MapView';

export default function AdminDashboard() {
    const { requests, inventory, addRequest, addNotification, runSystemDemo, isDemoRunning } = useAppStore();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

    const [form, setForm] = useState<{
        bloodType: BloodGroup;
        units: number;
        hospital: string;
        location: string;
        urgency: Urgency;
        lat: number;
        lng: number;
    }>({
        bloodType: 'A+',
        units: 1,
        hospital: 'Central Mercy Hospital',
        location: 'Sector 5',
        urgency: 'Normal',
        lat: 40.7128,
        lng: -74.006
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.hospital || !form.location) {
            addNotification("Please fill all fields", "alert");
            return;
        }

        addRequest(form);
        addNotification("Emergency broadcast initiated!", "success");
        setShowRequestForm(false);
    };

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                        <LayoutDashboard className="text-blood-500 w-10 h-10" />
                        Admin <span className="text-blood-600">Portal</span>
                    </h1>
                    <p className="text-stone-400">Response Coordination and Inventory Control.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={runSystemDemo}
                        disabled={isDemoRunning}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border shadow-xl",
                            isDemoRunning ? "bg-stone-800 text-stone-500 border-white/5" : "bg-white text-stone-950 border-white hover:scale-[1.05]"
                        )}
                    >
                        <Zap className={cn("w-4 h-4", isDemoRunning ? "text-stone-700" : "text-blood-500")} />
                        {isDemoRunning ? 'Simulation Running...' : 'RUN SYSTEM DEMO'}
                    </button>

                    <button
                        onClick={() => setShowRequestForm(true)}
                        className="blood-gradient text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blood-900/40 hover:scale-[1.05] transition-all"
                    >
                        <Plus className="w-4 h-4" /> Raise Emergency
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Coordination Map */}
                <div className="lg:col-span-8 h-[600px] relative">
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-stone-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-4">
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Response Map</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-bold text-stone-500">Live Coordinating Center</span>
                                </div>
                            </div>
                            <Link to="/admin/map" className="bg-blood-600 text-white p-2 rounded-lg hover:bg-blood-500 transition-colors">
                                <Zap className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <MapView />
                </div>

                {/* Inventory Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass rounded-[2.5rem] p-8 border-white/5 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blood-600/5 blur-3xl -mr-16 -mt-16" />
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                            <Droplets className="text-blood-500 w-5 h-5" /> Bank Inventory
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {(Object.entries(inventory) as [BloodGroup, number][]).slice(0, 8).map(([type, stock]) => (
                                <div key={type} className="bg-stone-900/60 p-4 rounded-2xl border border-white/5 group hover:border-blood-500/20 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-lg font-black text-white">{type}</span>
                                        <span className={cn(
                                            "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                            stock < 20 ? "bg-rose-500/20 text-rose-500" : "bg-green-500/20 text-green-500"
                                        )}>{stock < 20 ? 'Low' : 'OK'}</span>
                                    </div>
                                    <div className="w-full bg-stone-950 h-1 rounded-full mb-1">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", stock < 20 ? "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]" : "bg-blood-600")} style={{ width: `${Math.min(stock, 100)}%` }} />
                                    </div>
                                    <span className="text-[8px] font-bold text-stone-600 uppercase italic">{stock} Units Left</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group cursor-help">
                                <AlertTriangle className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase mb-0.5">Alert Level: Optimal</p>
                                    <p className="text-[8px] text-stone-500 leading-none">All clusters operational.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group">
                                <Users className="w-5 h-5 text-blood-400" />
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase mb-0.5">Available Donors: 24</p>
                                    <p className="text-[8px] text-stone-500 leading-none">Within 10km search zone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Coordination List */}
            <div className="glass rounded-[3rem] p-10 border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 italic">
                        <History className="text-stone-400 w-8 h-8" />
                        Live Response <span className="text-blood-600">Track</span>
                    </h2>
                    <div className="flex items-center gap-2 bg-stone-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-stone-500">
                        Monitoring Engine v2.0
                    </div>
                </div>

                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="text-center py-20 text-stone-600 italic font-medium">No active emergency signals detected.</div>
                    ) : (
                        requests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                onClick={() => setSelectedRequest(req)}
                                className={cn(
                                    "bg-white/5 rounded-[2rem] p-6 border transition-all cursor-pointer group relative overflow-hidden",
                                    req.status === 'Completed' ? "border-green-500/20 bg-green-500/5" : "border-white/5 hover:border-blood-500/30 hover:bg-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-xl transition-all duration-500",
                                            req.status === 'Completed' ? "bg-green-500 text-white border-green-400" : "bg-stone-900 text-blood-500 border-white/5 group-hover:bg-blood-600 group-hover:text-white"
                                        )}>
                                            {req.bloodType}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-white font-black text-lg tracking-tight">{req.hospital}</h4>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                                                    req.urgency === 'Critical' ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                                                )}>{req.urgency}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.15em] text-stone-500">
                                                <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blood-500" /> {req.location}</span>
                                                <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {req.acceptedBy ? (
                                            <div className="flex flex-col items-end">
                                                <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Assigned To</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black text-[10px]">{req.acceptedBy}</span>
                                                    <div className="w-6 h-6 bg-blood-600 rounded-lg flex items-center justify-center text-[10px] text-white font-black">{req.acceptedBy[0]}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <p className="text-[8px] font-black text-stone-600 uppercase mb-1">Status</p>
                                                <div className="flex items-center gap-2 text-blood-500 animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-blood-500 rounded-full" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Searching...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-3 bg-white/5 rounded-xl text-stone-600 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Side Panel Drawer */}
            <DonorDetailPanel
                request={selectedRequest ? requests.find(r => r.id === selectedRequest.id) || null : null}
                onClose={() => setSelectedRequest(null)}
            />

            {/* Emergency Request Modal */}
            {showRequestForm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-10 md:p-14 rounded-[4rem] max-w-2xl w-full relative border-blood-500/20"
                    >
                        <button onClick={() => setShowRequestForm(false)} className="absolute top-10 right-10 text-stone-500 hover:text-white transition-colors">
                            <XCircle className="w-8 h-8" />
                        </button>
                        <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter">Emergency <span className="text-blood-600">Broadcast</span></h2>
                        <p className="text-stone-500 mb-10 border-b border-white/5 pb-6 font-medium">Signals will be sent to all {form.bloodType} donors within immediate reach.</p>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-[0.2em]">Target Blood Type</label>
                                <select className="w-full bg-stone-900 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white font-black text-lg focus:ring-2 focus:ring-blood-600 outline-none appearance-none" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value as BloodGroup })}>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-[0.2em]">Units Required</label>
                                <input type="number" className="w-full bg-stone-900 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white font-black text-lg focus:ring-2 focus:ring-blood-600 outline-none" value={form.units} onChange={(e) => setForm({ ...form, units: parseInt(e.target.value) || 1 })} />
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-[0.2em]">Facility Name</label>
                                <input type="text" className="w-full bg-stone-900 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white font-black text-lg focus:ring-2 focus:ring-blood-600 outline-none placeholder:text-stone-700" placeholder="e.g. Hope Medical" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-[0.2em]">Region / Location</label>
                                <input type="text" className="w-full bg-stone-900 border border-white/10 rounded-[1.5rem] py-5 px-6 text-white font-black text-lg focus:ring-2 focus:ring-blood-600 outline-none" placeholder="Sector Name" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-[0.2em]">Urgency Matrix</label>
                                <div className="flex gap-2">
                                    {(['Normal', 'Urgent', 'Critical'] as Urgency[]).map(u => (
                                        <button key={u} type="button" onClick={() => setForm({ ...form, urgency: u })} className={cn("flex-1 py-4 px-2 rounded-xl text-[9px] font-black uppercase border transition-all", form.urgency === u ? "bg-blood-600 border-blood-600 text-white shadow-xl shadow-blood-900/40" : "bg-stone-800 border-white/5 text-stone-600")}>{u}</button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="md:col-span-2 blood-gradient text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blood-900/60 flex items-center justify-center gap-4 mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all"><Send className="w-6 h-6" /> INITIATE SIGNAL BROADCAST</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
