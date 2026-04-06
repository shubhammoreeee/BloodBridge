import { motion, useInView } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import BloodDropAnimation from './BloodDropAnimation';

function AnimatedCounter({ value, duration = 2 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(value * easeOutExpo(progress)));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [value, duration, inView]);

  const easeOutExpo = (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  return <span ref={nodeRef}>{count.toLocaleString()}{value > 1000 ? '+' : ''}</span>;
}

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[95vh] pt-32 pb-16 overflow-hidden bg-[var(--bg-primary)]">
      {/* Dynamic Gradients */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-primary)] pointer-events-none" />
      <div 
        className="absolute inset-0 z-0 opacity-60 pointer-events-none mix-blend-multiply"
        style={{ background: 'var(--gradient-mesh)' }}
      />
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none noise"
      />
      
      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(var(--orange-500) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (Text) */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 border border-[var(--orange-500)]/30 bg-[var(--orange-50)] text-[var(--orange-700)] px-4 py-1.5 rounded-full mb-8 w-fit shadow-sm"
            >
              <span className="text-sm">🩸</span>
              <span className="text-[11px] font-bold tracking-widest uppercase">Real-Time Blood Matching</span>
            </motion.div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-[80px] font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)] mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                Save Lives.
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <span className="text-gradient pr-2 pb-2">Find Donors.</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                Right Now.
              </motion.div>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-body text-xl text-[var(--text-secondary)] mb-10 max-w-[480px] leading-relaxed"
            >
              BloodBridge connects hospitals with nearby compatible donors instantly. No waiting. No uncertainty. Just lives saved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 400, damping: 30 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-4"
            >
              <button
                onClick={() => navigate('/role-selection')}
                className="w-full sm:w-auto h-14 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white px-8 rounded-full font-bold text-base shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
              >
                I Am a Donor 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/role-selection')}
                className="w-full sm:w-auto h-14 bg-white text-[var(--orange-600)] border-2 border-[var(--orange-200)] hover:border-[var(--orange-400)] px-8 rounded-full font-bold text-base shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Building2 className="w-5 h-5" />
                Hospital / Blood Bank
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-body text-[13px] text-[var(--text-muted)] font-medium"
            >
              ✓ Verified donors &nbsp;&nbsp; ✓ HIPAA-safe &nbsp;&nbsp; ✓ Free forever
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-12 flex items-center gap-4 sm:gap-8 font-mono text-sm sm:text-base font-bold text-[var(--orange-600)]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🩸</span>
                <AnimatedCounter value={12450} /> Lives
              </div>
              <div className="w-px h-6 bg-[var(--orange-200)]" />
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <AnimatedCounter value={8200} /> Donors
              </div>
              <div className="w-px h-6 bg-[var(--orange-200)] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xl">🏥</span>
                <AnimatedCounter value={340} /> Hospitals
              </div>
            </motion.div>

          </div>

          {/* Right Column (Visual) */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <BloodDropAnimation />
          </div>

        </div>
      </div>
    </section>
  );
}
