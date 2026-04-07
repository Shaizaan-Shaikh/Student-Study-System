import React from 'react';
import { cn } from '@/src/lib/utils';

interface TopicItemProps {
  icon: React.ReactNode;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  solved: number;
  total: number;
}

export const TopicItem: React.FC<TopicItemProps> = ({ icon, title, difficulty, progress, solved, total }) => {
  const diffColor = 
    difficulty === 'Beginner' ? 'text-secondary bg-secondary/10' :
    difficulty === 'Intermediate' ? 'text-tertiary bg-tertiary/10' :
    'text-error bg-error/10';

  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-all cursor-pointer group">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-headline font-bold text-slate-200">{title}</h4>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest", diffColor)}>
              {difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{solved}/{total}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <span className="text-secondary font-mono font-bold">{progress}%</span>
        <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-200 transition-colors">chevron_right</span>
      </div>
    </div>
  );
};
