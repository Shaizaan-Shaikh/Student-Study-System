import React from 'react';
import { User, Mail, Github, Globe, Settings, Edit2, HelpCircle, Play } from 'lucide-react';

interface ProfileViewProps {
  student: any;
  onReplayTutorial?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ student, onReplayTutorial }) => {
  if (!student) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account and platform connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 text-center">
            <div className="relative inline-block mb-6">
              <img src={student.avatar} className="w-32 h-32 rounded-full border-4 border-primary/20 p-1" alt={student.name} />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg hover:scale-110 transition-transform">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-2xl font-headline font-bold text-slate-100">{student.name}</h2>
            <p className="text-slate-500 text-sm mb-6">{student.email}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-highest/30 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Level</p>
                <p className="font-mono text-xl text-primary font-bold">{student.level}</p>
              </div>
              <div className="bg-surface-container-highest/30 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Points</p>
                <p className="font-mono text-xl text-secondary font-bold">{student.total_points}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4">Connections</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-300">LeetCode</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-300">Codeforces</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-300">CodeChef</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings / Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-slate-200 mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Full Name</label>
                  <input type="text" defaultValue={student.name} className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Email Address</label>
                  <input type="email" defaultValue={student.email} className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Bio</label>
                <textarea rows={4} className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary" placeholder="Tell us about your coding journey..." />
              </div>

              <div className="flex justify-end">
                <button className="px-8 py-2 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-slate-200 mb-6">Security</h3>
            <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-500/10 rounded text-slate-400">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Enable</button>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold text-slate-200 mb-6">Help & Support</h3>
            <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded text-primary">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Platform Walkthrough</p>
                  <p className="text-xs text-slate-500">Replay the onboarding guide to learn about features.</p>
                </div>
              </div>
              <button 
                onClick={onReplayTutorial}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                View Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
