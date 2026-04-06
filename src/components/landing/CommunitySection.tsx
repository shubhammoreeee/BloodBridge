import { motion } from 'framer-motion';
import { useAppStore, type BloodGroup } from '../../store/useAppStore';

const leaderboard = [
  { id: '1', name: 'Arjun Mehta', bloodGroup: 'O+', points: 2450, donations: 12 },
  { id: '2', name: 'Sarah Chen', bloodGroup: 'A-', points: 2100, donations: 10 },
  { id: '3', name: 'Marcus Thorne', bloodGroup: 'B+', points: 1850, donations: 9 },
  { id: '4', name: 'Priya Sharma', bloodGroup: 'O-', points: 1600, donations: 8 },
  { id: '5', name: 'David Wilson', bloodGroup: 'AB+', points: 1450, donations: 7 },
  { id: '6', name: 'Elena Rodriguez', bloodGroup: 'A+', points: 1300, donations: 6 },
  { id: '7', name: 'Kevin Park', bloodGroup: 'B-', points: 1150, donations: 6 },
  { id: '8', name: 'Aisha Khan', bloodGroup: 'O+', points: 1000, donations: 5 },
];

export default function CommunitySection() {
  const { inventory, setInventoryManagerOpen, role } = useAppStore();

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 8);

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 max-w-7xl">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Left: Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-10">
                            <h3 className="text-[var(--orange-600)] text-sm font-black tracking-[0.2em] uppercase mb-2">Community</h3>
                            <h2 className="font-display text-[32px] md:text-[40px] font-extrabold text-[var(--text-primary)] leading-tight">
                                Our Heroes This Month
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {/* Top 3 Podium (Simplified cards) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {topThree.map((donor, idx) => (
                                    <div 
                                        key={donor.id} 
                                        className={`relative p-5 rounded-2xl border flex flex-col items-center text-center ${
                                            idx === 0 
                                            ? 'bg-gradient-to-b from-[var(--orange-400)] to-[var(--orange-600)] border-transparent shadow-[var(--shadow-lg)] transform md:-translate-y-4' 
                                            : 'bg-white border-[var(--border-light)]'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 ${
                                            idx === 0 ? 'bg-white text-[var(--orange-600)]' : 'bg-[var(--orange-50)] text-[var(--orange-600)]'
                                        }`}>
                                            {donor.name.charAt(0)}
                                        </div>
                                        {idx === 0 && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-yellow-300">
                                                Hero of the Month
                                            </div>
                                        )}
                                        <h4 className={`font-bold ${idx === 0 ? 'text-white' : 'text-[var(--text-primary)]'}`}>{donor.name}</h4>
                                        <div className={`text-xs font-bold mt-1 ${idx === 0 ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>{donor.bloodGroup} • {donor.points} pts</div>
                                    </div>
                                ))}
                            </div>

                            {/* Rest of the list */}
                            <div className="bg-[var(--bg-primary)] rounded-[2rem] p-2 border border-[var(--border-light)]">
                                {rest.map((donor, idx) => (
                                    <div 
                                        key={donor.id}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-colors hover:bg-[var(--orange-50)] ${idx % 2 === 0 ? '' : 'bg-white/50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-[var(--border-light)] flex items-center justify-center font-bold text-[var(--orange-600)] shadow-sm">
                                                {donor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-[var(--text-primary)] text-sm">{donor.name}</h5>
                                                <div className="text-xs text-[var(--text-secondary)] font-medium">{donor.donations} Donations</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--orange-700)] rounded-md text-[10px] font-bold border border-[var(--border-medium)]">
                                                {donor.bloodGroup}
                                            </span>
                                            <span className="font-mono font-bold text-[var(--text-primary)] text-sm w-12 text-right">
                                                {donor.points}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                    {/* Right: Inventory */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col h-full"
                    >
                        <div className="mb-10 flex items-start justify-between">
                            <div>
                                <h3 className="text-[var(--orange-600)] text-sm font-black tracking-[0.2em] uppercase mb-2">Network Status</h3>
                                <h2 className="font-display text-[32px] md:text-[40px] font-extrabold text-[var(--text-primary)] leading-tight">
                                    Live Blood Stock
                                </h2>
                                <p className="text-[var(--text-muted)] text-sm mt-2">Updated in real-time from partner hospitals.</p>
                            </div>
                            {role === 'admin' && (
                                <button
                                    onClick={() => setInventoryManagerOpen(true)}
                                    className="px-4 py-2 bg-[var(--orange-50)] text-[var(--orange-600)] font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[var(--orange-100)] transition-colors border border-[var(--orange-200)] shadow-sm"
                                >
                                    Manage Stock
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 flex-grow">
                            {(Object.entries(inventory) as [BloodGroup, number][]).map(([group, stock]) => {
                                const status = stock < 10 ? 'critical' : stock < 25 ? 'low' : 'stable';
                                
                                return (
                                    <div 
                                        key={group} 
                                        className="bg-[var(--bg-primary)] p-5 rounded-[1.5rem] border border-[var(--border-light)] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            status === 'critical' ? 'bg-red-500' :
                                            status === 'low' ? 'bg-amber-500' :
                                            'bg-green-500'
                                        }`} />

                                        <div className="flex justify-between items-start mb-4 pl-2">
                                            <span className="font-display text-2xl font-bold text-[var(--text-primary)]">{group}</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                status === 'critical' ? 'bg-red-100 text-red-700 animate-pulse' :
                                                status === 'low' ? 'bg-amber-100 text-amber-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {status}
                                            </span>
                                        </div>
                                        
                                        <div className="pl-2">
                                            <div className="font-mono text-3xl font-bold text-[var(--text-primary)] leading-none mb-1">
                                                {stock}
                                            </div>
                                            <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Units</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}
