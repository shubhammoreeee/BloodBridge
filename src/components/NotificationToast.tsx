import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { X, AlertCircle, CheckCircle2, Info, Star } from 'lucide-react';

export default function NotificationToast() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-[380px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onRemove }: { toast: any, onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const config = {
    alert:   { icon: <AlertCircle className="w-5 h-5 text-red-500" />,   color: 'bg-red-500',   bgColor: 'bg-red-50' },
    success: { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: 'bg-green-500', bgColor: 'bg-green-50' },
    info:    { icon: <Info className="w-5 h-5 text-blue-500" />,          color: 'bg-blue-500',  bgColor: 'bg-blue-50' },
    reward:  { icon: <Star className="w-5 h-5 text-[var(--orange-500)]" />, color: 'bg-[var(--orange-500)]', bgColor: 'bg-[var(--orange-50)]' }
  }[toast.type as 'alert' | 'success' | 'info' | 'reward'] || { 
    icon: <Info className="w-5 h-5 text-stone-500" />, color: 'bg-stone-500', bgColor: 'bg-stone-50' 
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white rounded-2xl shadow-xl border border-[var(--border-light)] overflow-hidden pointer-events-auto flex relative"
    >
      <div className={`w-1 shrink-0 ${config.color}`} />
      
      <div className="flex px-4 py-4 gap-3 w-full">
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${config.bgColor}`}>
          {config.icon}
        </div>
        
        <div className="flex-grow pt-0.5">
          <h4 className="font-body text-[15px] font-bold text-[var(--text-primary)] leading-snug">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="font-body text-[13px] text-[var(--text-muted)] mt-1 line-clamp-2">
              {toast.message}
            </p>
          )}
        </div>

        <button 
          onClick={onRemove}
          className="shrink-0 text-stone-400 hover:text-stone-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <motion.div 
        className={`absolute bottom-0 left-0 h-[3px] ${config.color} opacity-20`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
}
