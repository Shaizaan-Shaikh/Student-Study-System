import React from 'react';
import { BookOpen } from 'lucide-react';

interface SheetCardProps {
  title: string;
  description: string;
  solved: number;
  total: number;
  color: string;
}

export const SheetCard: React.FC<SheetCardProps> = ({ title, description, solved, total, color }) => {
  const progress = (solved / total) * 100;
  
  return (
    <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('bg-', 'bg-opacity-10 text-'))}>
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-headline font-bold text-slate-200 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000", color)} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">{solved}/{total} solved</span>
          <span className="text-secondary font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/src/lib/utils';
