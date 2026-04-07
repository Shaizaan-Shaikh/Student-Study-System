import React from 'react';
import { Search, Bell, Terminal, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useFirebase();

  return (
    <header className="fixed top-0 left-0 w-full z-[60] flex justify-between items-center px-4 md:px-6 h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-lg md:text-xl font-headline font-black text-primary tracking-tight">OBSERVATORY</span>
        <div className="hidden md:flex items-center bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant/15">
          <Search className="text-slate-500 w-4 h-4 mr-2" />
          <input 
            className="bg-transparent border-none text-sm focus:outline-none text-slate-200 w-64 placeholder:text-slate-500" 
            placeholder="Search systems..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-primary transition-colors duration-200">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-400 hover:text-primary transition-colors duration-200">
          <Terminal className="w-5 h-5" />
        </button>
        
        {user && (
          <div className="relative group">
            <img 
              alt="Engineer Avatar" 
              className="w-8 h-8 rounded-full border border-primary/20 cursor-pointer"
              src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <div className="px-3 py-2 border-b border-outline-variant/10 mb-1">
                <p className="text-sm font-bold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Level {user.level} Architect</p>
              </div>
              <button className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-surface-container-highest hover:text-slate-200 rounded transition-colors">Profile</button>
              <button 
                onClick={logout}
                className="w-full text-left px-3 py-2 text-xs text-error hover:bg-error/10 rounded transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
