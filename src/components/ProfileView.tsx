import React, { useState } from 'react';
import { User, Mail, Github, Globe, Settings, Edit2, HelpCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileViewProps {
  student: any;
  onReplayTutorial?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ student, onReplayTutorial }) => {
  if (!student) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-slate-100">Profile</h1>
          <p className="text-slate-500 text-sm">Manage your account and platform connections</p>
        </div>
        <button 
          onClick={onReplayTutorial}
          className="flex items-center gap-2 px-6 py-2 bg-surface-container-highest text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest hover:text-slate-100 transition-all border border-outline-variant/10"
        >
          <Play className="w-3 h-3" />
          View Tutorial
        </button>
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
              {[
                { name: 'LeetCode', color: 'bg-orange-500', url: 'https://leetcode.com' },
                { name: 'Codeforces', color: 'bg-blue-500', url: 'https://codeforces.com' },
                { name: 'CodeChef', color: 'bg-emerald-500', url: 'https://codechef.com' },
                { name: 'HackerRank', color: 'bg-green-600', url: 'https://hackerrank.com' }
              ].map((platform) => {
                const [connected, setConnected] = React.useState(platform.name !== 'HackerRank');
                return (
                  <div key={platform.name} className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(platform.url, "_blank")}
                    >
                      <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white bg-opacity-10", platform.color)}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-300">{platform.name}</span>
                    </div>
                    {connected ? (
                      <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-widest">Connected</span>
                    ) : (
                      <button 
                        onClick={() => setConnected(true)}
                        className="text-[10px] text-slate-500 hover:text-primary font-mono font-bold uppercase tracking-widest transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
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
