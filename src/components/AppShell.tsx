import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../lib/hooks/useAuth';
import { slideFromRight } from './animations';
import BloodGroupBadge from './BloodGroupBadge';
import { 
  Bell, Droplet, Menu, Search, X, LogOut, LayoutDashboard, 
  Map as MapIcon, Database, Users, Building2, UserCircle, AlertCircle, History, Trophy
} from 'lucide-react';

interface NavLinkItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { role, currentUser, unreadCount, activeRequests } = useAppStore();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const ongoingMission = role === 'donor' 
    ? activeRequests.find(r => {
        if (!r.assignedDonorId) return false;
        const donorId = typeof r.assignedDonorId === 'object' ? r.assignedDonorId._id : r.assignedDonorId;
        return donorId === currentUser?._id && !['completed', 'cancelled'].includes(r.status);
      })
    : null;

  const donorLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/donor', icon: LayoutDashboard },
    ...(ongoingMission ? [{ name: 'Live Tracking', path: '/donor', icon: MapIcon, color: 'text-red-500 animate-pulse' }] : []),
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'My Donations', path: '/donor/history', icon: History },
    { name: 'Leaderboard', path: '/donor/leaderboard', icon: Trophy },
    { name: 'My Profile', path: '/donor/profile', icon: UserCircle },
  ];

  const adminLinks: NavLinkItem[] = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Live Map', path: '/admin/map', icon: MapIcon },
    { name: 'Emergency Requests', path: '/admin/requests', icon: AlertCircle },
    { name: 'Blood Inventory', path: '/admin/inventory', icon: Database },
    { name: 'Nearby Donors', path: '/admin/donors', icon: Users },
    { name: 'Hospital Profile', path: '/admin/profile', icon: Building2 },
  ];

  const navLinks: NavLinkItem[] = role === 'admin' ? adminLinks : donorLinks;

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const getPageTitle = () => {
    const route = navLinks.find(link => link.path === location.pathname);
    return route ? route.name : 'BloodBridge';
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <Droplet className="text-[var(--orange-500)] w-8 h-8" fill="currentColor" />
          <span className="text-2xl font-black tracking-tight font-display text-[var(--text-primary)]">
            BloodBridge
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/donor' || link.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-body text-[14px]
              ${isActive 
                ? 'bg-[var(--orange-100)] text-[var(--orange-700)] font-bold border-l-4 border-[var(--orange-500)] shadow-[var(--shadow-sm)]' 
                : 'text-[var(--text-secondary)] font-medium hover:bg-[var(--orange-50)] hover:text-[var(--orange-600)]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 ${link.color || (isActive ? 'text-[var(--orange-600)]' : 'text-[var(--text-muted)]')}`} />
                {link.name}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-auto bg-[var(--orange-500)] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border-light)] mt-auto">
        <div className="bg-[var(--bg-subtle)] rounded-2xl p-4 border border-[var(--border-light)] relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center text-white font-bold shadow-sm">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{currentUser?.name}</p>
              <p className="text-[12px] text-[var(--text-muted)] truncate capitalize">{role}</p>
            </div>
          </div>
          {role === 'donor' && currentUser?.bloodGroup && (
             <BloodGroupBadge group={currentUser.bloodGroup} size="sm" className="absolute top-4 right-4" />
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex text-[var(--text-primary)] selection:bg-[var(--orange-200)] selection:text-[var(--orange-900)]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] bg-[var(--bg-card)] border-r border-[var(--border-light)] z-30 shadow-[var(--shadow-sm)]">
        <NavContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[var(--bg-dark)]/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              variants={slideFromRight}
              initial="initial" animate="animate" exit="exit"
              className="fixed inset-y-0 right-0 w-[280px] bg-[var(--bg-card)] border-l border-[var(--border-light)] z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-h-screen">
        
        {/* Topbar */}
        <header className="h-16 fixed top-0 right-0 left-0 lg:left-[260px] bg-[var(--bg-base)]/90 backdrop-blur-xl border-b border-[var(--border-light)] z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--orange-50)] rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="hidden sm:block font-display text-[18px] font-bold text-[var(--text-primary)]">
              {getPageTitle()}
            </h1>
            <div className="sm:hidden flex items-center gap-2">
              <Droplet className="text-[var(--orange-500)] w-6 h-6" fill="currentColor" />
              <span className="font-display font-black text-lg">BloodBridge</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--orange-50)] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--orange-50)] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={unreadCount}
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--orange-500)] shadow-[var(--shadow-glow)]"
                />
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center text-white font-bold shadow-sm hover:shadow-md transition-shadow ring-2 ring-transparent focus:ring-[var(--orange-200)]"
              >
                {currentUser?.name?.charAt(0) || 'U'}
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-14 w-[200px] bg-white rounded-2xl shadow-[var(--shadow-xl)] border border-[var(--border-light)] py-2 overflow-hidden"
                  >
                    <button onClick={() => { setIsDropdownOpen(false); navigate(`/${role}/profile`); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--orange-50)] transition-colors">Profile & Settings</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-16 p-4 sm:p-6 md:p-8 overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
