import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Bell, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function NotificationToast() {
    const { notifications, removeNotification } = useAppStore();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="pointer-events-auto"
                    >
                        <div className={`
              min-w-[320px] p-4 rounded-2xl shadow-2xl border flex items-center gap-4 glass
              ${n.type === 'alert' ? 'border-blood-500/50 bg-blood-950/40 text-blood-200' :
                                n.type === 'success' ? 'border-green-500/50 bg-green-950/40 text-green-200' :
                                    'border-white/20 bg-stone-900/80 text-white'}
            `}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${n.type === 'alert' ? 'bg-blood-500/20 text-blood-400' :
                                    n.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                        'bg-white/10 text-white'}
              `}>
                                {n.type === 'alert' ? <AlertCircle className="w-6 h-6" /> :
                                    n.type === 'success' ? <CheckCircle className="w-6 h-6" /> :
                                        <Bell className="w-6 h-6" />}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold">{n.message}</p>
                            </div>

                            <button
                                onClick={() => removeNotification(n.id)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
