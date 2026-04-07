import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Target } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { cn } from '../lib/utils';

interface Goal {
  id: string;
  title: string;
  target: number;
  current_progress: number;
  completed: boolean;
}

export const GoalsSection: React.FC = () => {
  const { user } = useFirebase();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/dashboard/${user.id}`);
        const response = await res.json();
        if (response.success) {
          setGoals(response.data.activeChallenges || []);
        }
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const handleClaim = async (goalId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/challenges/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, challenge_id: goalId, progress_value: 1 })
      });
      const response = await res.json();
      if (response.success) {
        // Refresh goals
        const dashRes = await fetch(`/api/dashboard/${user.id}`);
        const dashData = await dashRes.json();
        setGoals(dashData.data.activeChallenges || []);
      }
    } catch (error) {
      console.error("Failed to update goal", error);
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return g.completed;
    if (filter === 'Pending') return !g.completed && g.current_progress === 0;
    if (filter === 'In Progress') return !g.completed && g.current_progress > 0;
    return true;
  });

  // For demo purposes, if no goals exist, show a placeholder
  const activeGoal = filteredGoals.find(g => !g.completed) || filteredGoals[0] || {
    title: "Daily Grind: Complete 5 problems",
    target: 5,
    current_progress: 3,
    completed: false
  };

  const progress = (activeGoal.current_progress / activeGoal.target) * 100;

  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Active Goals</h2>
            </div>
            <Trophy className="w-4 h-4 text-secondary/40" />
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Completed', 'Pending', 'In Progress'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all",
                  filter === f 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "bg-surface-container-highest/50 text-slate-500 hover:text-slate-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="flex-1 bg-surface-container-low/50 border border-outline-variant/5 rounded-xl p-4 flex flex-col mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-100 leading-snug mb-1">
              {activeGoal.title}
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Maintain your architect status by completing your targets.
            </p>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-slate-500 font-bold tracking-widest uppercase">Current Progress</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-mono text-primary font-bold leading-none">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-300 font-bold">
                  {activeGoal.current_progress} <span className="text-slate-600">/</span> {activeGoal.target}
                </span>
              </div>
            </div>
            
            <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="h-full bg-primary shadow-[0_0_8px_rgba(192,193,255,0.5)]"
              />
            </div>
          </div>
        </div>
        
        {/* Action */}
        <button 
          disabled={activeGoal.current_progress < activeGoal.target}
          onClick={() => 'id' in activeGoal && handleClaim(activeGoal.id)}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all",
            activeGoal.current_progress >= activeGoal.target 
              ? "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]" 
              : "bg-surface-container-highest text-slate-600 cursor-not-allowed"
          )}
        >
          {activeGoal.completed ? "REWARDED" : "CLAIM REWARDS"}
        </button>
      </div>
    </div>
  );
};
