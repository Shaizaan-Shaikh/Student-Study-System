import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  isStreak?: boolean;
  subText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendType, isStreak, subText }) => {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl border-b-2 border-transparent hover:border-primary transition-all duration-300 group">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end gap-2">
        <span className={cn(
          "text-4xl font-headline font-bold",
          isStreak ? "text-tertiary" : "text-primary"
        )}>
          {value}
          {isStreak && <Flame className="inline-block ml-1 w-6 h-6 fill-tertiary" />}
        </span>
        <div className="flex flex-col mb-1">
          {trend && (
            <span className={cn(
              "text-xs font-mono",
              trendType === 'positive' ? "text-secondary" : trendType === 'negative' ? "text-error" : "text-slate-400"
            )}>
              {trend}
            </span>
          )}
          {subText && <span className="text-slate-500 text-[10px] font-mono">{subText}</span>}
        </div>
      </div>
    </div>
  );
};
