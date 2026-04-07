import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface DayData {
  date: string;
  count: number;
  intensity: number;
}

interface MonthData {
  name: string;
  days: DayData[];
}

export const ActivityHeatmap: React.FC = () => {
  // Generate mock data for the last 6 months
  const generateMockData = (): MonthData[] => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map(month => {
      const daysInMonth = 28; // 4 weeks exactly for clean 7x4 grid in demo
      const days: DayData[] = Array.from({ length: daysInMonth }).map((_, i) => {
        const intensity = Math.random() > 0.3 ? Math.random() : 0; // More empty days for realism
        const count = Math.floor(intensity * 12);
        return {
          date: `${month} ${i + 1}, 2024`,
          count,
          intensity
        };
      });
      return { name: month, days };
    });
  };

  const activityData = generateMockData();

  const getIntensityClass = (intensity: number) => {
    if (intensity === 0) return 'bg-[#161b22]'; // GitHub dark empty color
    if (intensity < 0.25) return 'bg-[#0e4429]'; // GitHub level 1
    if (intensity < 0.5) return 'bg-[#006d32]';  // GitHub level 2
    if (intensity < 0.75) return 'bg-[#26a641]'; // GitHub level 3
    return 'bg-[#39d353] shadow-[0_0_10px_rgba(57,211,83,0.4)]'; // GitHub level 4
  };

  return (
    <div className="bg-[#0d1117] p-8 rounded-2xl border border-outline-variant/10 shadow-2xl">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-headline font-bold text-slate-100 tracking-tight">Contribution Activity</h2>
            <p className="text-slate-500 text-sm font-mono mt-0.5">624 problems in the last year</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-mono font-bold text-slate-100 leading-none">256</p>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-2">active days</p>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar pb-8 -mx-2 px-2">
        <div className="flex gap-6 min-w-max">
          {activityData.map((month, mIdx) => (
            <div 
              key={month.name}
              className="bg-[#161b22]/40 p-6 rounded-2xl border border-white/5 shadow-inner min-w-[150px]"
            >
              <h3 className="text-sm font-headline font-bold text-slate-300 mb-5 ml-1">{month.name}</h3>
              <div className="grid grid-flow-col grid-rows-7 gap-2">
                {month.days.map((day, dIdx) => (
                  <div key={dIdx} className="relative group">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (mIdx * 28 + dIdx) * 0.001 }}
                      className={cn(
                        "w-4 h-4 rounded-[3px] transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-white/20",
                        getIntensityClass(day.intensity)
                      )}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-slate-100 text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-2xl transition-all translate-y-1 group-hover:translate-y-0">
                      <span className="font-bold text-emerald-400">{day.count} problems solved</span> on {day.date}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-4 mt-2 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-[3px] bg-[#161b22]"></div>
          <div className="w-4 h-4 rounded-[3px] bg-[#0e4429]"></div>
          <div className="w-4 h-4 rounded-[3px] bg-[#006d32]"></div>
          <div className="w-4 h-4 rounded-[3px] bg-[#26a641]"></div>
          <div className="w-4 h-4 rounded-[3px] bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.3)]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
