import { motion } from 'framer-motion';
import { Hospital, Search, Bell, Heart, Gift, ArrowRight } from 'lucide-react';

const steps = [
    { icon: Hospital, title: 'Hospital Request', desc: 'Medical facility sends an urgent blood requirement alert.' },
    { icon: Search, title: 'AI Matching', desc: 'Our system identifies the nearest eligible donors with matching types.' },
    { icon: Bell, title: 'Donor Notified', desc: 'Compatible donors receive instant mobile notifications and alerts.' },
    { icon: Heart, title: 'Donation Done', desc: 'Donor arrives at the facility and completes the life-saving process.' },
    { icon: Gift, title: 'Get Rewards', desc: 'Secure points and unlock health benefits as a token of appreciation.' },
];

export default function HowItWorks() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-stone-400">A seamless bridge between request and life-saving donation.</p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-1 bg-gradient-to-r from-blood-600/0 via-blood-600/50 to-blood-600/0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-stone-900 border border-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:bg-blood-600 transition-all duration-500">
                                        <Icon className="w-10 h-10 text-blood-500 group-hover:text-white transition-colors" />
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center text-xs font-bold text-stone-400">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold mb-2">{step.title}</h4>
                                    <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Rewards Preview */}
                <div id="rewards" className="mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-6">Gamified Rewards & Benefits</h3>
                            <p className="text-stone-400 text-lg mb-8">
                                Being a hero comes with perks. We believe in appreciating our donors through a comprehensive recognition system.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Earn points for every successful donation',
                                    'Unlock free full-body checkups after 3 donations',
                                    'Priority medical assistance for you and family',
                                    'Badges and social recognition in the community'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blood-500/20 flex items-center justify-center text-blood-500">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-stone-300 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-10 blood-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-[1.05] transition-transform">
                                Become a Donor Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { title: 'Free Health Checkup', points: 150, color: 'bg-blue-500' },
                                { title: 'Medicine Discount', points: 200, color: 'bg-green-500' },
                                { title: 'Diagnostic Vouchers', points: 300, color: 'bg-purple-500' },
                                { title: 'Premium Badge', points: 500, color: 'bg-amber-500' },
                            ].map((reward, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 w-2 h-full ${reward.color} opacity-50`} />
                                    <Gift className="w-8 h-8 text-white/20 mb-4 group-hover:text-white/40 transition-colors" />
                                    <h4 className="text-white font-bold mb-1">{reward.title}</h4>
                                    <div className="text-sm text-stone-500 font-medium">{reward.points} Points</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Check(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
