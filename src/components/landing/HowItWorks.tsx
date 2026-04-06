import { motion } from 'framer-motion';
import { Building2, MapPin, Medal } from 'lucide-react';

const steps = [
  {
    id: "01",
    icon: Building2,
    title: "Hospital Broadcasts an Emergency",
    body: "Verified hospitals post real-time blood requests with type, urgency, and unit count. The alert goes live in under 10 seconds across the network.",
    align: "left" as const,
  },
  {
    id: "02",
    icon: MapPin,
    title: "Smart Matching Finds Nearby Donors",
    body: "Our algorithm matches by blood type compatibility AND live location. Donors within the exact required radius get an instant push alert.",
    align: "right" as const,
  },
  {
    id: "03",
    icon: Medal,
    title: "Donor Arrives, Donates, Gets Rewarded",
    body: "Real-time tracking shows the donor's journey. On completion, earn 100 reward points, climb the leaderboard, and know you saved a life.",
    align: "left" as const,
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[var(--bg-primary)] overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-[var(--orange-500)] text-sm font-black tracking-[0.2em] uppercase mb-4"
          >
            The Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-[52px] leading-tight font-extrabold text-[var(--text-primary)] mb-6"
          >
            From Alert to Donation in Minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-[var(--text-muted)]"
          >
            Three steps. Zero friction. Maximum impact.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-24 md:space-y-32 relative">
          
          {/* Connector Line (Desktop only) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--orange-300)] to-transparent -translate-x-1/2 opacity-20" />

          {steps.map((step, index) => {
            const isLeft = step.align === 'left';
            const Icon = step.icon;

            return (
              <div key={step.id} className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 relative`}>
                
                {/* Number Watermark (Background) */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-0 md:left-12' : 'right-0 md:right-12'} text-[120px] md:text-[180px] font-display font-extrabold text-[var(--orange-500)] opacity-5 pointer-events-none select-none -z-10 leading-none`}>
                  {step.id}
                </div>

                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-center`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--orange-50)] text-[var(--orange-500)] mb-6 shadow-sm border border-[var(--orange-200)] ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                    {step.title}
                  </h3>
                  <p className="font-body text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                    {step.body}
                  </p>
                </motion.div>

                {/* Visual Placeholder */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, x: isLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex-1 w-full"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-lg)] border border-[var(--border-light)] relative aspect-[4/3] flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--orange-50)] to-transparent opacity-50" />
                    {/* Abstract UI representation */}
                    <div className="relative z-10 w-full max-w-[280px] space-y-4 transition-transform duration-500 group-hover:scale-105">
                      {index === 0 && (
                        <>
                          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <div className="h-2 bg-red-200 rounded w-24" />
                          </div>
                          <div className="bg-[var(--bg-primary)] border border-[var(--border-light)] p-4 rounded-xl space-y-3">
                            <div className="h-2 bg-[var(--border-medium)] rounded w-full" />
                            <div className="h-2 bg-[var(--border-medium)] rounded w-3/4" />
                            <div className="h-8 bg-[var(--orange-500)] rounded-lg w-full mt-4" />
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <div className="w-full aspect-square rounded-full border-2 border-dashed border-[var(--orange-300)] flex items-center justify-center relative">
                            <div className="absolute inset-10 bg-[var(--orange-100)] rounded-full animate-pulse opacity-50" />
                            <div className="w-8 h-8 rounded-full bg-[var(--orange-500)] relative z-10 shadow-[var(--shadow-glow)]" />
                            <div className="absolute -right-4 top-10 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
                            <div className="absolute -left-2 bottom-12 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                      )}
                      {index === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                            <div className="flex-1 h-3 bg-green-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full" />
                            </div>
                          </div>
                          <div className="bg-white border border-[var(--border-light)] p-6 rounded-2xl text-center shadow-sm">
                            <div className="text-3xl mb-2">🏆</div>
                            <div className="text-[var(--orange-600)] font-bold font-mono">+100 Points</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
