import { motion } from 'framer-motion';
import { Map as MapIcon, ArrowLeft, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';

export default function AdminMapView() {
    const navigate = useNavigate();

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto font-outfit h-screen flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-stone-500 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <MapIcon className="text-blood-500 w-8 h-8" />
                            Donor <span className="text-blood-600">Radar</span>
                        </h1>
                        <p className="text-stone-400 text-sm">Spatial distribution of verified regional donors.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                        <input
                            type="text"
                            placeholder="Search Region..."
                            className="bg-stone-900 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blood-600 outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl border border-white/10 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-grow min-h-[500px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full"
                >
                    <MapView />
                </motion.div>
            </div>
        </div>
    );
}
