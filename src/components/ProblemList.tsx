import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Circle, Filter } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Challenge';
  platform: string;
  tags: string[];
  solved: boolean;
}

interface ProblemListProps {
  problems: any[];
  onSelect: (id: string) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({ problems, onSelect }) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredProblems = filter === 'All' 
    ? problems 
    : problems.filter(p => p.difficulty.toLowerCase() === filter.toLowerCase());

  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Challenge'];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-slate-100">Problems</h1>
          <p className="text-slate-500 text-sm">Browse and solve competitive programming problems</p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
          <Filter className="w-3 h-3 text-slate-500 ml-2" />
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === d 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:text-slate-200"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Difficulty</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Platform</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tags</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProblems.map((p) => (
                <tr 
                  key={p.id} 
                  className="hover:bg-surface-container transition-colors group cursor-pointer"
                  onClick={() => onSelect(p.id)}
                >
                  <td className="px-6 py-4">
                    {p.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-200 group-hover:text-primary transition-colors">{p.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                      p.difficulty.toLowerCase() === 'easy' ? "text-secondary bg-secondary/10" :
                      p.difficulty.toLowerCase() === 'medium' ? "text-tertiary bg-tertiary/10" :
                      p.difficulty.toLowerCase() === 'hard' ? "text-error bg-error/10" :
                      "text-primary bg-primary/10"
                    )}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 uppercase">{p.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-surface-container-highest text-slate-500 rounded uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-500 group-hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/10">
          {filteredProblems.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onSelect(p.id)}
              className="p-6 hover:bg-surface-container transition-colors space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {p.solved ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                  <h3 className="text-sm font-bold text-slate-200">{p.title}</h3>
                </div>
                <span className={cn(
                  "text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest",
                  p.difficulty.toLowerCase() === 'easy' ? "text-secondary bg-secondary/10" :
                  p.difficulty.toLowerCase() === 'medium' ? "text-tertiary bg-tertiary/10" :
                  p.difficulty.toLowerCase() === 'hard' ? "text-error bg-error/10" :
                  "text-primary bg-primary/10"
                )}>
                  {p.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag: string) => (
                    <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-surface-container-highest text-slate-500 rounded uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">{p.platform}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500 font-headline">
            No problems found for this difficulty level.
          </div>
        )}
      </div>
    </div>
  );
};
