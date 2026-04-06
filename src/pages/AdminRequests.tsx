import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, Clock, XCircle, 
  Search, MapPin, ArrowUpRight
} from 'lucide-react';
import { useRequests } from '../lib/hooks/useRequests';
import { useAppStore } from '../store/useAppStore';
import StatusBadge from '../components/StatusBadge';
import BloodGroupBadge from '../components/BloodGroupBadge';
import { pageVariants, staggerContainer, itemVariants } from '../components/animations';
import DonorDetailPanel from '../components/DonorDetailPanel';

export default function AdminRequests() {
  const { getRequests, cancelRequest } = useRequests();
  const { addToast } = useAppStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Fetch requests error:', error);
      addToast('Failed to load requests', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await cancelRequest(id);
      addToast('Request cancelled successfully', 'success');
      fetchRequests();
    } catch (error) {
      addToast('Failed to cancel request', 'alert');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = req.hospitalName.toLowerCase().includes(search.toLowerCase()) || 
                          req.bloodGroup.includes(search.toUpperCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black text-[var(--text-primary)]">Emergency Requests</h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Manage and track live blood requirements</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--orange-500)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search hospital or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-6 py-3 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--orange-200)] focus:border-[var(--orange-500)] transition-all lg:w-64"
            />
          </div>
          
          <div className="bg-white p-1 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center">
            {['all', 'active', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-[var(--orange-500)] text-white shadow-lg shadow-orange-200' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-[var(--border-light)] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((req) => (
              <motion.div
                key={req._id}
                variants={itemVariants}
                layout
                className="bg-white rounded-[2.5rem] border border-[var(--border-light)] shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <BloodGroupBadge group={req.bloodGroup} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">{req.hospitalName}</h3>
                          {req.urgency === 'Critical' && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-red-100 animate-pulse">Critical</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                          Req ID: #{req._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[var(--bg-subtle)] p-4 rounded-3xl border border-white flex flex-col justify-center">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Units Req.</p>
                      <p className="text-2xl font-black text-[var(--text-primary)]">{req.unitsRequired} <span className="text-xs font-bold opacity-50">Units</span></p>
                    </div>
                    <div className="bg-[var(--bg-subtle)] p-4 rounded-3xl border border-white flex flex-col justify-center">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Assigned Donor</p>
                      {req.assignedDonorId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--orange-500)] text-white text-[10px] font-bold flex items-center justify-center">
                            {req.assignedDonorId.name[0]}
                          </div>
                          <span className="text-sm font-bold text-[var(--text-primary)] truncate">{req.assignedDonorId.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-stone-400 italic">Waiting...</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold truncate max-w-[100px]">{req.location?.address || 'Mumbai, IN'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {req.status === 'active' && (
                        <button 
                          onClick={() => handleCancel(req._id)}
                          className="p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100"
                          title="Cancel Request"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--bg-dark)] text-white font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        View Mission
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!isLoading && filteredRequests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-[var(--border-light)] border-dashed">
          <div className="w-20 h-20 bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-[var(--orange-300)]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-[var(--text-primary)]">No requests found</h3>
          <p className="text-[var(--text-muted)] font-medium mt-2">Adjust your filters or search terms</p>
        </div>
      )}

      <DonorDetailPanel 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        onUpdate={fetchRequests}
      />
    </motion.div>
  );
}
