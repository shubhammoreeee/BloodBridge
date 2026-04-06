import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Mail, 
  Save, RotateCw, ShieldCheck, 
  History, Settings, Camera,
  Map as MapIcon, Compass, UserCircle, Navigation2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdmin } from '../lib/hooks/useAdmin';
import { useAppStore } from '../store/useAppStore';
import { pageVariants } from '../components/animations';

// Map specific icon fixes
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map events and centering
function MapController({ center, onLocationSelect }: { center: [number, number], onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function AdminProfile() {
  const { getProfile, updateProfile } = useAdmin();
  const { setAuth, token, addToast } = useAppStore();
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    phone: '',
    email: '',
    address: '',
    lat: 0,
    lng: 0
  });
  const [locationSource, setLocationSource] = useState<'database' | 'gps' | 'manual'>('database');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getProfile();
        const initialLat = data.location?.coordinates?.[1] || 0;
        const initialLng = data.location?.coordinates?.[0] || 0;
        
        setFormData({
          hospitalName: data.hospitalName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.location?.address || '',
          lat: initialLat,
          lng: initialLng
        });

        // Only trigger Auto-GPS if the coordinates are the system defaults (New York)
        // This prevents overwriting a manually saved hospital location on every refresh.
        // If coordinates are 0, it means the location is unset or default, so attempt detection
        const isNotSet = initialLat === 0 && initialLng === 0;
        if (isNotSet) {
          autoDetectGPS();
        } else {
          setLocationSource('database');
        }
      } catch (error) {
        addToast('Failed to load profile', 'alert');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const autoDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev: any) => ({ 
            ...prev, 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude 
          }));
          setLocationSource('gps');
          addToast("📍 Live location synced automatically!", "success");
        },
        () => {
          // Silent fallback to DB coords (already set in formData)
          console.warn("GPS permission denied or unavailable");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      addToast("Geolocation not supported", "alert");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev: any) => ({ 
          ...prev, 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude 
        }));
        setLocationSource('gps');
        setIsDetecting(false);
        addToast("Current GPS location detected!", "success");
      },
      () => {
        setIsDetecting(false);
        addToast("Error detecting location", "alert");
      }
    );
  };

  const verifyAddress = async () => {
    if (!formData.address) return;
    try {
      setIsDetecting(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData((prev: any) => ({ 
          ...prev, 
          lat: parseFloat(lat), 
          lng: parseFloat(lon),
          address: display_name 
        }));
        setLocationSource('manual');
        addToast("Address verified and matched!", "success");
      } else {
        addToast("Could not find address coordinates", "alert");
      }
    } catch (e) {
      addToast("Geocoding service unavailable", "alert");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await updateProfile({
        hospitalName: formData.hospitalName,
        phone: formData.phone,
        email: formData.email,
        location: {
           type: 'Point',
           address: formData.address,
           coordinates: [formData.lng, formData.lat]
        }
      });
      
      // Update form data with final server response
      setFormData({
        hospitalName: updated.hospitalName || '',
        phone: updated.phone || '',
        email: updated.email || '',
        address: updated.location?.address || '',
        lat: updated.location?.coordinates?.[1] || 0,
        lng: updated.location?.coordinates?.[0] || 0
      });

      if (token) {
        setAuth(token, updated, 'admin');
      }
      addToast('Facility profile updated successfully!', 'success');
      setLocationSource('database'); // Reset to database since it's now saved
    } catch (error) {
      addToast('Failed to update profile', 'alert');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--orange-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Profile Header */}
      <div className="relative group">
        <div className="h-48 bg-gradient-to-r bg-orange-200/70 via-orange-600 to-stone-900 rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 opacity-70  bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-[var(--orange-500)] rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />
        </div>
        
        <div className="absolute -bottom-10 left-12 flex items-end gap-8">
           <div className="relative">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1.5 shadow-2xl">
                 <div className="w-full h-full bg-[var(--bg-subtle)] rounded-[2rem] flex items-center justify-center text-5xl font-black text-[var(--orange-500)] border border-[var(--border-light)] relative overflow-hidden group/avatar">
                    {formData.hospitalName[0]}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                       <Camera className="w-6 h-6" />
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mb-4">
              <h1 className="text-3xl font-display font-black text-[var(--text-primary)] leading-tight">{formData.hospitalName}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                 <div className="px-3 py-1 bg-[var(--orange-50)] text-[var(--orange-600)] text-[10px] font-black uppercase tracking-widest rounded-full border border-[var(--orange-100)] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Facility
                 </div>
                 <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {formData.address || 'Mumbai, IN'}
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16 pt-8">
        {/* Left Col: Details & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-[var(--border-light)] shadow-sm">
             <div className="flex items-center gap-3 mb-10">
                <Settings className="w-5 h-5 text-[var(--orange-500)]" />
                <h3 className="text-xl font-display font-bold">Facility Information</h3>
             </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Hospital Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="text" 
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                      className="w-full pl-11 pr-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--orange-200)] transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-11 pr-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--orange-200)] transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--orange-200)] transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Facility Address</label>
                    <div className="flex gap-2">
                       <button 
                         type="button"
                         onClick={detectLocation}
                         disabled={isDetecting}
                         className="text-[10px] font-black uppercase tracking-widest text-[var(--orange-600)] hover:bg-[var(--orange-50)] px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                       >
                          <Navigation2 className="w-3 h-3" /> Detect GPS
                       </button>
                       <button 
                         type="button"
                         onClick={verifyAddress}
                         disabled={isDetecting || !formData.address}
                         className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                       >
                          <Compass className="w-3 h-3" /> Verify Address
                       </button>
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Enter full hospital address..."
                      className="w-full pl-11 pr-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--orange-200)] transition-all font-bold"
                    />
                  </div>

                  {/* Manual Map Picker Widget */}
                  <div className="mt-4 rounded-3xl overflow-hidden border border-[var(--border-light)] shadow-inner h-[280px] z-10 relative">
                     <MapContainer 
                       center={[formData.lat, formData.lng]} 
                       zoom={15} 
                       style={{ height: '100%', width: '100%' }}
                       zoomControl={false}
                     >
                       <TileLayer
                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                       />
                       <MapController 
                         center={[formData.lat, formData.lng]} 
                         onLocationSelect={(lat, lng) => {
                           setFormData((p: any) => ({ ...p, lat, lng }));
                           setLocationSource('manual');
                         }} 
                       />
                       <Marker 
                         position={[formData.lat, formData.lng]} 
                         draggable={true}
                         eventHandlers={{
                           dragend: (e) => {
                             const marker = e.target;
                             const position = marker.getLatLng();
                             setFormData((p: any) => ({ ...p, lat: position.lat, lng: position.lng }));
                             setLocationSource('manual');
                           }
                         }}
                       />
                     </MapContainer>
                     
                     {/* Map Status Badges */}
                     <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end">
                        {locationSource === 'gps' && (
                           <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                           >
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Live GPS Active
                           </motion.div>
                        )}
                        {locationSource === 'manual' && (
                           <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="bg-[var(--orange-500)] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                           >
                              Manual Position
                           </motion.div>
                        )}
                        {locationSource === 'database' && (
                           <div className="bg-white/90 backdrop-blur-md text-[var(--text-muted)] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--border-light)] shadow-sm">
                              Saved Location
                           </div>
                        )}
                     </div>

                     <div className="absolute bottom-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border border-white/50 shadow-lg pointer-events-none">
                        Pin Hospital Location
                     </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[var(--border-light)] flex items-center justify-between">
                 <p className="text-xs text-[var(--text-muted)] font-medium max-w-[200px]">
                    Updating these details will reflect on your facility profile for all nearby users.
                 </p>
                 <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-3 px-10 py-5 bg-[var(--orange-500)] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-orange-100 hover:bg-[var(--orange-600)] transition-all hover:scale-105 disabled:opacity-50"
                 >
                    {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile Changes
                 </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Badges & Links */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-[var(--border-light)] shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <History className="w-5 h-5 text-[var(--orange-500)]" />
                 <h3 className="text-xl font-display font-bold">Operational Info</h3>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-[var(--text-muted)]">
                       <MapIcon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Coordinates</p>
                       <p className="text-sm font-bold text-[var(--text-primary)]">
                          {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-[var(--text-muted)]">
                       <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Admin Role</p>
                       <p className="text-sm font-bold text-[var(--text-primary)] capitalize">Facility Manager</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[var(--bg-subtle)] p-10 rounded-[3rem] border border-white">
              <h4 className="text-lg font-display font-bold mb-4">Security Notice</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                 You are accessing the administrative profile. Changes to location coordinates must be verified by the system administrator to maintain live tracking accuracy.
              </p>
              <button className="mt-8 text-xs font-black uppercase tracking-widest text-[var(--orange-600)] hover:underline">
                 Request Key Reset
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
