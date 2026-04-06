import { motion } from 'framer-motion';
import { Zap, Map, Trophy, Building2, Bell, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Instant Matching",
    description: "Our algorithm matches blood type and live geolocation, connecting hospitals to donors in under 3 minutes."
  },
  {
    icon: Map,
    title: "Live GPS Tracking",
    description: "Follow the donor's journey from acceptance to arrival at the hospital in real-time."
  },
  {
    icon: Trophy,
    title: "Rewards System",
    description: "Earn points for saving lives. Climb the local leaderboard and unlock verified hero badges."
  },
  {
    icon: Building2,
    title: "Hospital Portal",
    description: "A centralized dashboard for hospitals to broadcast emergencies and manage blood inventory."
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "No spam. You only receive push notifications when your specific blood type is needed urgently nearby."
  },
  {
    icon: ShieldCheck,
    title: "Blood Inventory",
    description: "Real-time stock levels and automated critical low-stock alerts across regional clusters."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Decorative noise */}
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-[var(--orange-600)] text-sm font-black tracking-[0.2em] uppercase mb-4"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-[var(--text-primary)]"
          >
            Everything You Need to Save Lives Faster
          </motion.h2>
        </div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-[2rem] p-8 border border-[var(--border-light)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] flex items-center justify-center mb-6 shadow-md group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-[22px] font-bold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
