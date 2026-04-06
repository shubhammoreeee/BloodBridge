import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSocket, SOCKET_EVENTS, joinRequestRoom } from '../lib/socket';
import { useAppStore } from '../store/useAppStore';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useRequests } from '../lib/hooks/useRequests';
import { pageVariants, scaleIn } from '../components/animations';
import { 
  Navigation, MapPin, Users, AlertCircle, 
  Layers, Compass, X, Droplet
} from 'lucide-react';
import BloodGroupBadge from '../components/BloodGroupBadge';
import DonorDetailPanel from '../components/DonorDetailPanel';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// OSRM API Route helper
// Mission Route Proxy helper
const fetchRoute = async (start: [number, number], end: [number, number]) => {
  if (!start?.[0] || !start?.[1] || !end?.[0] || !end?.[1]) return null;
  
  const startParam = `${start[1].toFixed(6)},${start[0].toFixed(6)}`;
  const endParam = `${end[1].toFixed(6)},${end[0].toFixed(6)}`;
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/mission/route?start=${startParam}&end=${endParam}`, { 
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error("Backend proxy failed");
    
    const result = await response.json();
    if (result.success && result.data) {
      return {
        ...result.data,
        error: null
      };
    }
  } catch (e) {
    console.warn("Backend routing failed:", e);
  }

  // Local Fallback: Straight line
  const directDist = L.latLng(start).distanceTo(L.latLng(end)) / 1000;
  return {
    coordinates: [start, end] as [number, number][],
    distance: directDist,
    duration: (directDist / 30) * 60, 
    isFallback: true,
    error: "Estimation"
  };
};

// Pulse Dot for Donor (Matching Legend Green)
const donorPulseIcon = L.divIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; background-color: #22C55E; opacity: 0.3; border-radius: 50%; animation: pulse 2s infinite;"></div>
      <div style="width: 14px; height: 14px; background-color: #22C55E; border: 3px solid white; border-radius: 50%; shadow: 0 0 10px rgba(34, 197, 94, 0.5); position: relative; z-index: 10;"></div>
    </div>
  `,
  className: 'donor-pulse-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const hospitalIcon = L.divIcon({
  html: `<div class="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-xl border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></div>`,
  className: 'custom-hospital-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const emergencyIcon = hospitalIcon; 

function MapAutoCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function AdminMapView() {
  const { currentUser, activeRequests, upsertRequest, setAuth } = useAppStore();
  const { getNearbyDonors, getProfile } = useAdmin();
  const { getRequests } = useRequests();
  const socket = getSocket();
  
  const [nearbyDonors, setNearbyDonors] = useState<any[]>([]);
  const [liveDonors, setLiveDonors] = useState<Record<string, [number, number]>>({});
  const [lastSeenData, setLastSeenData] = useState<Record<string, number>>({});
  const [routes, setRoutes] = useState<Record<string, any>>({});
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [realCoords, setRealCoords] = useState<[number, number] | null>(null);
  const [isProfileSynced, setIsProfileSynced] = useState(false);

  // Initialize with DB coords as the primary truth
  const hospitalLat = currentUser?.location?.coordinates?.[1];
  const hospitalLng = currentUser?.location?.coordinates?.[0];
  
  const hospitalCoords: [number, number] = [
    hospitalLat as number,
    hospitalLng as number
  ];

  // FRESH SYNC: Fetch latest profile & active missions on mount
  useEffect(() => {
    const syncData = async () => {
       try {
          const freshProfile = await getProfile();
          if (freshProfile?.location?.coordinates) {
             const token = localStorage.getItem('bb_token');
             if (token) {
                setAuth(token, freshProfile, 'admin');
             }
          }

          // Fetch active missions to ensure persistence on refresh
          const activeMissions = await getRequests({ status: 'active' }); 
          if (Array.isArray(activeMissions)) {
            activeMissions.forEach(req => upsertRequest(req));
          }
       } catch (error) {
          console.error("Mount sync failed:", error);
       } finally {
          setIsProfileSynced(true);
       }
    };
    syncData();
  }, []);

  useEffect(() => {
    if (hospitalLat && hospitalLng && isProfileSynced) {
      setRealCoords([hospitalLat, hospitalLng]);
    }
  }, [hospitalLat, hospitalLng, isProfileSynced]);

  useEffect(() => {
    const fetchDonors = async () => {
      if (!hospitalLat || !hospitalLng || !isProfileSynced) return;
      try {
        setIsLoading(true);
        const donors = await getNearbyDonors(radiusKm, hospitalLat, hospitalLng);
        setNearbyDonors(donors);
      } catch (e) {
        console.error("Fetch Donors Error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonors();
  }, [radiusKm, hospitalLat, hospitalLng, isProfileSynced]);

  useEffect(() => {
    if (!socket) return;
    
    const handleLocationUpdate = (payload: any) => {
      const { donorId, coordinates } = payload;
      setLiveDonors(prev => ({
        ...prev,
        [donorId]: [coordinates[1], coordinates[0]] as [number, number]
      }));
      setLastSeenData(prev => ({
        ...prev,
        [donorId]: Date.now()
      }));
    };

    socket.on(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, handleLocationUpdate);
    socket.on('donor_assigned', (payload: any) => {
      if (payload.requestId) {
        joinRequestRoom(payload.requestId);
        const existing = activeRequests.find(r => r._id === payload.requestId);
        if (existing) {
          upsertRequest({ ...existing, assignedDonorId: payload.donor._id, status: 'matched' });
        }
      }
    });

    socket.on('request_status_changed', (payload: any) => {
      if (payload.status === 'cancelled' || payload.status === 'completed') {
        useAppStore.getState().removeRequest(payload.requestId);
      } else {
        const existing = activeRequests.find(r => r._id === payload.requestId);
        if (existing) {
          upsertRequest({ ...existing, status: payload.status });
        }
      }
    });

    socket.on('emergency_cancelled', (payload: any) => {
      useAppStore.getState().removeRequest(payload.requestId);
    });

    return () => {
      socket.off(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, handleLocationUpdate);
      socket.off('donor_assigned');
      socket.off('request_status_changed');
      socket.off('emergency_cancelled');
    };
  }, [socket, activeRequests]);

  const getDonorId = (assignedId: any) => {
    if (!assignedId) return null;
    return typeof assignedId === 'object' ? assignedId._id : assignedId;
  };

  useEffect(() => {
    activeRequests.forEach(req => {
      if (req._id) joinRequestRoom(req._id);
    });

    // Fetch routes for all active requests with a matched donor
    const updateRoutes = async () => {
      for (const req of activeRequests) {
        const donorId = getDonorId(req.assignedDonorId);
        if (!donorId) continue;

        const donorPos = liveDonors[donorId] || (req.liveTracking?.coordinates?.length === 2 ? [req.liveTracking.coordinates[1], req.liveTracking.coordinates[0]] : null);
        const hospitalPos: [number, number] = [req.location.coordinates[1], req.location.coordinates[0]];

        if (donorPos && hospitalPos) {
          const currentRoute = routes[req._id];
          
          // Optimization: Only re-fetch if move distance > 50 meters or no route exists
          if (currentRoute) {
            const lastStart = currentRoute.coordinates[0];
            const movedDist = L.latLng(donorPos).distanceTo(L.latLng(lastStart));
            if (movedDist < 50) continue; 
          }

          const routeData = await fetchRoute(donorPos as [number, number], hospitalPos);
          if (routeData && !routeData.isFallback) {
            setRoutes(prev => ({ ...prev, [req._id]: routeData }));
          }
        }
      }
    };
    
    updateRoutes();
  }, [liveDonors, activeRequests]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-[calc(100vh-8rem)] flex flex-col relative rounded-[2.5rem] overflow-hidden border border-[var(--border-light)] shadow-2xl">
      
      <div className="absolute top-6 left-6 z-[1000] space-y-3">
         <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => hospitalLat && hospitalLng && setRealCoords([hospitalLat, hospitalLng])}
            className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-xl flex items-center gap-4 text-left w-full"
         >
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-dark)] text-white flex items-center justify-center shadow-lg">
               <MapPin className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-display font-bold text-sm leading-tight">{currentUser?.hospitalName}</h3>
               <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Recenter Map
               </p>
            </div>
         </motion.button>

         <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] border border-white/50 shadow-xl flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--text-muted)] ml-2" />
            <select 
               value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}
               className="bg-transparent text-[13px] font-bold outline-none pr-4 py-1"
            >
               <option value={5}>5 KM</option>
               <option value={10}>10 KM</option>
               <option value={20}>20 KM</option>
               <option value={50}>50 KM</option>
            </select>
         </div>
      </div>

      <div className="absolute top-6 right-6 z-[1000] flex flex-col items-end gap-3">
         <div className="bg-white/80 backdrop-blur-xl py-2 px-4 rounded-full border border-white/50 shadow-xl flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[11px] font-black uppercase tracking-widest mt-0.5">Emergency</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
               <span className="text-[11px] font-black uppercase tracking-widest mt-0.5">Live Donors</span>
            </div>
         </div>

         {activeRequests.some(r => getDonorId(r.assignedDonorId)) && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl p-4 w-64 space-y-3"
            >
               <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Live Missions</h4>
               {activeRequests
                 .filter(r => !['cancelled', 'completed'].includes(r.status))
                 .filter(r => getDonorId(r.assignedDonorId))
                 .map(req => {
                  const donorId = getDonorId(req.assignedDonorId)!;
                  const isLive = liveDonors[donorId];
                  const lastSeen = lastSeenData[donorId];
                  const lastSeenSecs = lastSeen ? Math.floor((Date.now() - (lastSeen as number)) / 1000) : null;

                  return (
                    <div key={req._id} className="flex items-center gap-3 p-2 bg-stone-50 rounded-2xl border border-stone-100">
                       <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[11px] font-bold truncate">#{req._id.slice(-6).toUpperCase()}</p>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                             <p className="text-[9px] font-medium text-stone-400 uppercase">{lastSeenSecs !== null ? `${lastSeenSecs}s ago` : 'Waiting...'}</p>
                             {isLive && (
                                <p className="text-[8px] font-mono font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded inline-block w-fit">
                                   {isLive[0].toFixed(5)}, {isLive[1].toFixed(5)}
                                </p>
                             )}
                          </div>
                       </div>
                       <BloodGroupBadge group={req.bloodGroup} size="sm" />
                    </div>
                  );
               })}
            </motion.div>
         )}
      </div>

      <div className="flex-1 z-0 relative">
        {!hospitalLat || !hospitalLng ? (
          <div className="h-full flex flex-col items-center justify-center bg-stone-50">
            <Droplet className="w-12 h-12 text-stone-200 mb-4 animate-bounce" />
            <p className="text-stone-400 font-bold">Waiting for Satellite Link...</p>
            <p className="text-stone-300 text-sm">Please ensure your hospital coordinates are set.</p>
          </div>
        ) : (
          <MapContainer 
          center={realCoords || hospitalCoords} 
          zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapAutoCenter center={realCoords || hospitalCoords} />
          
          <Marker position={hospitalCoords} icon={hospitalIcon}>
             <Popup offset={[0, -20]}><div className="p-1 font-bold">{currentUser?.hospitalName}</div></Popup>
          </Marker>

          <Circle 
            center={hospitalCoords} radius={radiusKm * 1000} 
            pathOptions={{ fillColor: 'var(--orange-100)', fillOpacity: 0.1, color: 'var(--orange-400)', weight: 1, dashArray: '5, 10' }} 
          />

          {activeRequests
            .filter(r => !['cancelled', 'completed'].includes(r.status))
            .map(req => {
            const donorId = getDonorId(req.assignedDonorId);
            const hospitalPos: [number, number] = [req.location.coordinates[1], req.location.coordinates[0]];
            const socketCoords = donorId ? liveDonors[donorId] : null;
            let donorPos: [number, number] | null = null;
            if (socketCoords) {
              donorPos = [socketCoords[0], socketCoords[1]];
            } else if (req.liveTracking?.coordinates?.length === 2) {
              donorPos = [req.liveTracking.coordinates[1], req.liveTracking.coordinates[0]];
            }

            return (
              <React.Fragment key={req._id}>
                <Marker position={hospitalPos} icon={emergencyIcon} eventHandlers={{ click: () => setSelectedEntity({ type: 'emergency', data: req }) }} />
                {donorPos && (
                  <>
                    <Marker position={donorPos as [number, number]} icon={donorPulseIcon} />
                    {/* Google Maps Style Glow/Shadow Layer */}
                    <Polyline 
                      positions={routes[req._id]?.coordinates || [donorPos, hospitalPos]}
                      pathOptions={{ 
                        color: routes[req._id]?.isFallback ? '#94a3b8' : '#2563eb', 
                        weight: 12, 
                        opacity: 0.15,
                        lineJoin: 'round'
                      }} 
                    />
                    {/* Main Route Line */}
                    <Polyline 
                      positions={routes[req._id]?.coordinates || [donorPos, hospitalPos]}
                      pathOptions={{ 
                        color: routes[req._id]?.isFallback ? '#64748b' : '#3b82f6', 
                        weight: 5, 
                        opacity: 1, 
                        lineJoin: 'round',
                        dashArray: routes[req._id]?.isFallback ? '8, 12' : '' 
                      }}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}

          {nearbyDonors.map(donor => {
             if (liveDonors[donor._id]) return null;
             return (
               <Marker 
                 key={donor._id} position={[donor.location.coordinates[1], donor.location.coordinates[0]]} icon={donorPulseIcon}
                 eventHandlers={{ click: () => setSelectedEntity({ type: 'donor', data: donor }) }}
               />
             );
          })}
        </MapContainer>
        )}
      </div>

      <AnimatePresence>
         {selectedEntity && (
           <motion.div 
             variants={scaleIn as any} initial="initial" animate="animate" exit="exit"
             className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-[400px] z-[1001] bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden"
           >
              <div className="p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${selectedEntity.type === 'emergency' ? 'bg-red-500' : 'bg-[var(--orange-500)]'}`}>
                          {selectedEntity.type === 'emergency' ? <AlertCircle /> : <Users />}
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">{selectedEntity.type === 'emergency' ? 'Emergency' : 'Donor'}</h4>
                          <p className="text-[11px] font-bold text-stone-400 uppercase">ID: {selectedEntity.data._id.slice(-8).toUpperCase()}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedEntity(null)} className="p-2 hover:bg-stone-100 rounded-full"><X className="w-5 h-5" /></button>
                 </div>

                 {selectedEntity.type === 'emergency' && routes[selectedEntity.data._id] && (
                    <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-stone-100">
                       <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                          <p className="text-[9px] font-black uppercase text-stone-400 mb-1">Distance</p>
                          <p className="text-xl font-black text-stone-700">{routes[selectedEntity.data._id].distance.toFixed(1)} <span className="text-xs font-bold text-stone-400">KM</span></p>
                       </div>
                       <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
                          <p className="text-[9px] font-black uppercase text-orange-400 mb-1">Travel Time</p>
                          <p className="text-xl font-black text-orange-700">{Math.ceil(routes[selectedEntity.data._id].duration)} <span className="text-xs font-bold text-orange-400">MINS</span></p>
                       </div>
                    </div>
                 )}

                 <button 
                   onClick={() => {
                     if (selectedEntity.type === 'emergency') {
                        setSelectedRequest(selectedEntity.data);
                     }
                   }}
                   className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white shadow-xl ${selectedEntity.type === 'emergency' ? 'bg-red-600' : 'bg-black'}`}
                 >
                    {selectedEntity.type === 'emergency' ? 'View Full Tracking' : 'Reach Out'}
                    <Navigation className="w-4 h-4" />
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <DonorDetailPanel 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        onUpdate={() => {}}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-[2000] flex items-center justify-center">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[var(--orange-500)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] font-black uppercase text-stone-400">Syncing Satellite...</p>
           </div>
        </div>
      )}
    </motion.div>
  );
}
