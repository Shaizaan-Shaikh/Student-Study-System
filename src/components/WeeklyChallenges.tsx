import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Trophy, 
  Code, 
  Layout, 
  Terminal, 
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: string;
  progress: number;
  icon: React.ElementType;
  color: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'wc1',
    title: "Build a To-Do App",
    description: "Create a functional To-Do application using vanilla JavaScript and LocalStorage.",
    difficulty: 'Easy',
    reward: '50 XP',
    progress: 0,
    icon: Layout,
    color: 'text-blue-500'
  },
  {
    id: 'wc2',
    title: "Solve 15 DSA Problems",
    description: "Complete 15 problems from the 'Arrays' and 'Strings' categories this week.",
    difficulty: 'Medium',
    reward: '150 XP + Badge',
    progress: 40,
    icon: Code,
    color: 'text-primary'
  },
  {
    id: 'wc3',
    title: "Create a Landing Page UI",
    description: "Design and code a responsive landing page for a SaaS product using Tailwind CSS.",
    difficulty: 'Medium',
    reward: '100 XP',
    progress: 0,
    icon: Terminal,
    color: 'text-secondary'
  },
  {
    id: 'wc4',
    title: "Master Dynamic Programming",
    description: "Solve 5 Hard-level DP problems from the Striver's sheet.",
    difficulty: 'Hard',
    reward: '300 XP + Premium Access',
    progress: 10,
    icon: Zap,
    color: 'text-error'
  }
];

export const WeeklyChallenges: React.FC = () => {
  const [startedChallenges, setStartedChallenges] = useState<string[]>(['wc2', 'wc4']);

  const toggleStart = (id: string) => {
    if (startedChallenges.includes(id)) return;
    setStartedChallenges(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-headline font-bold text-slate-200">Weekly Challenges</h2>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ends in 4 days</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES.map((challenge) => {
          const isStarted = startedChallenges.includes(challenge.id);
          return (
            <div 
              key={challenge.id} 
              className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-5 hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute -top-12 -right-12 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                challenge.difficulty === 'Easy' ? "bg-green-500" :
                challenge.difficulty === 'Medium' ? "bg-primary" : "bg-error"
              )} />

              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg bg-surface-container-highest", challenge.color)}>
                  <challenge.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                    challenge.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
                    challenge.difficulty === 'Medium' ? "bg-primary/10 text-primary" :
                    "bg-error/10 text-error"
                  )}>
                    {challenge.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-secondary">
                    <Star className="w-3 h-3 fill-current" />
                    {challenge.reward}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-primary transition-colors">
                {challenge.title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {challenge.description}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Progress</span>
                  <span className="text-[10px] font-mono text-slate-300">{challenge.progress}%</span>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    className={cn(
                      "h-full",
                      challenge.difficulty === 'Easy' ? "bg-green-500" :
                      challenge.difficulty === 'Medium' ? "bg-primary" : "bg-error"
                    )}
                  />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-outline-variant/5 flex items-center justify-between">
                {isStarted ? (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    In Progress
                  </div>
                ) : (
                  <button 
                    onClick={() => toggleStart(challenge.id)}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    Start Challenge
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
