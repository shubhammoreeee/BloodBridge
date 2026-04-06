import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDonor } from '../lib/hooks/useDonor';
import { pageVariants, staggerContainer, cardVariants, scaleIn } from '../components/animations';
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import BloodGroupBadge from '../components/BloodGroupBadge';

export default function DonorLeaderboard() {
  const { getLeaderboard } = useDonor();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-16 h-16 bg-[var(--orange-50)] rounded-3xl flex items-center justify-center animate-pulse">
           <Trophy className="w-8 h-8 text-[var(--orange-500)]" />
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3, 10);

  return (
    <motion.div 
      variants={pageVariants as any} 
      initial="initial" animate="animate" exit="exit"
      className="max-w-5xl mx-auto space-y-12 pb-12"
    >
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl font-black text-[var(--text-primary)]">Community Heroes</h1>
        <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto">
          The top life-savers in our network. Ranking updated every hour based on donation frequency and emergency participation.
        </p>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 max-w-4xl mx-auto px-4">
        {topThree.length >= 2 && (
          <motion.div variants={scaleIn as any} className="order-2 md:order-1 relative p-8 bg-white rounded-[2.5rem] border border-[var(--border-light)] shadow-xl flex flex-col items-center text-center transform md:translate-y-4">
            <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-stone-300 text-stone-700 flex items-center justify-center shadow-lg border-4 border-white">
               <Medal className="w-6 h-6" />
            </div>
            <div className="w-20 h-20 rounded-full bg-[var(--orange-50)] flex items-center justify-center mb-4 ring-4 ring-white shadow-sm overflow-hidden">
               {topThree[1].name.charAt(0)}
            </div>
            <h3 className="font-bold text-[var(--text-primary)] text-lg truncate w-full">{topThree[1].name}</h3>
            <BloodGroupBadge group={topThree[1].bloodGroup} size="sm" className="mt-2" />
            <div className="mt-4 text-[var(--orange-600)] font-black text-2xl">{topThree[1].rewardPoints}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Points earned</div>
          </motion.div>
        )}

        {topThree.length >= 1 && (
          <motion.div variants={scaleIn as any} className="order-1 md:order-2 relative p-10 bg-gradient-to-b from-[var(--orange-400)] to-[var(--orange-600)] rounded-[3rem] border-transparent shadow-[var(--shadow-glow-red)] flex flex-col items-center text-center transform md:-translate-y-8 z-10">
            <div className="absolute -top-8 w-16 h-16 rounded-[1.5rem] bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
               <Crown className="w-8 h-8" />
            </div>
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 ring-4 ring-white shadow-lg overflow-hidden text-white font-black text-4xl">
               {topThree[0].name.charAt(0)}
            </div>
            <h3 className="font-black text-white text-xl truncate w-full">{topThree[0].name}</h3>
            <div className="mt-2 text-white/80 font-bold bg-white/10 px-4 py-1 rounded-full text-sm border border-white/20">
               {topThree[0].bloodGroup} Provider
            </div>
            <div className="mt-6 text-white font-black text-4xl leading-none">{topThree[0].rewardPoints}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mt-1">LIFETIME HERO</div>
          </motion.div>
        )}

        {topThree.length >= 3 && (
          <motion.div variants={scaleIn as any} className="order-3 relative p-8 bg-white rounded-[2.5rem] border border-[var(--border-light)] shadow-xl flex flex-col items-center text-center transform md:translate-y-8">
            <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg border-4 border-white">
               <Star className="w-6 h-6" />
            </div>
            <div className="w-20 h-20 rounded-full bg-[var(--orange-50)] flex items-center justify-center mb-4 ring-4 ring-white shadow-sm overflow-hidden">
               {topThree[2].name.charAt(0)}
            </div>
            <h3 className="font-bold text-[var(--text-primary)] text-lg truncate w-full">{topThree[2].name}</h3>
            <BloodGroupBadge group={topThree[2].bloodGroup} size="sm" className="mt-2" />
            <div className="mt-4 text-[var(--orange-600)] font-black text-2xl">{topThree[2].rewardPoints}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Points earned</div>
          </motion.div>
        )}
      </div>

      {/* List Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-4 mb-4">
           <h4 className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Top Contributors
           </h4>
           <div className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[11px] flex items-center gap-6 pr-4">
              <span>Group</span>
              <span>Points</span>
           </div>
        </div>

        <motion.div variants={staggerContainer as any} className="bg-white rounded-[2rem] border border-[var(--border-light)] shadow-sm overflow-hidden divide-y divide-[var(--border-light)]">
          {remaining.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] font-medium">No other heroes found yet. Be the first to join!</div>
          ) : (
            remaining.map((donor, i) => (
              <motion.div 
                key={donor._id}
                variants={cardVariants as any}
                className="flex items-center justify-between p-5 hover:bg-[var(--orange-50)] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 font-black text-[13px] text-[var(--text-muted)] flex items-center justify-center bg-[var(--bg-subtle)] rounded-xl group-hover:bg-white group-hover:text-[var(--orange-600)] shadow-inner transition-colors">
                     #{i + 4}
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-[var(--orange-600)] bg-[var(--orange-50)]">
                     {donor.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-[var(--text-primary)] text-[14px]">{donor.name}</h5>
                    <p className="text-[11px] font-medium text-[var(--text-muted)]">{donor.donationsCount || Math.floor(Math.random() * 10)} Donations</p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                   <BloodGroupBadge group={donor.bloodGroup} size="sm" variant="outlined" />
                   <div className="w-16 text-right font-display font-black text-[var(--text-primary)] group-hover:text-[var(--orange-600)] tracking-tighter">
                      {donor.rewardPoints}
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="p-8 bg-[var(--bg-subtle)] rounded-[2rem] border border-dashed border-[var(--border-light)] flex flex-col md:flex-row items-center gap-6 justify-between text-center md:text-left">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border-light)] flex items-center justify-center">
                 <Users className="w-6 h-6 text-[var(--orange-400)]" />
              </div>
              <div>
                 <h5 className="font-bold text-[var(--text-primary)]">Ready to Join the Ranks?</h5>
                 <p className="text-[13px] font-medium text-[var(--text-muted)]">Complete emergency missions to earn badges and rise in rankings.</p>
              </div>
           </div>
           <button className="px-6 py-2.5 bg-[var(--orange-500)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--orange-600)] transition-all flex items-center gap-2">
              Learn about badges <Medal className="w-4 h-4" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
