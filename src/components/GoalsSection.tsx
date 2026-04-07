import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';

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

  // For demo purposes, if no goals exist, show a placeholder
  const activeGoal = (goals || []).find(g => !g.completed) || goals?.[0] || {
    title: "Daily Grind: Complete 5 problems",
    target: 5,
    current_progress: 3,
    completed: false
  };

  const progress = (activeGoal.current_progress / activeGoal.target) * 100;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-headline font-bold text-slate-200">{activeGoal.title}</h2>
          <p className="text-slate-500 text-sm mt-1">Complete your target to maintain your architect status.</p>
        </div>
        
        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-mono text-primary font-bold">PROGRESS</span>
            <span className="text-lg font-mono text-slate-200 font-bold">{activeGoal.current_progress}/{activeGoal.target}</span>
          </div>
          <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden p-1 border border-primary/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full neon-glow"
            />
          </div>
        </div>
        
        <button 
          disabled={activeGoal.current_progress < activeGoal.target}
          onClick={() => 'id' in activeGoal && handleClaim(activeGoal.id)}
          className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all ${
            activeGoal.current_progress >= activeGoal.target 
              ? "bg-primary text-on-primary shadow-primary/25 hover:scale-105 active:scale-95" 
              : "bg-surface-container-highest text-slate-500 cursor-not-allowed"
          }`}
        >
          {activeGoal.completed ? "REWARDED" : "CLAIM REWARDS"}
        </button>
      </div>
    </div>
  );
};
