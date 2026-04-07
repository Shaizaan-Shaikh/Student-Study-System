import React from 'react';
import { AlertCircle, Brain } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Weak Topics */}
      <div className="bg-surface-container-low p-8 rounded-xl">
        <h3 className="text-lg font-headline font-bold text-slate-200 mb-6 flex items-center gap-2">
          <AlertCircle className="text-error w-5 h-5" /> 
          Critical Weaknesses
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Dynamic Programming', value: 42, color: 'bg-error' },
            { label: 'Segment Trees', value: 28, color: 'bg-error' },
            { label: 'Greedy Algorithms', value: 61, color: 'bg-tertiary' },
          ].map((topic) => (
            <div key={topic.label} className="flex items-center justify-between group">
              <span className="text-slate-300 text-sm font-medium">{topic.label}</span>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-xs ${topic.color.replace('bg-', 'text-')}`}>{topic.value}% Success</span>
                <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${topic.color}`} style={{ width: `${topic.value}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-primary/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-slate-200">Neural Insights</h3>
            <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">AI Recommended Path</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-surface-container rounded-lg border-l-2 border-primary">
            <p className="text-sm font-medium text-slate-200">Practice "Tree DP" from LeetCode Premium.</p>
            <p className="text-xs text-slate-500 mt-1">Analyzing your recent failures on Codeforces Round #842.</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg border-l-2 border-secondary">
            <p className="text-sm font-medium text-slate-200">Daily challenge: 3 Sliding Window problems.</p>
            <p className="text-xs text-slate-500 mt-1">Goal: Improve implementation speed for Div.2 A/B.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
