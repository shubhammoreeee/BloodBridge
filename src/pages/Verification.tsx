import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore, type BloodGroup } from '../store/useAppStore';
import { ArrowLeft, CheckCircle2, MapPin, User, ShieldCheck, Phone, Droplets, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Verification() {
    const navigate = useNavigate();
    const { role, updateDonorProfile, updateAdminProfile, addNotification } = useAppStore();
    const [loading, setLoading] = useState(false);

    // Form states
    const [donorForm, setDonorForm] = useState({
        name: '',
        phone: '',
        bloodGroup: 'O+' as BloodGroup,
        lastDonation: '',
        location: 'Downtown'
    });

    const [adminForm, setAdminForm] = useState({
        name: 'Admin User',
        hospitalName: '',
        adminId: ''
    });

    const handleBack = () => navigate('/');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (role === 'donor') {
            updateDonorProfile({
                ...donorForm,
                onboarded: true
            });
            addNotification(`Welcome ${donorForm.name}! Profile verified.`, "success");
            navigate('/donor');
        } else if (role === 'admin') {
            updateAdminProfile({
                ...adminForm,
                onboarded: true
            });
            addNotification("Hospital credentials verified.", "success");
            navigate('/admin');
        }
        setLoading(false);
    };

    if (!role) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blood-600/5 blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-12 rounded-[3rem] border-white/10 max-w-xl w-full relative"
            >
                <button
                    onClick={handleBack}
                    className="absolute top-8 left-8 p-2 text-stone-500 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blood-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-blood-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                        Verification <span className="text-blood-600 italic">Step</span>
                    </h1>
                    <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">
                        {role === 'donor' ? 'Donor Onboarding' : 'Hospital Authorization'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {role === 'donor' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                    placeholder="e.g. John Doe"
                                    value={donorForm.name}
                                    onChange={e => setDonorForm({ ...donorForm, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                        <Droplets className="w-3 h-3" /> Blood Group
                                    </label>
                                    <select
                                        className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                        value={donorForm.bloodGroup}
                                        onChange={e => setDonorForm({ ...donorForm, bloodGroup: e.target.value as BloodGroup })}
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> Phone
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                        placeholder="+1 234..."
                                        value={donorForm.phone}
                                        onChange={e => setDonorForm({ ...donorForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Location Permission
                                </label>
                                <div className="bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-stone-400 flex items-center justify-between font-bold">
                                    <span>Downtown, NY</span>
                                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest">Last Donation Date (Approx)</label>
                                <input
                                    type="date"
                                    className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                    value={donorForm.lastDonation}
                                    onChange={e => setDonorForm({ ...donorForm, lastDonation: e.target.value })}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Hospital / Blood Bank Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                    placeholder="e.g. City General Hospital"
                                    value={adminForm.hospitalName}
                                    onChange={e => setAdminForm({ ...adminForm, hospitalName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                    Admin Employee ID
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blood-600 transition-all font-bold"
                                    placeholder="e.g. ADMIN-8822"
                                    value={adminForm.adminId}
                                    onChange={e => setAdminForm({ ...adminForm, adminId: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Authorization Node
                                </label>
                                <div className="bg-stone-900/50 border border-white/10 rounded-2xl py-4 px-5 text-stone-400 flex items-center justify-between font-bold">
                                    <span>Authorized Regional HQ</span>
                                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 mt-4",
                            loading ? "bg-stone-800 text-stone-500" : "blood-gradient text-white hover:scale-[1.02] shadow-blood-900/40"
                        )}
                    >
                        {loading ? (
                            <>Verifying...</>
                        ) : (
                            <>ENTER DASHBOARD <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
