import React from 'react';

export const ActivityHeatmap: React.FC = () => {
  // Generate mock data for 52 weeks
  const weeks = 52;
  const days = 7;
  const totalCells = weeks * days;

  return (
    <div className="bg-surface-container-low p-8 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-headline font-bold text-slate-200">Global Activity Map</h2>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mr-2">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-surface-container-highest"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
            <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest ml-2">More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-max">
          {Array.from({ length: totalCells }).map((_, i) => {
            const intensity = Math.random();
            return (
              <div 
                key={i}
                className={`w-3 h-3 rounded-sm transition-colors duration-300 hover:ring-1 hover:ring-white/30 cursor-pointer ${
                  intensity > 0.8 ? 'bg-primary' : 
                  intensity > 0.5 ? 'bg-primary/60' : 
                  intensity > 0.2 ? 'bg-primary/20' : 
                  'bg-surface-container-highest'
                }`}
                title={`Activity level: ${Math.round(intensity * 10)}`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
        <span>Jul</span>
        <span>Sep</span>
        <span>Nov</span>
      </div>
    </div>
  );
};
