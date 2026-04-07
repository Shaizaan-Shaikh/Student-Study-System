import React from 'react';
import { Flame, Award, Gem, Trophy, Zap, Target } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BadgeProps {
  icon: 'flame' | 'hundred' | 'gem' | 'trophy' | 'zap' | 'target';
  label: string;
  active?: boolean;
}

const iconMap = {
  flame: Flame,
  hundred: Award,
  gem: Gem,
  trophy: Trophy,
  zap: Zap,
  target: Target
};

export const Badge: React.FC<BadgeProps> = ({ icon, label, active = false }) => {
  const Icon = iconMap[icon];
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300",
      active 
        ? "bg-surface-container-high border-primary/30 text-primary" 
        : "bg-surface-container-lowest border-outline-variant/10 text-slate-600 grayscale opacity-50"
    )}>
      <Icon className={cn("w-8 h-8 mb-2", active ? "fill-primary/20" : "")} />
      <span className="text-[10px] font-bold uppercase tracking-tighter text-center">{label}</span>
    </div>
  );
};
