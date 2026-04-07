import React from 'react';
import { LayoutDashboard, Code2, Trophy, FileEdit, Target, User as UserIcon, RefreshCw, Users, GraduationCap, Timer, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../context/FirebaseContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: GraduationCap, label: 'Learning Path', id: 'learning-path' },
  { icon: Code2, label: 'Problems', id: 'problems' },
  { icon: Timer, label: 'Focus Mode', id: 'focus' },
  { icon: MessageSquare, label: 'Mock Interview', id: 'interview' },
  { icon: Users, label: 'Friends', id: 'friends' },
  { icon: Trophy, label: 'Leaderboard', id: 'leaderboard' },
  { icon: FileEdit, label: 'Notes', id: 'notes' },
  { icon: Target, label: 'Goals', id: 'goals' },
  { icon: UserIcon, label: 'Profile', id: 'profile' },
];

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const { user } = useFirebase();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-[45] transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <nav className={cn(
        "fixed left-0 top-0 h-full w-64 pt-20 flex flex-col z-50 bg-background border-r border-outline-variant/10 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 mb-8">
          <p className="text-primary font-headline font-bold text-lg">COMMAND</p>
          <p className="font-sans uppercase tracking-widest text-[10px] text-slate-500">V1.0.2-ALPHA</p>
        </div>
        
        {user && (
          <div className="px-6 mb-8 flex items-center gap-3">
            <img 
              src={user.avatar || ""} 
              className="w-10 h-10 rounded-full border border-primary/20" 
              alt="User"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-primary font-mono">LVL {user.level || 1}</p>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                if (onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center px-6 py-3 transition-all duration-300 group",
                currentView === item.id 
                  ? "text-primary bg-primary/5 border-r-2 border-primary" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-surface-container"
              )}
            >
              <item.icon className={cn("w-4 h-4 mr-3", currentView === item.id ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="font-sans uppercase tracking-widest text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <button className="w-full bg-primary text-on-primary text-[10px] font-bold py-3 rounded-full uppercase tracking-tighter shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-3 h-3" />
            SYNC DATA
          </button>
        </div>
      </nav>
    </>
  );
};
