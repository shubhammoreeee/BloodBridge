import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Clock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { getSocket, SOCKET_EVENTS } from '../lib/socket';
import { useAppStore } from '../store/useAppStore';

interface MissionTrackerProps {
  request: any;
  role?: 'donor' | 'admin';
}

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
    console.warn("Backend routing failed, using local straight-line fallback:", e);
  }

  // Local Fallback: Straight line
  const directDist = L.latLng(start).distanceTo(L.latLng(end)) / 1000;
  return {
    coordinates: [start, end] as [number, number][],
    distance: directDist,
    duration: (directDist / 30) * 60, 
    isFallback: true,
    error: "Using estimated route (Direct)"
  };
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MissionTracker({ request, role = 'donor' }: MissionTrackerProps) {
  const socket = getSocket();
  const { addToast } = useAppStore();
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<any>(null);
  
  const hospitalCoords = useMemo<[number, number]>(() => [
    request.location.coordinates[1],
    request.location.coordinates[0]
  ], [request.location.coordinates]);

  const watchId = useRef<number | null>(null);
  const lastFetchedPos = useRef<[number, number] | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!socket) return;
    
    // Join the request room to receive donor updates
    socket.emit('join_request_room', { requestId: request._id });

    if (role === 'admin') {
      // Admin Role: Listen for donor's live updates via socket
      const handleLocationUpdate = (payload: any) => {
         if (payload.requestId === request._id && payload.coordinates) {
            setCurrentPos([payload.coordinates[1], payload.coordinates[0]]);
         }
      };

      socket.on(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, handleLocationUpdate);
      
      // Fallback: If request already has liveTracking data, use it for initial position
      if (request.liveTracking?.coordinates) {
         setCurrentPos([
            request.liveTracking.coordinates[1],
            request.liveTracking.coordinates[0]
         ]);
      }

      return () => {
        socket.off(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, handleLocationUpdate);
        socket.emit('leave_request_room', { requestId: request._id });
      };
    } else {
      // Donor Role: Watch own position and emit to others
      if (!("geolocation" in navigator)) {
        addToast("Geolocation is not supported by your browser", "alert");
        return;
      }

      // Initial position fetch to get moving faster
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setCurrentPos(newPos);
          socket.emit(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, {
            requestId: request._id,
            coordinates: [longitude, latitude] // GeoJSON
          });
        },
        (error) => console.warn("Initial GPS fetch failed:", error.message),
        { enableHighAccuracy: true }
      );

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setCurrentPos(newPos);

          // Emit to socket
          socket.emit(SOCKET_EVENTS.DONOR_LOCATION_UPDATE, {
            requestId: request._id,
            coordinates: [longitude, latitude] // GeoJSON format
          });
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      return () => {
        if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        socket.emit('leave_request_room', { requestId: request._id });
      };
    }
  }, [request._id, socket, addToast, role, request.liveTracking]);

  useEffect(() => {
    if (currentPos && hospitalCoords[0] && hospitalCoords[1]) {
      // Only fetch if moved more than 20 meters from last fetch
      if (lastFetchedPos.current && route) {
        const dist = L.latLng(currentPos).distanceTo(L.latLng(lastFetchedPos.current));
        if (dist < 20) return; 
      }

      setIsFetching(true);
      fetchRoute(currentPos, hospitalCoords).then(data => {
        if (data) {
          setRoute(data);
          lastFetchedPos.current = currentPos;
        }
      }).finally(() => setIsFetching(false));
    }
  }, [currentPos, hospitalCoords]);

  if (!currentPos) {
    return (
      <div className="h-96 bg-stone-50 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-stone-200">
        <Loader2 className="w-8 h-8 text-red-500 mb-4 animate-spin" />
        <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">Synchronizing Mission GPS...</p>
      </div>
    );
  }

  const statuses = ['matched', 'traveling', 'at_hospital'];
  const currentStatusIndex = statuses.indexOf(request.status);

  return (
    <div className="space-y-6">
      {/* Mission Timeline */}
      <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent pointer-events-none" />
        {statuses.map((s, idx) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2 relative z-10">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                 idx <= currentStatusIndex ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-110' : 'bg-stone-100 text-stone-300'
               }`}>
                 {idx < currentStatusIndex ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
               </div>
               <span className={`text-[9px] font-black uppercase tracking-widest ${idx <= currentStatusIndex ? 'text-stone-900' : 'text-stone-300'}`}>
                 {s.replace('_', ' ')}
               </span>
            </div>
            {idx < statuses.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2 -mt-6 transition-all duration-700 ${idx < currentStatusIndex ? 'bg-red-500' : 'bg-stone-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-inner relative z-0">
          <MapContainer 
            center={currentPos} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={currentPos} />
            
            <Marker position={currentPos} icon={L.divIcon({
              html: `<div class="w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg animate-pulse"></div>`,
              className: 'custom-donor-icon',
              iconSize: [24, 24]
            })} />
            
            <Marker position={hospitalCoords} icon={L.divIcon({
              html: `<div class="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-xl border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></div>`,
              className: 'custom-hospital-icon',
              iconSize: [32, 32]
            })} />

            {route && (
              <>
                {/* Google Maps Style Glow/Shadow Layer */}
                <Polyline 
                  positions={route.coordinates} 
                  pathOptions={{ 
                    color: route.isFallback ? '#94a3b8' : '#2563eb', 
                    weight: 12, 
                    opacity: 0.2,
                    lineJoin: 'round'
                  }} 
                />
                {/* Main Route Line */}
                <Polyline 
                  positions={route.coordinates} 
                  pathOptions={{ 
                    color: route.isFallback ? '#64748b' : '#3b82f6', 
                    weight: 6, 
                    opacity: 1, 
                    lineJoin: 'round',
                    dashArray: route.isFallback ? '10, 10' : undefined
                  }} 
                />
              </>
            )}
          </MapContainer>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm flex flex-col items-end gap-1 z-[1000]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Live Mission Feed</span>
            </div>
            {route?.error && (
              <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {route.error}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-xl flex items-center gap-3 z-[1000]">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Satellite Link</span>
              <span className="text-[10px] font-mono font-bold text-green-400">
                {currentPos[0].toFixed(6)}, {currentPos[1].toFixed(6)}
              </span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Precision</span>
              <span className="text-[10px] font-mono font-bold text-white">±5m</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-stone-900 to-black p-8 rounded-[2rem] text-white shadow-xl h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400" /> Navigation Stats
              </h4>
              
               <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase mb-2">Distance to Hospital</p>
                  <div className="flex items-baseline gap-1">
                    {isFetching && !route ? (
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                    ) : (
                      <>
                        <span className="text-4xl font-black">{route ? route.distance.toFixed(1) : '--'}</span>
                        <span className="text-sm font-bold text-stone-500">KM</span>
                        {route?.isFallback && <span className="text-[9px] font-bold text-stone-500 ml-2 italic">(Estimated)</span>}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase mb-2">Est. Travel Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-3xl font-black">{route ? Math.ceil(route.duration) : '--'}</span>
                    <span className="text-sm font-bold text-stone-500">MINS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-8">
               <div className="flex items-start gap-3">
                 <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                 <div>
                   <p className="text-[10px] font-black text-stone-500 uppercase mb-1">Destination</p>
                   <p className="text-xs font-bold text-stone-200 line-clamp-2">{request.location.address}</p>
                 </div>
               </div>
            </div>
          </div>

          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospitalCoords[0]},${hospitalCoords[1]}`, '_blank')}
            className="w-full py-5 rounded-2xl bg-white border border-stone-200 text-stone-700 font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" />
            Switch to Google Maps
          </button>

          {role === 'donor' && (
            <button 
              onClick={async () => {
                if (window.confirm("Are you sure you want to cancel this mission? This may impact your donor score.")) {
                  try {
                    const { cancelRequest } = (await import('../lib/hooks/useRequests')).useRequests();
                    await cancelRequest(request._id);
                    useAppStore.getState().removeRequest(request._id);
                    addToast("Mission cancelled successfully", "success");
                  } catch (e) {
                    addToast("Failed to cancel mission", "alert");
                  }
                }
              }}
              className="w-full py-4 rounded-xl text-stone-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2"
            >
              Cancel Mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
