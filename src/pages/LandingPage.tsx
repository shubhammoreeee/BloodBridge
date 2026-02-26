import { motion } from 'framer-motion';
import { ArrowRight, Droplets, ShieldCheck, Zap } from 'lucide-react';
import HeroBackground from '../components/HeroBackground';
import StatSection from '../components/StatSection';
import HowItWorks from '../components/HowItWorks';
import LeaderboardAndInventory from '../components/LeaderboardAndInventory';

export default function LandingPage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                <HeroBackground />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-blood-600/10 text-blood-400 px-4 py-2 rounded-full border border-blood-600/20 mb-8"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold tracking-wider uppercase">Emergency Alert System v2.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black text-white leading-tight mb-8"
                        >
                            Find Blood Donors in <span className="text-blood-600">Seconds.</span> <br />
                            <span className="text-gradient">Save Lives.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            BloodBridge connects hospitals and patients with donors instantly. No middleman, no delays—just immediate life-saving connections.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
                        >
                            <button
                                onClick={() => window.location.href = '#how-it-works'}
                                className="w-full sm:w-auto blood-gradient text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-blood-900/40 hover:scale-[1.05] transition-all flex items-center justify-center gap-2"
                            >
                                <Droplets className="w-5 h-5 fill-current" /> How it Works
                            </button>
                            <button
                                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-[2rem] font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                            >
                                Learn More <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-16 flex items-center justify-center gap-8 text-stone-500"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blood-500" />
                                <span className="text-xs font-semibold uppercase tracking-widest">Verified Database</span>
                            </div>
                            <div className="w-px h-10 bg-white/5 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blood-500" />
                                <span className="text-xs font-semibold uppercase tracking-widest">Medical Partnered</span>
                            </div>
                        </motion.div>
                    </div>

                    <StatSection />
                </div>
            </section>

            <section id="how-it-works">
                <HowItWorks />
            </section>

            <LeaderboardAndInventory />

            {/* CTA Section */}
            <section className="py-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-stone-900/60 border border-white/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blood-600/10 blur-[150px] -z-10" />
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to be a Life-Saver?</h2>
                    <p className="text-stone-400 text-lg mb-12 max-w-2xl mx-auto">
                        Join our network of 8,000+ donors and help bridge the gap between emergency and hope. It only takes 2 minutes to register.
                    </p>
                    <button className="blood-gradient text-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:scale-[1.05] transition-all shadow-2xl shadow-blood-900/60 uppercase tracking-widest">
                        Register as Donor Today
                    </button>
                </motion.div>
            </section>
        </main>
    );
}
