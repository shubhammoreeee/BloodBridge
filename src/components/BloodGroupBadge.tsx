import React from 'react';

type Variant = 'solid' | 'outlined' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  group: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export default function BloodGroupBadge({ group, variant = 'solid', size = 'md', className = '' }: Props) {
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md min-w-[36px]',
    md: 'text-[20px] font-bold px-3 py-1 rounded-xl min-w-[56px]',
    lg: 'text-[28px] font-extrabold px-4 py-2 rounded-2xl min-w-[80px]',
    xl: 'text-[56px] font-extrabold px-6 py-4 rounded-3xl min-w-[120px]'
  }

  const variantClasses = {
    solid: 'bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] text-white shadow-sm',
    outlined: 'bg-white border-2 border-[var(--orange-200)] text-[var(--orange-600)]',
    dark: 'bg-[var(--bg-dark)] text-[var(--orange-400)] border border-white/10'
  }

  return (
    <div className={`font-display inline-flex items-center justify-center text-center ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {group}
    </div>
  )
}
