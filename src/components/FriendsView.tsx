import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Check, X, MessageSquare, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  total_points: number;
}

interface FriendsViewProps {
  onCompare: (friendId: string) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ onCompare }) => {
  const { user } = useFirebase();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/friends/${user.id}`);
        const data = await res.json();
        if (data.success) setFriends(data.data);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Social Hub</h1>
        <p className="text-slate-500 text-sm">Connect with fellow architects and compare your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Friend List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/5 flex justify-between items-center">
              <h2 className="text-xl font-headline font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Your Friends
              </h2>
              <span className="text-xs font-mono text-slate-500">{friends.length} FRIENDS</span>
            </div>
            
            <div className="divide-y divide-outline-variant/5">
              {loading ? (
                <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">
                  LOADING CONNECTIONS...
                </div>
              ) : friends.length > 0 ? (
                friends.map((friend) => (
                  <div key={friend.id} className="px-8 py-6 flex items-center justify-between hover:bg-surface-container transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={friend.avatar} className="w-12 h-12 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors" alt={friend.name} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-slate-200">{friend.name}</h3>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{friend.total_points} POINTS</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onCompare(friend.id)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all"
                        title="Compare Skills"
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-surface-container-highest text-slate-300 rounded-lg hover:text-slate-100 transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <p className="font-mono text-xs mb-4 uppercase">No friends yet. Start building your network!</p>
                  <button className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest">Find Architects</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Requests & Suggestions */}
        <div className="space-y-6">
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-secondary" />
              Friend Requests
            </h3>
            <div className="space-y-4">
              {/* Mock Request */}
              <div className="flex items-center justify-between p-3 bg-surface-container-highest/50 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-8 h-8 rounded-full" alt="Alex" />
                  <span className="text-xs font-bold text-slate-200">Alex Coder</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-all">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-500 font-mono italic">No more pending requests</p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Suggested Architects</h3>
            <div className="space-y-4">
              {[
                { name: "CodeNinja", points: 3420, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja" },
                { name: "AlgoMaster", points: 2890, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Algo" }
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} className="w-8 h-8 rounded-full" alt={s.name} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{s.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{s.points} PTS</p>
                    </div>
                  </div>
                  <button className="text-primary hover:underline text-[10px] font-bold uppercase tracking-widest">Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
