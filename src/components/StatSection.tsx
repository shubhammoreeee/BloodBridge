import { motion } from 'framer-motion';
import { Heart, Users, Activity } from 'lucide-react';

const stats = [
    { label: 'Lives Saved', value: '12,450+', icon: Heart, color: 'text-rose-500' },
    { label: 'Active Donors', value: '8,200', icon: Users, color: 'text-blue-500' },
    { label: 'Emergency Requests', value: '142', icon: Activity, color: 'text-amber-500' },
];

export default function StatSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20 px-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="glass p-6 rounded-3xl flex items-center gap-5 group"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                            <div className="text-stone-400 font-medium">{stat.label}</div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
