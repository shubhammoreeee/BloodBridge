import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Phone, Droplets, MapPin } from 'lucide-react';
import { useAppStore, type BloodGroup } from '../store/useAppStore';

interface ProfileEditorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileEditor({ isOpen, onClose }: ProfileEditorProps) {
    const { donorProfile, updateDonorProfile, addNotification } = useAppStore();
    const [formData, setFormData] = useState({
        name: donorProfile.name,
        phone: donorProfile.phone,
        bloodGroup: donorProfile.bloodGroup,
        location: donorProfile.location
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateDonorProfile(formData);
        addNotification("Profile updated successfully!", "success");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass p-8 md:p-10 rounded-[3rem] border-white/10 max-w-lg w-full relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 text-stone-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Edit <span className="text-blood-500">Profile</span></h2>
                        <p className="text-stone-500 text-sm font-medium mb-8 border-b border-white/5 pb-4">Update your personal information below.</p>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 flex items-center gap-2">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-stone-900 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold focus:ring-2 focus:ring-blood-600 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-stone-500 ml-1 flex items-center gap-2">
                                        <Droplets className="w-3 h-3" /> Blood Group
                                    </label>
                                    <select
                                        className="w-full bg-stone-900 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold"
                                        value={formData.bloodGroup}
                                        onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-stone-500 ml-1 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full bg-stone-900 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-stone-500 ml-1 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Preferred Location
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-stone-900 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold outline-none"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full blood-gradient text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blood-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                <Save className="w-5 h-5" /> SAVE UPDATES
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
