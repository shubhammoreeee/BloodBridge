import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MapPin, 
  Phone, Calendar, ShieldCheck, 
  Droplet, Mail, Navigation2, Zap
} from 'lucide-react';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useAppStore } from '../store/useAppStore';
import BloodGroupBadge from '../components/BloodGroupBadge';
import { pageVariants, itemVariants } from '../components/animations';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function AdminDonors() {
  const { getNearbyDonors } = useAdmin();
  const { addToast, currentUser } = useAppStore();
  const [donors, setDonors] = useState<any[]>([]);
  const [radiusKm, setRadiusKm] = useState(20);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // Initial coordinates from DB
  const initialLat = currentUser?.location?.coordinates?.[1];
  const initialLng = currentUser?.location?.coordinates?.[0];
  
  const [realCoords, setRealCoords] = useState<[number, number] | null>(null);

  // Determine active center: RealCoords (detected) or DB (initial)
  const activeLat = realCoords ? realCoords[0] : initialLat;
  const activeLng = realCoords ? realCoords[1] : initialLng;

  // Browser Geolocation Detection (Only if DB coords are missing)
  useEffect(() => {
    const isMissing = !initialLat || !initialLng;
    
    if (isMissing && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRealCoords([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.warn("Geolocation error:", error.message),
        { enableHighAccuracy: true }
      );
    }
  }, [initialLat, initialLng]);

  const fetchDonors = async () => {
    if (!activeLat || !activeLng) return;
    try {
      setIsLoading(true);
      // Use the prioritized coordinates
      const data = await getNearbyDonors(
        radiusKm, 
        activeLat, 
        activeLng
      );
      setDonors(data);
    } catch (error) {
      addToast('Failed to load donors', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [radiusKm, realCoords, initialLat, initialLng]);

  const filteredDonors = donors.filter(donor => {
    const matchesBloodGroup = !selectedBloodGroup || donor.bloodGroup === selectedBloodGroup;
    const matchesSearch = donor.name.toLowerCase().includes(search.toLowerCase());
    return matchesBloodGroup && matchesSearch;
  });

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-12"
    >
      {/* Header & Advanced Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-white p-10 rounded-[3rem] border border-[var(--border-light)] shadow-sm">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[var(--orange-500)] text-white flex items-center justify-center shadow-xl shadow-orange-100">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-black text-[var(--text-primary)]">Nearby Donor Base</h1>
            <p className="text-[var(--text-muted)] font-medium mt-1">Connect with eligible lifesaving partners in your proximity</p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 bg-green-50 text-green-600 flex items-center gap-2`}>
              <Zap className="w-3 h-3 fill-current" />
              {donors.filter(d => d.isOnline).length} Donors Online Now
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 bg-blue-50 text-blue-600 flex items-center gap-2`}>
              <Navigation2 className="w-3 h-3" />
              Scanning {radiusKm}KM Radius
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-1 max-w-2xl">
          {/* Blood Group Filters */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3 ml-1">Filter by Blood Type</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBloodGroup(null)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                  !selectedBloodGroup 
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xl translate-y-[-2px]' 
                    : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'
                }`}
              >
                All Groups
              </button>
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg === selectedBloodGroup ? null : bg)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                    selectedBloodGroup === bg 
                      ? 'bg-[var(--orange-500)] border-[var(--orange-500)] text-white shadow-xl shadow-orange-100 translate-y-[-2px]' 
                      : 'bg-white border-stone-200 text-stone-500 hover:border-[var(--orange-500)] hover:text-[var(--orange-600)]'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--orange-500)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by donor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-6 py-4 rounded-[1.5rem] bg-[var(--bg-subtle)] border border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--orange-200)] focus:border-[var(--orange-500)] transition-all font-medium text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3 bg-[var(--bg-subtle)] px-6 py-4 rounded-[1.5rem] border border-transparent min-w-[240px]">
              <Filter className="w-4 h-4 text-[var(--text-muted)]" />
              <select 
                value={radiusKm} 
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-transparent text-sm font-bold outline-none flex-1"
              >
                <option value={5}>Proximity: 5 KM</option>
                <option value={10}>Proximity: 10 KM</option>
                <option value={20}>Proximity: 20 KM</option>
                <option value={50}>Proximity: 50 KM</option>
                <option value={100}>Proximity: 100 KM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[420px] bg-white rounded-[3rem] border border-[var(--border-light)] animate-pulse shadow-sm" />
            ))
          ) : filteredDonors.map((donor) => (
            <motion.div
              layout
              key={donor._id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-[3.5rem] border border-[var(--border-light)] shadow-sm hover:shadow-2xl transition-all duration-700 p-10 relative overflow-hidden group flex flex-col h-full"
            >
              {/* Online Indicator Badge */}
              {donor.isOnline && (
                 <div className="absolute top-8 right-10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Online</span>
                 </div>
              )}

              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-100 group-hover:scale-105 transition-transform duration-500">
                  {donor.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-[var(--text-primary)] leading-tight">{donor.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <BloodGroupBadge group={donor.bloodGroup} size="md" variant="outlined" />
                    <span className="h-4 w-px bg-stone-100" />
                    <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-wider">
                       <MapPin className="w-3.5 h-3.5" />
                       {donor.distance}
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[var(--bg-subtle)] p-6 rounded-[2.5rem] border border-white">
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1 opacity-60">Total Saves</p>
                  <p className="text-xl font-display font-black text-[var(--text-primary)] leading-none mt-1">
                    {donor.totalDonations || 0} <span className="text-[10px] font-bold opacity-40">Lives</span>
                  </p>
                </div>
                <div className="bg-[var(--bg-subtle)] p-6 rounded-[2.5rem] border border-white">
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1 opacity-60">Reward Pts</p>
                  <p className="text-xl font-display font-black text-[var(--text-primary)] leading-none mt-1">
                    {donor.rewardPoints || 0} <span className="text-[10px] font-bold opacity-40">Pts</span>
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-4 text-sm font-bold text-[var(--text-secondary)]">
                   <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                   </div>
                   <span>{donor.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-[var(--text-secondary)]">
                   <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                   </div>
                   <span className="truncate max-w-[200px]">{donor.email || donor.name.toLowerCase().replace(' ', '') + '@gmail.com'}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-[var(--text-secondary)]">
                   <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                   </div>
                   <span className="text-xs">Last Donated: {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-light)]">
                 <button className="flex-1 py-4 bg-[var(--bg-dark)] hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5">
                    View Record
                 </button>
                 <button className="w-14 h-14 bg-white border border-[var(--border-light)] hover:border-[var(--orange-500)] text-[var(--orange-500)] rounded-2xl flex items-center justify-center transition-all hover:bg-[var(--orange-50)] shadow-sm">
                    <Navigation2 className="w-5 h-5" />
                 </button>
              </div>

              {/* Decor - Shadow Droplet */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-[15deg]">
                 <Droplet className="w-32 h-32 text-[var(--orange-500)]" fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isLoading && filteredDonors.length === 0 && (
         <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[4rem] border border-dashed border-[var(--border-light)] text-center">
            <div className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center mb-8">
               <ShieldCheck className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-3xl font-display font-black text-[var(--text-primary)]">No Donors in Radius</h3>
            <p className="text-[var(--text-muted)] font-medium mt-3 max-w-md">Try expanding your scan distance or filtering for a broader blood group compatibility range.</p>
            <button 
               onClick={() => setRadiusKm(prev => Math.min(100, prev + 20))}
               className="mt-10 px-8 py-4 bg-[var(--orange-500)] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-orange-100 hover:scale-105 transition-transform"
            >
               Expand Scan Radius
            </button>
         </div>
      )}
    </motion.div>
  );
}
