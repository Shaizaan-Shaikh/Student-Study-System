import React, { useEffect, useState } from 'react';

interface LeaderboardUser {
  name: string;
  avatar: string;
  total_points: number;
  rank: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const response = await res.json();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden">
      <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/5">
        <h2 className="text-xl font-headline font-bold text-slate-200">Global Leaderboard</h2>
        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
      </div>
      <div className="divide-y divide-outline-variant/5">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs animate-pulse">
            LOADING GLOBAL DATA...
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.name} className="px-8 py-4 flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <span className={`font-mono font-bold w-4 ${user.rank === 1 ? 'text-primary' : 'text-slate-500'}`}>
                  {user.rank.toString().padStart(2, '0')}
                </span>
                <img 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-primary/20 group-hover:border-primary transition-colors" 
                  src={user.avatar}
                  referrerPolicy="no-referrer"
                />
                <span className="font-headline font-medium text-slate-200">{user.name}</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-slate-500 uppercase">Points</p>
                  <p className="font-mono text-sm text-secondary font-bold">{user.total_points.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            NO USERS FOUND. BE THE FIRST TO JOIN!
          </div>
        )}
      </div>
    </div>
  );
};
