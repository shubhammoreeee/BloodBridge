import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useDonor } from '../lib/hooks/useDonor';
import { useRequests } from '../lib/hooks/useRequests';
import AlertCard from '../components/AlertCard';
import BloodGroupBadge from '../components/BloodGroupBadge';
import { pageVariants, staggerContainer, cardVariants } from '../components/animations';
import { Droplet, Trophy, Activity, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MissionTracker from '../components/MissionTracker';
import { getSocket } from '../lib/socket';

export default function DonorDashboard() {
  const { currentUser, activeRequests: globalRequests, upsertRequest, addToast } = useAppStore();
  const { getStats, getHistory } = useDonor();
  const { getRequests, assignDonor } = useRequests();
  const navigate = useNavigate();
  const socket = getSocket();

  const [stats, setStats] = useState({ totalDonations: 0, livesSaved: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, matchedData, assignedData, histData] = await Promise.all([
          getStats(),
          getRequests({ matched: true }), 
          getRequests({ matched: false }),
          getHistory()
        ]);

        // Populate global store
        if (Array.isArray(matchedData)) matchedData.forEach((r: any) => upsertRequest(r));
        if (Array.isArray(assignedData)) assignedData.forEach((r: any) => upsertRequest(r));

        setStats(statsData);
        setHistory(histData);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDonorId = (assignedId: any) => {
    if (!assignedId) return null;
    return typeof assignedId === 'object' ? assignedId._id : assignedId;
  };

  const handleAccept = (requestId: string) => {
    if (!currentUser?._id) return;
    
    // OPTIMISTIC UPDATE: The AlertCard already called the API, 
    // we just need to update the global store to show the map immediately.
    const acceptedReq = globalRequests.find(r => r._id === requestId);
    if (acceptedReq) {
      upsertRequest({ 
        ...acceptedReq, 
        status: 'matched', 
        assignedDonorId: currentUser._id 
      });
    }
  };

  const refreshRequests = async () => {
    try {
      const data = await getRequests({ matched: true });
      if (Array.isArray(data)) {
        data.forEach(req => upsertRequest(req));
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--orange-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ongoingMission = globalRequests.find(r => 
    getDonorId(r.assignedDonorId) === currentUser?._id && 
    !['completed', 'cancelled'].includes(r.status)
  );

  const emergencyMatches = globalRequests.filter(r => 
    !['completed', 'cancelled'].includes(r.status) && 
    getDonorId(r.assignedDonorId) !== currentUser?._id
  );

  return (
    <motion.div 
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="space-y-8 pb-12"
    >
      {/* Hero Section */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[var(--border-light)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--orange-100)] to-transparent rounded-full -mr-32 -mt-32 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-200">
            {currentUser?.name?.[0].toUpperCase()}
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-xl shadow-lg">
              <div className="bg-[var(--orange-500)] text-white text-[10px] px-2 py-0.5 rounded-lg font-black">{currentUser?.bloodGroup}</div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[var(--orange-600)] text-xs font-bold mb-3 border border-orange-100">
              <Activity className="w-3.5 h-3.5" /> HERO LEVEL 4
            </div>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-2">
              Welcome back, {currentUser?.name?.split(' ')[0]}!
            </h1>
            <p className="text-[var(--text-muted)] font-medium max-w-xl">
              You are currently marked as eligible to donate. Keep an eye out for emergency matches.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="px-6 py-4 bg-stone-50 rounded-3xl border border-stone-100 text-center min-w-[120px]">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 font-body">Donations</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">{stats.totalDonations}</p>
            </div>
            <div className="px-6 py-4 bg-stone-50 rounded-3xl border border-stone-100 text-center min-w-[120px]">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 font-body">Lives Saved</p>
              <p className="text-3xl font-black text-[var(--orange-600)]">{stats.livesSaved || (stats.totalDonations * 3)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Missions Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              Emergency Matches
              {emergencyMatches.length > 0 && <span className="w-6 h-6 rounded-lg bg-red-500 text-white text-[10px] flex items-center justify-center font-black animate-pulse">{emergencyMatches.length}</span>}
            </h2>
            <button onClick={refreshRequests} className="text-[11px] font-black text-[var(--orange-600)] uppercase tracking-widest hover:translate-y-[-1px] transition-transform">Refresh Map</button>
          </div>

          {ongoingMission ? (
            <MissionTracker request={ongoingMission} />
          ) : (
            <motion.div 
              variants={staggerContainer} initial="initial" animate="animate"
              className="grid gap-6"
            >
              {emergencyMatches.length > 0 ? (
                emergencyMatches.map(req => (
                  <AlertCard 
                    key={req._id}
                    alert={req}
                    onAccepted={() => handleAccept(req._id)}
                    onDecline={() => {}}
                  />
                ))
              ) : (
                <div className="bg-stone-50 rounded-[2.5rem] border-2 border-dashed border-stone-200 py-16 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <Droplet className="w-8 h-8 text-stone-300" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-400">No active emergencies nearby</h3>
                  <p className="text-sm text-stone-300 max-w-xs mt-2 font-medium">We'll alert you immediately when someone with {currentUser?.bloodGroup} needs your help.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Recent History</h2>
            <button onClick={() => navigate('/donor/history')} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 border border-[var(--border-light)] shadow-sm">
            {history.length > 0 ? (
              <div className="space-y-6">
                {history.slice(0, 3).map((item, idx) => (
                  <div key={item._id} className="relative flex gap-4">
                    {idx !== history.slice(0, 3).length - 1 && <div className="absolute top-10 left-5 bottom-0 w-px bg-stone-100" />}
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex-shrink-0 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[var(--orange-500)]" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[11px] font-bold text-stone-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{item.hospitalName}</p>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/donor/history')}
                  className="w-full py-3 text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--orange-600)] transition-colors text-center border-t border-stone-50 mt-2"
                >
                  View Full Timeline
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm font-medium text-stone-300">No donation history recorded yet.</p>
              </div>
            )}
          </div>

          {/* Achievement Teaser */}
          <div className="bg-gradient-to-br from-stone-900 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
             <Trophy className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Progress Update</p>
                <h4 className="text-xl font-bold mb-4">Almost to your Next Badge!</h4>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                   <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-full w-[75%]" />
                </div>
                <p className="text-xs font-medium text-white/50">Next Milestone: Platinum Lifesaver (5 more units)</p>
             </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
