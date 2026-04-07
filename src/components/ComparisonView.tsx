import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDown, ArrowUp, Minus, Trophy, Code2, Zap, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ComparisonViewProps {
  data: any;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data }) => {
  if (!data) return null;

  const { comparison, overall_analysis } = data;

  const radarData = [
    { subject: 'LC Solved', you: comparison.leetcode.problems_solved.you, friend: comparison.leetcode.problems_solved.friend },
    { subject: 'LC Rating', you: comparison.leetcode.contest_rating.you / 25, friend: comparison.leetcode.contest_rating.friend / 25 },
    { subject: 'CF Solved', you: comparison.codeforces.problems_solved.you, friend: comparison.codeforces.problems_solved.friend },
    { subject: 'CF Rating', you: comparison.codeforces.contest_rating.you / 20, friend: comparison.codeforces.contest_rating.friend / 20 },
    { subject: 'Badges', you: comparison.badges.you_count * 10, friend: comparison.badges.friend_count * 10 },
    { subject: 'Streak', you: comparison.streak.you, friend: comparison.streak.friend },
  ];

  const StatRow = ({ label, you, friend, gap, unit = "" }: any) => (
    <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-lg border border-outline-variant/5">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">YOU</span>
            <span className="text-sm font-mono text-slate-200">{you}{unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">FRIEND</span>
            <span className="text-sm font-mono text-slate-200">{friend}{unit}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GAP</span>
        <div className={cn(
          "flex items-center gap-1 font-mono text-sm font-bold",
          gap > 0 ? "text-error" : gap < 0 ? "text-secondary" : "text-slate-500"
        )}>
          {gap > 0 ? <ArrowDown className="w-3 h-3" /> : gap < 0 ? <ArrowUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {Math.abs(gap)}{unit}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Skill Comparison</h1>
        <p className="text-slate-500 text-sm">Detailed analysis of your competitive coding standing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 h-[450px] flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Performance Radar
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#464554" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#908fa0', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="YOU"
                  dataKey="you"
                  stroke="#c0c1ff"
                  fill="#c0c1ff"
                  fillOpacity={0.4}
                />
                <Radar
                  name="FRIEND"
                  dataKey="friend"
                  stroke="#4edea3"
                  fill="#4edea3"
                  fillOpacity={0.4}
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171f33', border: '1px solid #464554', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-secondary" />
              LeetCode Analysis
            </h3>
            <div className="space-y-3">
              <StatRow label="Solved" you={comparison.leetcode.problems_solved.you} friend={comparison.leetcode.problems_solved.friend} gap={comparison.leetcode.problems_solved.gap} />
              <StatRow label="Rating" you={comparison.leetcode.contest_rating.you} friend={comparison.leetcode.contest_rating.friend} gap={comparison.leetcode.contest_rating.gap} />
              <div className="flex justify-between px-4 py-2 bg-black/20 rounded-lg text-[10px] font-mono">
                <span className="text-slate-500">LEVELS</span>
                <span className="text-slate-300 uppercase">{comparison.leetcode.level.you} vs {comparison.leetcode.level.friend}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-tertiary" />
              Codeforces Analysis
            </h3>
            <div className="space-y-3">
              <StatRow label="Solved" you={comparison.codeforces.problems_solved.you} friend={comparison.codeforces.problems_solved.friend} gap={comparison.codeforces.problems_solved.gap} />
              <StatRow label="Rating" you={comparison.codeforces.contest_rating.you} friend={comparison.codeforces.contest_rating.friend} gap={comparison.codeforces.contest_rating.gap} />
              <div className="flex justify-between px-4 py-2 bg-black/20 rounded-lg text-[10px] font-mono">
                <span className="text-slate-500">LEVELS</span>
                <span className="text-slate-300 uppercase">{comparison.codeforces.level.you} vs {comparison.codeforces.level.friend}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-primary/5 border border-primary/20 p-8 rounded-xl">
          <h3 className="text-primary font-headline font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Neural Gap Analysis
          </h3>
          <p className="text-slate-300 leading-relaxed italic">
            "{overall_analysis}"
          </p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            Common Stats
          </h3>
          <div className="space-y-4">
            <StatRow label="Badges" you={comparison.badges.you_count} friend={comparison.badges.friend_count} gap={comparison.badges.gap} />
            <StatRow label="Streak" you={comparison.streak.you} friend={comparison.streak.friend} gap={comparison.streak.gap} unit="d" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import { motion } from 'motion/react';
