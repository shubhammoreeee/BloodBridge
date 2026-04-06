import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();

  const titleWords1 = "Your Blood Type Could Save a Life".split(" ");
  const titleWords2 = "Waiting for You Right Now.".split(" ");

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-[var(--orange-600)]">
      {/* Background Layer */}
      <div className="absolute inset-0 blood-gradient" />
      <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
      
      {/* Decorative Drop Watermark */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -top-20 text-[600px] text-white opacity-[0.03] pointer-events-none leading-none select-none"
      >
        💧
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
              {titleWords1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-2">
              {titleWords2.map((word, i) => (
                <motion.span
                  key={`w2-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (titleWords1.length * 0.1) + (i * 0.1), type: "spring", stiffness: 200, damping: 20 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-body text-xl text-white/80 font-medium max-w-2xl mx-auto mb-12"
          >
            Join 8,200+ donors already making a difference. Registration takes 2 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              onClick={() => navigate('/role-selection')}
              className="w-full sm:w-auto h-14 bg-white text-[var(--orange-600)] hover:bg-[var(--orange-50)] px-10 rounded-full font-bold text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            >
              Register as Donor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/role-selection')}
              className="w-full sm:w-auto h-14 bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/5 px-8 rounded-full font-bold text-base transition-all flex items-center justify-center gap-3"
            >
              <Building2 className="w-5 h-5" />
              I Represent a Hospital
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 1 }}
            className="font-body text-[13px] text-white/60 font-bold uppercase tracking-widest"
          >
            12,450 lives saved &nbsp; · &nbsp; 340 hospitals &nbsp; · &nbsp; Available 24/7
          </motion.div>

        </div>
      </div>
    </section>
  );
}
