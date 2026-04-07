import React from 'react';
import { Code2, Trophy, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PlatformStats } from '@/src/types';

interface PlatformCardProps {
  stats: PlatformStats;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ stats }) => {
  const isLeetCode = stats.name === 'LeetCode';
  const isCodeforces = stats.name === 'Codeforces';
  const isCodeChef = stats.name === 'CodeChef';

  const handlePlatformClick = () => {
    const urls: Record<string, string> = {
      'LeetCode': 'https://leetcode.com',
      'Codeforces': 'https://codeforces.com',
      'CodeChef': 'https://codechef.com',
      'HackerRank': 'https://hackerrank.com'
    };
    const url = urls[stats.name];
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div 
      onClick={handlePlatformClick}
      className="bg-surface-container p-6 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300 cursor-pointer border border-outline-variant/5 hover:border-primary/20"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {isLeetCode && <Code2 className="w-16 h-16" />}
        {isCodeforces && <Trophy className="w-16 h-16" />}
        {isCodeChef && <Star className="w-16 h-16" />}
      </div>

      <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
        <span className={cn("w-2 h-6 rounded-full", stats.color)}></span> 
        {stats.name}
      </h3>

      {isLeetCode && stats.difficultyBreakdown && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Solved</span>
            <span className="font-mono text-xl text-slate-200">{stats.solved}/{stats.total}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-1.5 bg-secondary/10 rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex-1 h-1.5 bg-tertiary/10 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex-1 h-1.5 bg-error/10 rounded-full overflow-hidden">
              <div className="bg-error h-full" style={{ width: '15%' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>EASY</span><span>MED</span><span>HARD</span>
          </div>
        </div>
      )}

      {isCodeforces && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Rating</p>
              <p className="font-mono text-xl text-primary font-bold">{stats.rating}</p>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Max</p>
              <p className="font-mono text-xl text-slate-200 font-bold">{stats.maxRating}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Solved Count</span>
            <span className="font-mono text-lg text-slate-200">{stats.solved}</span>
          </div>
        </div>
      )}

      {isCodeChef && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-tertiary">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 fill-tertiary" />)}
              <Star className="w-4 h-4" />
            </div>
            <span className="text-slate-200 font-bold">4-Star</span>
          </div>
          <div className="flex justify-between items-center bg-secondary/5 p-3 rounded-lg border border-secondary/10">
            <span className="text-secondary text-sm font-medium">Rank</span>
            <span className="font-mono text-xl text-secondary">#{stats.rank}</span>
          </div>
        </div>
      )}
    </div>
  );
};
