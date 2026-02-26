import { motion } from 'framer-motion';
import { User, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function RoleSelect() {
    const navigate = useNavigate();
    const setRole = useAppStore((state) => state.setRole);

    const handleRoleSelection = (role: 'donor' | 'admin') => {
        setRole(role);
        navigate('/verification');
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-stone-950">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blood-600/10 blur-[150px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 md:p-16 rounded-[4rem] border-white/10 max-w-4xl w-full text-center relative"
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-10 left-10 p-2 text-stone-500 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-8 h-8" />
                </button>

                <h1 className="text-5xl font-black text-white mb-4 tracking-tighter italic">Select Your <span className="text-blood-600">Gateway</span></h1>
                <p className="text-stone-500 text-lg mb-16 font-medium max-w-lg mx-auto">Choose your role to enter the BloodBridge ecosystem.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                        onClick={() => handleRoleSelection('donor')}
                        className="group relative h-80 rounded-[3rem] overflow-hidden border-2 border-white/5 hover:border-blood-600 transition-all shadow-2xl bg-stone-900/40"
                    >
                        <div className="absolute inset-0 bg-blood-600/0 group-hover:bg-blood-600/10 transition-colors" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                            <div className="w-24 h-24 bg-stone-950 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                                <User className="w-12 h-12 text-blood-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">I am Donor</h3>
                            <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">Ready to save lives</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelection('admin')}
                        className="group relative h-80 rounded-[3rem] overflow-hidden border-2 border-white/5 hover:border-blood-600 transition-all shadow-2xl bg-stone-900/40"
                    >
                        <div className="absolute inset-0 bg-blood-600/0 group-hover:bg-blood-600/10 transition-colors" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                            <div className="w-24 h-24 bg-stone-950 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                                <LayoutDashboard className="w-12 h-12 text-blood-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">I am Admin</h3>
                            <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">Blood Bank Coordination</p>
                        </div>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
