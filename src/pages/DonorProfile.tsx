import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useDonor } from '../lib/hooks/useDonor';
import { useAuth } from '../lib/hooks/useAuth';
import { pageVariants, cardVariants } from '../components/animations';
import { 
  User, Heart, Phone, MapPin, Shield, 
  Award, Calendar, ArrowRight, Save,
  CheckCircle2, AlertCircle
} from 'lucide-react';

export default function DonorProfile() {
  const { currentUser, setAuth, token, addToast } = useAppStore();
  const { getProfile, getStats, updateProfile, toggleEligibility, deactivateAccount } = useDonor();
  const { logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.location?.address || '',
  });
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, stats] = await Promise.all([getProfile(), getStats()]);
        setAuth(token!, profile, 'donor');
        setStatsData(stats);
        setFormData({
          name: profile.name,
          phone: profile.phone,
          address: profile.location?.address || '',
        });
      } catch (err) {
        console.error("Error fetching fresh profile data:", err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: { address: formData.address, coordinates: currentUser.location?.coordinates }
      });
      setAuth(token!, { ...currentUser, ...updated }, 'donor');
      addToast({ id: Date.now().toString(), type: 'info', title: 'Profile Updated', message: 'Your changes have been saved successfully.' });
    } catch (err: any) {
      addToast({ id: Date.now().toString(), type: 'alert', title: 'Update Failed', message: err.response?.data?.message || 'Could not update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEligibility = async () => {
    try {
      const updated = await toggleEligibility();
      setAuth(token!, { ...currentUser, ...updated }, 'donor');
      const isEligible = updated.isEligible;
      addToast({ 
        id: Date.now().toString(), 
        type: isEligible ? 'info' : 'alert', 
        title: isEligible ? 'Back in Action!' : 'Status: Inactive', 
        message: isEligible ? 'You are now eligible to receive emergency alerts.' : 'You will not receive alerts until you reactivate.' 
      });
    } catch {
      addToast({ id: Date.now().toString(), type: 'alert', title: 'Error', message: 'Failed to update status.' });
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? You will no longer receive emergency alerts.")) return;
    
    try {
      await deactivateAccount();
      addToast({ id: Date.now().toString(), type: 'info', title: 'Account Deactivated', message: 'Your account is now inactive. Logging out...' });
      setTimeout(() => logout(), 2000);
    } catch (err) {
      addToast({ id: Date.now().toString(), type: 'alert', title: 'Error', message: 'Failed to deactivate account.' });
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-16 h-16 bg-[var(--orange-50)] rounded-3xl flex items-center justify-center animate-pulse">
           <User className="w-8 h-8 text-[var(--orange-500)]" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Blood Group', value: statsData?.bloodGroup || currentUser?.bloodGroup || 'O+', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Total Points', value: statsData?.rewardPoints || currentUser?.rewardPoints || 0, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Lives Saved', value: statsData?.livesSaved || Math.floor((currentUser?.rewardPoints || 0) / 100), icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Last Donation', value: statsData?.lastDonationDate ? new Date(statsData.lastDonationDate).toLocaleDateString() : 'Never', icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <motion.div 
      variants={pageVariants as any} 
      initial="initial" animate="animate" exit="exit"
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Summary & Stats */}
        <div className="w-full md:w-[320px] space-y-6">
          <motion.div variants={cardVariants as any} className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-light)] shadow-sm p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center text-white text-4xl font-black shadow-xl mx-auto">
                 {currentUser?.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[var(--orange-100)] flex items-center justify-center shadow-lg">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{currentUser?.name}</h2>
            <p className="text-[13px] text-[var(--text-muted)] font-medium mt-1">{currentUser?.email}</p>
            
            <div className="mt-8 pt-8 border-t border-[var(--border-light)] grid grid-cols-2 gap-4">
               <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Status</div>
                  <div className={`text-[12px] font-bold ${currentUser?.isEligible ? 'text-green-600' : 'text-red-500'}`}>
                     {currentUser?.isEligible ? 'Online' : 'Deferred'}
                  </div>
               </div>
               <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Rank</div>
                  <div className="text-[12px] font-bold text-[var(--orange-600)]">Diamond Hero</div>
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={cardVariants as any} className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-light)] flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</div>
                   <div className="font-bold text-[var(--text-primary)]">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Editing Form */}
        <div className="flex-1 space-y-8">
          
          {/* Eligibility Toggle Card */}
          <motion.div variants={cardVariants as any} className={`p-8 rounded-[2.5rem] border transition-all ${currentUser?.isEligible ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
            <div className="flex items-center justify-between gap-8">
               <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${currentUser?.isEligible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                     {currentUser?.isEligible ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Donation Availability</h3>
                    <p className="text-[13px] text-[var(--text-muted)] font-medium mt-1">
                      {currentUser?.isEligible 
                        ? 'You are active and will receive emergency alerts nearby.' 
                        : 'You are currently inactive. You will not be notified for requests.'}
                    </p>
                  </div>
               </div>
               <button 
                  onClick={handleToggleEligibility}
                  className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors outline-none ring-offset-2 focus:ring-2 ${currentUser?.isEligible ? 'bg-green-500 ring-green-200' : 'bg-stone-300 ring-stone-200'}`}
               >
                  <span className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform shadow-md ${currentUser?.isEligible ? 'translate-x-8' : 'translate-x-1'}`} />
               </button>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div variants={cardVariants as any} className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-light)] shadow-sm overflow-hidden">
             <div className="p-8 border-b border-[var(--border-light)] bg-[var(--bg-subtle)]/30">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                   <User className="w-5 h-5 text-[var(--orange-500)]" /> Personal Information
                </h3>
             </div>
             
             <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
                      <div className="relative">
                         <User className="absolute left-4 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                         <input 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-2xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none transition-all font-medium"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[12px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                         <input 
                           value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                           className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-2xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none transition-all font-medium"
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[12px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Home Address</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
                      <textarea 
                        rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-2xl focus:ring-2 focus:ring-[var(--orange-500)] outline-none transition-all font-medium resize-none"
                      />
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                   <button 
                     type="button" onClick={handleDeactivate}
                     className="text-[13px] font-bold text-red-600 hover:text-red-700 underline underline-offset-4"
                   >
                      Deactivate Account
                   </button>
                   <button 
                     type="submit" disabled={isLoading}
                     className="px-8 py-3.5 bg-[var(--bg-dark)] hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                   >
                      {isLoading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                   </button>
                </div>
             </form>
          </motion.div>

          {/* Security & Verification Status */}
          <motion.div variants={cardVariants as any} className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-light)] p-8 flex items-center justify-between">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--orange-500)]">
                   <Shield className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-[var(--text-primary)]">Verified Account</h4>
                   <p className="text-[13px] text-[var(--text-muted)] font-medium">Your identity was verified on {new Date(currentUser?.createdAt).toLocaleDateString()}.</p>
                </div>
             </div>
             <button className="flex items-center gap-1.5 text-[var(--orange-600)] font-bold text-[13px] hover:underline">
                View documents <ArrowRight className="w-4 h-4" />
             </button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
