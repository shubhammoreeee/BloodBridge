import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../lib/hooks/useNotifications';
import { useAppStore } from '../store/useAppStore';
import { pageVariants, staggerContainer, cardVariants } from '../components/animations';
import { Bell, Check, BellRing, Trophy, Info, AlertCircle } from 'lucide-react';

export default function DonorNotifications() {
  const { getNotifications, markRead, markAllRead } = useNotifications();
  const { setUnreadCount } = useAppStore();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency_alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'points_awarded': return <Trophy className="w-5 h-5 text-[var(--orange-500)]" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-16 h-16 bg-[var(--orange-100)] py-4 rounded-3xl flex items-center justify-center animate-pulse">
           <Bell className="w-8 h-8 text-[var(--orange-500)]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-light)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] shadow-sm flex items-center justify-center text-white">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
            <p className="text-sm font-medium text-[var(--text-muted)]">Stay updated on emergencies and your rewards.</p>
          </div>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-[var(--bg-subtle)] hover:bg-[var(--orange-50)] text-[var(--orange-600)] text-sm font-bold rounded-xl transition-colors flex items-center gap-2 border border-[var(--border-light)] hover:border-[var(--orange-200)]"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-light)] shadow-[var(--shadow-sm)] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold">You're all caught up!</p>
            <p className="text-sm">New notifications will appear here.</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} className="divide-y divide-[var(--border-light)]">
            {notifications.map(n => (
              <motion.div 
                variants={cardVariants} 
                key={n._id} 
                onClick={() => handleMarkRead(n._id, n.isRead)}
                className={`p-5 flex gap-4 cursor-pointer transition-colors ${!n.isRead ? 'bg-[var(--orange-50)] hover:bg-[var(--bg-inset)]' : 'hover:bg-[var(--bg-subtle)]'}`}
              >
                <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${!n.isRead ? 'bg-white shadow-sm' : 'bg-[var(--bg-base)]'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-[15px] font-bold ${!n.isRead ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs font-medium text-[var(--text-muted)] flex-shrink-0 ml-2">
                       {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${!n.isRead ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-muted)]'}`}>
                    {n.message}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="flex-shrink-0 flex items-center justify-center pt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange-500)] shadow-[var(--shadow-glow)]" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </motion.div>
  );
}
