import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../store/useAppStore';

const DonorIcon = L.divIcon({
    className: 'custom-donor-icon',
    html: `<div class="w-4 h-4 bg-blood-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const HospitalIcon = L.divIcon({
    className: 'custom-hospital-icon',
    html: `<div class="w-8 h-8 bg-black rounded-lg border-2 border-blood-500 flex items-center justify-center text-blood-500 shadow-2xl">H</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

export default function MapView() {
    const { mockDonors } = useAppStore();
    const center: [number, number] = [40.7128, -74.006];

    return (
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Hospital Location */}
                <Marker position={center} icon={HospitalIcon}>
                    <Popup className="custom-popup">
                        <div className="font-outfit p-1">
                            <p className="font-black text-rose-600">Central Hub</p>
                            <p className="text-[10px] text-gray-500">Emergency Center</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Current Donor Location */}
                <Circle
                    center={center}
                    radius={5000}
                    pathOptions={{ color: '#e11d48', fillColor: '#e11d48', fillOpacity: 0.05 }}
                />

                {/* Mock Donors */}
                {mockDonors.map((donor) => (
                    <Marker
                        key={donor.id}
                        position={[donor.lat, donor.lng]}
                        icon={DonorIcon}
                    >
                        <Popup>
                            <div className="font-outfit p-2 min-w-[120px]">
                                <p className="font-black text-xs uppercase">{donor.name}</p>
                                <p className="text-[10px] font-bold text-blood-600">{donor.bloodGroup} Group</p>
                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-[8px] font-black text-gray-400 capitalize">{donor.distance}</span>
                                    <button className="text-[8px] font-black bg-blood-600 text-white px-2 py-1 rounded">NOTIFY</button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Map Overlay Controls */}
            <div className="absolute bottom-6 left-6 z-10 space-y-2 pointer-events-none">
                <div className="glass p-4 rounded-2xl pointer-events-auto border-white/5 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Scanning Network</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">
                        {mockDonors.length} Eligible Donors Found Nearby
                    </p>
                </div>
            </div>
        </div>
    );
}
