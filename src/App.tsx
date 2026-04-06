import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import RoleSelect from './pages/RoleSelect';
import Verification from './pages/Verification';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import DonorNotifications from './pages/DonorNotifications';
import DonorHistory from './pages/DonorHistory';
import DonorLeaderboard from './pages/DonorLeaderboard';
import DonorProfile from './pages/DonorProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminMapView from './pages/AdminMapView';
import AdminRequests from './pages/AdminRequests';
import AdminInventory from './pages/AdminInventory';
import AdminDonors from './pages/AdminDonors';
import AdminProfile from './pages/AdminProfile';
import NotificationToast from './components/NotificationToast';
import AppShell from './components/AppShell';
import { useAppStore } from './store/useAppStore';
import { useAuth } from './lib/hooks/useAuth';
import { getSocket, SOCKET_EVENTS } from './lib/socket';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PrivateRoute({ children, roleRequired }: { children: React.ReactNode; roleRequired: 'donor' | 'admin' }) {
  const { role, token, currentUser, isSessionLoading } = useAppStore();

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--orange-100)] rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-[var(--orange-500)] text-3xl">🩸</span>
          </div>
          <p className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">Loading Session...</p>
        </div>
      </div>
    );
  }

  if (!token || !currentUser || !role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== roleRequired) {
    return <Navigate to={role === 'donor' ? '/donor' : '/admin'} replace />;
  }

  return <AppShell>{children}</AppShell>;
}

function GlobalSocketListeners() {
  const { currentUser, token, role, addNotification, addToast, setUnreadCount, upsertRequest, setInventory, setDonorOnline, setAuth } = useAppStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    const handleNotification = (data: { notification: any }) => {
      addNotification(data.notification);
      addToast({
        id: Date.now().toString(),
        type: data.notification.type === 'emergency_alert' ? 'alert' : 'info',
        title: data.notification.title,
        message: data.notification.message,
      });
      setUnreadCount((prev) => prev + 1);
    };

    const handlePointsAwarded = (data: { points: number; totalPoints: number; message: string }) => {
      addToast({
        id: Date.now().toString(),
        type: 'reward',
        title: `🏆 +${data.points} Points!`,
        message: data.message,
      });
      if (token && role) {
         setAuth(token, { ...currentUser, rewardPoints: data.totalPoints }, role);
      }
    };

    const handleRequestStatusChanged = (data: any) => {
      upsertRequest(data);
    };

    const handleInventoryUpdated = (data: { inventory: any }) => {
      setInventory(data.inventory);
    };

    const handleDonorOnlineStatus = (data: { donorId: string, isOnline: boolean }) => {
      setDonorOnline(data.donorId, data.isOnline);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_RECEIVED, handleNotification);
    socket.on(SOCKET_EVENTS.POINTS_AWARDED, handlePointsAwarded);
    socket.on(SOCKET_EVENTS.REQUEST_STATUS_CHANGED, handleRequestStatusChanged);
    socket.on(SOCKET_EVENTS.INVENTORY_UPDATED, handleInventoryUpdated);
    socket.on(SOCKET_EVENTS.DONOR_ONLINE_STATUS, handleDonorOnlineStatus);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_RECEIVED, handleNotification);
      socket.off(SOCKET_EVENTS.POINTS_AWARDED, handlePointsAwarded);
      socket.off(SOCKET_EVENTS.REQUEST_STATUS_CHANGED, handleRequestStatusChanged);
      socket.off(SOCKET_EVENTS.INVENTORY_UPDATED, handleInventoryUpdated);
      socket.off(SOCKET_EVENTS.DONOR_ONLINE_STATUS, handleDonorOnlineStatus);
    };
  }, [currentUser, token, role]);

  return null;
}

function AppContent() {
  const { restoreSession } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const restore = async () => {
      useAppStore.getState().setSessionLoading(true);
      await restoreSession();
      useAppStore.getState().setSessionLoading(false);
    };
    restore();
  }, []);

  return (
    <>
      <GlobalSocketListeners />
      <ScrollToTop />
      <NotificationToast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Landing />
            </motion.div>
          } />
          <Route path="/login" element={
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Login />
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
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DonorDashboard />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute roleRequired="donor">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DonorNotifications />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/donor/history" element={
            <PrivateRoute roleRequired="donor">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DonorHistory />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/donor/leaderboard" element={
            <PrivateRoute roleRequired="donor">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DonorLeaderboard />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/donor/profile" element={
            <PrivateRoute roleRequired="donor">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DonorProfile />
              </motion.div>
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute roleRequired="admin">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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
          <Route path="/admin/requests" element={
            <PrivateRoute roleRequired="admin">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AdminRequests />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/admin/inventory" element={
            <PrivateRoute roleRequired="admin">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AdminInventory />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/admin/donors" element={
            <PrivateRoute roleRequired="admin">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AdminDonors />
              </motion.div>
            </PrivateRoute>
          } />
          <Route path="/admin/profile" element={
            <PrivateRoute roleRequired="admin">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AdminProfile />
              </motion.div>
            </PrivateRoute>
          } />
        </Routes>
      </AnimatePresence>
    </>
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
