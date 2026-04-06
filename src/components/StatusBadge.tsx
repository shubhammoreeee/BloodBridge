import React from 'react';
import { Clock, CheckCircle2, Navigation, MapPin, Search, XCircle, Activity } from 'lucide-react';

interface Props {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, className = '', size = 'md' }: Props) {
  const getStyling = () => {
    switch(status) {
      case 'active':
      case 'urgent':
        return { 
          bg: 'bg-orange-50 text-orange-600 border-orange-200', 
          icon: <span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>,
          label: 'Active' 
        };
      case 'searching':
        return { bg: 'bg-stone-100 text-stone-600 border-stone-200', icon: <Search className="w-3 h-3 mr-1.5 animate-pulse" />, label: 'Searching...' };
      case 'matched':
        return { bg: 'bg-blue-50 text-blue-600 border-blue-200', icon: <CheckCircle2 className="w-3 h-3 mr-1.5" />, label: 'Matched' };
      case 'traveling':
        return { bg: 'bg-[var(--orange-100)] text-[var(--orange-700)] border-[var(--orange-300)]', icon: <Navigation className="w-3 h-3 mr-1.5" />, label: 'En Route' };
      case 'at_hospital':
        return { bg: 'bg-green-50 text-green-700 border-green-200', icon: <MapPin className="w-3 h-3 mr-1.5" />, label: 'At Hospital' };
      case 'donating':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <Activity className="w-3 h-3 mr-1.5 animate-pulse" />, label: 'Donating' };
      case 'completed':
        return { bg: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle2 className="w-3 h-3 mr-1.5" />, label: 'Completed' };
      case 'cancelled':
        return { bg: 'bg-stone-100 text-stone-500 border-stone-200 line-through', icon: <XCircle className="w-3 h-3 mr-1.5" />, label: 'Cancelled' };
      default:
        return { bg: 'bg-stone-50 text-stone-600 border-stone-200', icon: <Clock className="w-3 h-3 mr-1.5" />, label: status || 'Pending' };
    }
  }

  const s = getStyling()

  return (
    <div className={`inline-flex items-center font-bold uppercase tracking-widest rounded-full border ${size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'} ${s.bg} ${className}`}>
      {s.icon}
      {s.label}
    </div>
  )
}
