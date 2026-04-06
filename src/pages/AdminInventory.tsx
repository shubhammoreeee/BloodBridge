import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Plus, Minus, RotateCw, Save, 
  TrendingUp, AlertTriangle, Info, Share2, 
  Droplet
} from 'lucide-react';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useAppStore } from '../store/useAppStore';
import { pageVariants, staggerContainer, itemVariants } from '../components/animations';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function AdminInventory() {
  const { getInventory, updateInventory } = useAdmin();
  const { addToast } = useAppStore();
  const [inventory, setInventoryState] = useState<Record<string, number>>({});
  const [initialInventory, setInitialInventory] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await getInventory();
      setInventoryState(data);
      setInitialInventory(data);
    } catch (error) {
      addToast('Failed to load inventory', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = (group: string, delta: number) => {
    setInventoryState(prev => ({
      ...prev,
      [group]: Math.max(0, (prev[group] || 0) + delta)
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateInventory(inventory);
      setInitialInventory(inventory);
      addToast('Inventory updated and broadcasted!', 'success');
    } catch (error) {
      addToast('Failed to update inventory', 'alert');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(inventory) !== JSON.stringify(initialInventory);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-black text-[var(--text-primary)]">Blood Inventory</h1>
          <p className="text-[var(--text-muted)] font-medium mt-2">Monitor and adjust facility stock levels</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={fetchInventory}
            className="p-4 rounded-2xl bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all"
            title="Refresh Data"
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button 
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl ${
              hasChanges 
                ? 'bg-[var(--orange-500)] text-white hover:bg-[var(--orange-600)] shadow-orange-200' 
                : 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? <RotateCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Persist & Broadcast
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-[var(--border-light)] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--orange-50)] text-[var(--orange-500)] flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Stock</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">
                {Object.values(inventory).reduce((a, b) => a + b, 0)} Units
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-[var(--border-light)] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Low Stock Alerts</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">
                {Object.values(inventory).filter(v => v < 20).length} Critical
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Action Required Immediately</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-[var(--border-light)] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Live Broadcasts</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">Active</p>
            </div>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">Connected to 154 donors in Mumbai</p>
        </div>
      </div>

      {/* Inventory Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {BLOOD_GROUPS.map((group) => {
          const stock = inventory[group] || 0;
          const isLow = stock < 20;
          const isModified = stock !== initialInventory[group];

          return (
            <motion.div
              key={group}
              variants={itemVariants}
              className={`bg-white rounded-[2.5rem] border-2 transition-all p-8 relative overflow-hidden group ${
                isModified ? 'border-[var(--orange-400)] shadow-lg shadow-orange-50' : 'border-[var(--border-light)]'
              }`}
            >
              {isLow && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />
              )}

              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-light)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-[var(--text-primary)]">{group}</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isLow ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                    {isLow ? '⚠️ LOW STOCK' : 'STATUS: NORMAL'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-display font-black text-[var(--text-primary)] mb-1">
                    {stock} <span className="text-base font-bold opacity-30">Units</span>
                  </p>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stock / 200) * 100)}%` }}
                      className={`h-full ${isLow ? 'bg-red-500' : 'bg-[var(--orange-400)]'}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-light)]">
                  <button 
                    onClick={() => handleUpdate(group, -1)}
                    className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all text-[var(--text-secondary)]"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Adjust Stock</p>
                  </div>
                  <button 
                    onClick={() => handleUpdate(group, +1)}
                    className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-all text-[var(--text-secondary)]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Animation decoration */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Droplet className="w-24 h-24 text-[var(--orange-500)]" fill="currentColor" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Card */}
      <div className="bg-[var(--bg-dark)] text-white/90 p-8 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row items-center gap-8 border border-white/10">
        <div className="w-16 h-16 rounded-3xl bg-[var(--orange-500)] text-white flex items-center justify-center shadow-xl shadow-orange-950/20">
          <Info className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl font-display font-bold mb-2 text-white">Automated Inventory Broadcasting</h3>
          <p className="text-sm font-medium opacity-60 max-w-2xl">
            When you adjust stock levels, all connected donor apps in your vicinity receive a silent update. 
            If levels drop below critical thresholds, eligible donors will see an increased urgency in their dashboard.
          </p>
        </div>
        <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10">
          View Audit Logs
        </button>
      </div>
    </motion.div>
  );
}
