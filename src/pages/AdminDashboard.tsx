import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useRequests } from '../lib/hooks/useRequests';
import { pageVariants, staggerContainer, cardVariants } from '../components/animations';
import { 
  Users, AlertCircle, Database, Activity, 
  Map as MapIcon, Plus, ChevronRight, Droplet,
  ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import EmergencyForm from '../components/EmergencyForm';
import DonorDetailPanel from '../components/DonorDetailPanel';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, inventory, setInventory, activeRequests, upsertRequest } = useAppStore();
  const { getInventory, getNearbyDonors } = useAdmin();
  const { getRequests } = useRequests();

  const [isEmergencyFormOpen, setIsEmergencyFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [nearbyDonorsCount, setNearbyDonorsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Active requests to display in the list
  const displayRequests = activeRequests.filter(r => 
    r.status !== 'completed' && r.status !== 'cancelled'
  );

  const fetchData = async () => {
    try {
      const [invData, reqData, donorsData] = await Promise.all([
        getInventory(),
        getRequests(),
        getNearbyDonors(10)
      ]);
      setInventory(invData);
      // Populate active requests store
      reqData.forEach((req: any) => upsertRequest(req));
      setNearbyDonorsCount(donorsData.length);
    } catch (e) {
      console.error("Admin Dashboard fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center animate-pulse">
           <Activity className="w-8 h-8 text-[var(--bg-dark)]" />
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Active Requests', value: activeRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Nearby Donors', value: nearbyDonorsCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Blood Units', value: Object.values(inventory).reduce((a, b) => a + b, 0), icon: Database, color: 'text-[var(--orange-500)]', bg: 'bg-[var(--orange-50)]' },
    { label: 'Success Rate', value: '94%', icon: Activity, color: 'text-green-500', bg: 'bg-green-50', trend: '+2.5%', trendUp: true },
  ];

  return (
    <motion.div variants={pageVariants as any} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">
            Monitoring {currentUser?.hospitalName} live operations.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-[var(--border-light)] shadow-sm">
           <button 
             onClick={() => setIsEmergencyFormOpen(true)}
             className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-md"
           >
             <Plus className="w-5 h-5" /> New Emergency
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <motion.div variants={staggerContainer as any} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i} 
            variants={cardVariants as any} 
            onClick={() => {
              if (kpi.label === 'Active Requests') navigate('/admin/requests');
              if (kpi.label === 'Nearby Donors') navigate('/admin/donors');
              if (kpi.label === 'Blood Units') navigate('/admin/inventory');
            }}
            className="bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-light)] shadow-sm cursor-pointer hover:shadow-md hover:border-[var(--orange-300)] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <p className="font-body text-sm font-bold text-[var(--text-muted)] mb-1">{kpi.label}</p>
            <p className="font-display text-3xl font-black text-[var(--text-primary)]">{kpi.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Emergencies List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
               Live Emergencies <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </h2>
            <button onClick={() => navigate('/admin/map')} className="text-[13px] font-bold text-[var(--orange-600)] flex items-center gap-1 hover:underline">
               Open Map <MapIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
             {displayRequests.length === 0 ? (
               <div className="bg-[var(--bg-subtle)] border border-dashed border-[var(--border-light)] rounded-[2rem] p-12 text-center">
                  <Activity className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="font-bold text-[var(--text-primary)]">No active requests found.</p>
                  <p className="text-sm text-[var(--text-muted)]">Everything is running smoothly.</p>
               </div>
             ) : (
               displayRequests
                 .map((req) => (
                  <motion.div 
                    key={req._id}
                    layout
                    onClick={() => setSelectedRequest(req)}
                    className="group bg-[var(--bg-card)] p-5 rounded-[1.5rem] border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--orange-300)] transition-all cursor-pointer flex items-center gap-6"
                  >
                     <div className="shrink-0">
                        <BloodGroupBadge group={req.bloodGroup} size="md" />
                     </div>
                     
                     <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-bold text-[var(--text-primary)] truncate">ID: {req._id.slice(-8).toUpperCase()}</h3>
                           <StatusBadge status={req.status} />
                        </div>
                        <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)] font-medium">
                           <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {req.unitsRequired} Units</span>
                           <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>

                     <div className="shrink-0 flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                           <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Urgency</p>
                           <span className={`text-[12px] font-bold ${req.urgency === 'Critical' ? 'text-red-600' : 'text-[var(--orange-600)]'}`}>{req.urgency}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] group-hover:bg-[var(--orange-100)] flex items-center justify-center transition-colors">
                           <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--orange-600)]" />
                        </div>
                     </div>
                  </motion.div>
                ))
             )}
          </div>
        </div>

        {/* Sidebar Column: Blood Inventory */}
        <div className="space-y-6">
          <motion.div variants={cardVariants as any} className="bg-[var(--bg-dark)] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Database className="w-32 h-32" />
             </div>
             
             <h3 className="font-display font-bold text-lg mb-6 relative z-10 flex items-center justify-between">
                Blood Inventory
                <Droplet className="w-5 h-5 text-[var(--orange-400)]" />
             </h3>

             <div className="grid grid-cols-2 gap-3 relative z-10">
                {Object.entries(inventory).map(([group, units]) => (
                   <div key={group} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                      <div className="font-display text-[11px] font-black uppercase tracking-widest opacity-60 mb-2">{group}</div>
                      <div className="flex items-end justify-between">
                         <span className="text-2xl font-black text-[var(--orange-400)]">{units as number}</span>
                         <span className="text-[10px] font-bold opacity-50 mb-1">Units</span>
                      </div>
                   </div>
                ))}
             </div>

             <button 
               onClick={() => navigate('/admin/inventory')}
               className="w-full mt-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[13px] font-bold transition-all"
             >
                Manage Inventory
             </button>
          </motion.div>

          <motion.div variants={cardVariants as any} className="bg-[var(--bg-card)] rounded-[2rem] p-6 border border-[var(--border-light)] shadow-sm">
             <h3 className="font-display font-bold text-lg mb-4">System Alerts</h3>
             <div className="space-y-4">
                {displayRequests.slice(0, 3).map(req => (
                  <div key={req._id} className="flex gap-3">
                     <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'matched' ? 'bg-blue-500' : 'bg-red-500'} mt-2 shrink-0 animate-pulse`} />
                     <p className="text-[13px] text-[var(--text-secondary)] font-medium">
                        Emergency {req._id.slice(-6).toUpperCase()} is currently <b>{req.status}</b>.
                     </p>
                  </div>
                ))}
                {displayRequests.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] italic">No recent system alerts.</p>
                )}
             </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <EmergencyForm 
        isOpen={isEmergencyFormOpen} 
        onClose={() => setIsEmergencyFormOpen(false)} 
      />
      
      <DonorDetailPanel 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        onUpdate={fetchData}
      />

    </motion.div>
  );
}
