import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDonor } from '../lib/hooks/useDonor';
import { pageVariants, staggerContainer, cardVariants } from '../components/animations';
import { History, Clock, MapPin, Award, Trash2 } from 'lucide-react';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';

export default function DonorHistory() {
  const { getHistory } = useDonor();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching donor history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-16 h-16 bg-[var(--orange-50)] rounded-3xl flex items-center justify-center animate-pulse">
           <History className="w-8 h-8 text-[var(--orange-500)]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants as any} 
      initial="initial" animate="animate" exit="exit"
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[var(--text-primary)]">Donation History</h1>
          <p className="text-[13px] text-[var(--text-muted)] font-medium mt-1">Review your past life-saving missions and impact.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-[var(--border-light)] shadow-sm">
           <Award className="w-5 h-5 text-[var(--orange-500)]" />
           <span className="text-[14px] font-bold text-[var(--text-primary)]">{history.length} Missions Completed</span>
        </div>
      </div>

      <motion.div variants={staggerContainer as any} className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-[2rem] p-16 text-center border border-dashed border-[var(--border-light)]">
             <div className="w-20 h-20 bg-[var(--orange-50)] rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="w-10 h-10 text-[var(--orange-200)]" />
             </div>
             <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No missions yet</h3>
             <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
                Once you accept an emergency request and complete a donation, it will appear here.
             </p>
          </div>
        ) : (
          history.map((record) => (
            <motion.div 
              key={record._id}
              variants={cardVariants as any}
              className="bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-light)] shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                record.status === 'completed' ? 'bg-green-500' : 
                record.status === 'cancelled' ? 'bg-red-500' : 'bg-[var(--orange-400)]'
              }`} />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center">
                    <BloodGroupBadge group={record.bloodGroup} size="sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                       {record.hospitalName || 'Emergency Mission'}
                       <StatusBadge status={record.status} size="sm" />
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-[13px] text-[var(--text-muted)] font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(record.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {record.location?.address || 'Location Hidden'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Impact</div>
                    <div className="flex items-center justify-end gap-1 text-[var(--orange-600)] font-black text-lg">
                       <Award className="w-4 h-4" />
                       +{record.pointsEarned || 50}
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
