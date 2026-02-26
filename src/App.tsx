import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, MessageSquare, Zap } from 'lucide-react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import RoleSelect from './pages/RoleSelect';
import Verification from './pages/Verification';
import DonorDashboard from './pages/DonorDashboard';
import DonorNotifications from './pages/DonorNotifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminMapView from './pages/AdminMapView';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import { useAppStore } from './store/useAppStore';
import { cn } from './lib/utils';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PrivateRoute({ children, roleRequired }: { children: React.ReactNode, roleRequired: 'donor' | 'admin' }) {
  const { role, donorProfile, adminProfile } = useAppStore();

  if (!role || (role === 'donor' && !donorProfile.onboarded) || (role === 'admin' && !adminProfile.onboarded)) {
    return <Navigate to="/" replace />;
  }

  if (role !== roleRequired) {
    return <Navigate to={role === 'donor' ? '/donor' : '/admin'} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { runSystemDemo, isDemoRunning, addNotification } = useAppStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-950 selection:bg-blood-500/30 selection:text-blood-200 flex flex-col font-outfit overflow-x-hidden">
      <Navbar />

      <div className="flex-grow relative">
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Landing />
              </motion.div>
            } />
            <Route path="/role-selection" element={
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <RoleSelect />
              </motion.div>
            } />
            <Route path="/verification" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Verification />
              </motion.div>
            } />

            {/* Donor Routes */}
            <Route path="/donor" element={
              <PrivateRoute roleRequired="donor">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <DonorDashboard />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute roleRequired="donor">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
                  <DonorNotifications />
                </motion.div>
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute roleRequired="admin">
                <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <AdminDashboard />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/admin/map" element={
              <PrivateRoute roleRequired="admin">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminMapView />
                </motion.div>
              </PrivateRoute>
            } />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />

      <NotificationToast />

      {/* Simplified Demo Floating Controls */}
      <div className="fixed left-6 bottom-6 z-[110] flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={runSystemDemo}
          disabled={isDemoRunning}
          className={cn(
            "px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-4 border-2 transition-all",
            isDemoRunning
              ? "bg-stone-900 border-white/5 text-stone-600"
              : "bg-white text-stone-950 border-white hover:shadow-blood-900/40"
          )}
        >
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all shadow-lg",
            isDemoRunning ? "bg-stone-800" : "bg-blood-600 group-hover:bg-blood-500"
          )}>
            <Zap className={cn("w-4 h-4 fill-current", isDemoRunning && "animate-pulse")} />
          </div>
          {isDemoRunning ? 'System Simulating...' : 'RUN SYSTEM DEMO'}
        </motion.button>

        <div className="glass p-6 rounded-[2.5rem] border-white/10 max-w-[300px] hidden md:block shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-blood-600/20 rounded-lg flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-blood-500" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-80">MVP Flow Insight</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
            This prototype simulates the <b>real-time alert cycle</b>. Admin broadcasts ➔ Donor receives ➔ Location matching ➔ Points & Rewards.
          </p>
        </div>
      </div>

      {/* Dynamic Help Bubble */}
      <div className="fixed right-6 bottom-6 z-[110]">
        <motion.button
          whileHover={{ y: -5, scale: 1.05 }}
          className="bg-stone-900/90 backdrop-blur-md border border-white/10 p-5 rounded-[2rem] flex items-center gap-3 shadow-2xl group hover:border-blood-500/50 transition-all"
          onClick={() => addNotification("Need assistance? Support portal is available for verified users.", "info")}
        >
          <MessageSquare className="w-5 h-5 text-blood-500 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest hidden sm:block">Support Node</span>
        </motion.button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
