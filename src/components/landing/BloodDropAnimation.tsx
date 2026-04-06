import { motion } from 'framer-motion';

export default function BloodDropAnimation() {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-[var(--orange-500)]/5 blur-[100px] rounded-full" />

      {/* Pulsing Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute inset-0 m-auto rounded-full border border-[var(--orange-400)] border-opacity-20"
          style={{ width: '40%', height: '40%' }}
          animate={{
            scale: [1, 2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Central Blood Drop */}
      <motion.div
        className="relative z-10 w-48 h-48 drop-shadow-2xl"
        style={{ filter: 'drop-shadow(var(--shadow-glow))' }}
        animate={{ y: [-12, 12, -12] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--orange-400)" />
              <stop offset="50%" stopColor="var(--orange-500)" />
              <stop offset="100%" stopColor="var(--orange-700)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M99.6385 10.1582C96.3986 6.32623 90.932 5.95252 87.2173 9.31754L85.2974 11.0568C79.8817 15.9621 73.1932 22.3995 65.5162 30.6401C49.9723 47.3276 34.0205 68.3241 23.3642 92.5186C12.3996 117.414 7 144.514 11.3912 170.838C15.6888 196.599 30.603 219.866 51.5235 234.341C72.444 248.816 97.6405 253.257 122.128 246.541C146.616 239.825 167.332 222.617 180.208 200.741C193.085 178.865 196.883 154.516 191.071 130.407C185.061 105.474 170.218 82.8569 154.519 63.858C146.885 54.6186 138.834 46.16 131.026 38.5667C120.301 28.1363 110.378 19.3361 103.111 13.5678C103.111 13.5678 101.442 12.288 99.6385 10.1582Z"
            fill="url(#dropGradient)"
            filter="url(#glow)"
          />
        </svg>
      </motion.div>

      {/* Orbiting Cards */}
      <motion.div
        className="absolute top-[10%] right-[5%] z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-[var(--border-medium)] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs font-bold text-[var(--text-primary)]">Rahul S. — O+ — 2.3km</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] right-[-5%] z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-red-50 px-4 py-3 rounded-2xl shadow-xl border border-red-200 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <p className="text-xs font-bold text-red-700">CRITICAL — A- Needed</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] left-[0%] z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="bg-green-50 px-4 py-3 rounded-2xl shadow-xl border border-green-200">
          <p className="text-xs font-bold text-green-700">✅ +100 pts — Donation Complete</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[20%] left-[-10%] z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-[var(--border-medium)] flex items-center gap-2">
          <span className="text-[16px]">📍</span>
          <p className="text-xs font-bold text-[var(--text-primary)]">3 donors nearby</p>
        </div>
      </motion.div>
    </div>
  );
}
