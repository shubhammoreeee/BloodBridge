import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function StatCounter({ value, label, suffix = '' }: { value: number, label: string, suffix?: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;
      const duration = 2.5; // 2.5 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
          const easeOutQuint = 1 - Math.pow(1 - progress, 5);
          setCount(Math.floor(value * easeOutQuint));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [value, inView]);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={nodeRef} 
        className="font-display text-5xl md:text-[56px] font-extrabold text-[var(--orange-400)] mb-2"
      >
        {value === 3 ? '< 3' : count.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-sm font-medium text-white/60 tracking-wider uppercase">
        {label}
      </div>
    </div>
  );
}

export default function Statsband() {
  return (
    <section className="relative w-full py-20 bg-[var(--bg-dark)] overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 noise-dark pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange-900)]/10 via-transparent to-[var(--orange-900)]/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-[var(--orange-500)]/20">
          <StatCounter value={12450} suffix="+" label="Lives Saved" />
          <StatCounter value={8200} suffix="" label="Active Donors" />
          <StatCounter value={3} suffix=" min" label="Avg Match Time" />
          <StatCounter value={99} suffix=".2%" label="Success Rate" />
        </div>
      </div>
    </section>
  );
}
