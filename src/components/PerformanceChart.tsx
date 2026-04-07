import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Jan', rating: 1200 },
  { name: 'Feb', rating: 1350 },
  { name: 'Mar', rating: 1300 },
  { name: 'Apr', rating: 1500 },
  { name: 'May', rating: 1650 },
  { name: 'Jun', rating: 1600 },
  { name: 'Jul', rating: 1800 },
  { name: 'Aug', rating: 1750 },
  { name: 'Sep', rating: 1900 },
  { name: 'Oct', rating: 2100 },
  { name: 'Nov', rating: 2050 },
  { name: 'Dec', rating: 2200 },
];

export const PerformanceChart: React.FC = () => {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-headline font-bold text-slate-200">Performance Over Time</h2>
          <p className="text-slate-500 text-xs mt-1">Consolidated rating trend across all competitive platforms</p>
        </div>
        <div className="flex bg-surface-container-highest rounded-full p-1">
          <button className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">6 MONTHS</button>
          <button className="px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors">1 YEAR</button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#464554" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#908fa0', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              hide 
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(192, 193, 255, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#171f33', 
                border: '1px solid rgba(192, 193, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono'
              }}
              itemStyle={{ color: '#c0c1ff' }}
            />
            <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? '#c0c1ff' : '#c0c1ff33'} 
                  className="hover:fill-primary transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
