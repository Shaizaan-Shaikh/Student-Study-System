import React, { useState } from 'react';
import { FileText, Calendar, Trash2, ExternalLink, Video, FileCode, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'Video' | 'Article';
  domain: 'Web Development' | 'App Development' | 'Game Development';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  link: string;
}

const RECOMMENDED_RESOURCES: Resource[] = [
  { id: 'r1', title: 'HTML & CSS Basics', type: 'Video', domain: 'Web Development', level: 'Beginner', link: '#' },
  { id: 'r2', title: 'JavaScript Fundamentals', type: 'Article', domain: 'Web Development', level: 'Beginner', link: '#' },
  { id: 'r3', title: 'React Crash Course', type: 'Video', domain: 'Web Development', level: 'Intermediate', link: '#' },
  { id: 'r4', title: 'API Integration Guide', type: 'Article', domain: 'Web Development', level: 'Intermediate', link: '#' },
  { id: 'r5', title: 'System Design Basics', type: 'Video', domain: 'Web Development', level: 'Advanced', link: '#' },
  { id: 'r6', title: 'Performance Optimization', type: 'Article', domain: 'Web Development', level: 'Advanced', link: '#' },
  { id: 'r7', title: 'Flutter Basics', type: 'Video', domain: 'App Development', level: 'Beginner', link: '#' },
  { id: 'r8', title: 'State Management', type: 'Article', domain: 'App Development', level: 'Intermediate', link: '#' },
  { id: 'r9', title: 'App Architecture', type: 'Video', domain: 'App Development', level: 'Advanced', link: '#' },
  { id: 'r10', title: 'Unity Basics', type: 'Video', domain: 'Game Development', level: 'Beginner', link: '#' },
  { id: 'r11', title: 'Physics in Games', type: 'Article', domain: 'Game Development', level: 'Intermediate', link: '#' },
  { id: 'r12', title: 'Multiplayer Systems', type: 'Video', domain: 'Game Development', level: 'Advanced', link: '#' },
];

interface NotesViewProps {
  notes: Note[];
}

export const NotesView: React.FC<NotesViewProps> = ({ notes }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredResources = RECOMMENDED_RESOURCES.filter(res => {
    const domainMatch = selectedDomain === 'All' || res.domain === selectedDomain;
    const levelMatch = selectedLevel === 'All' || res.level === selectedLevel;
    return domainMatch && levelMatch;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Notes Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-headline font-bold text-slate-100">Notes</h1>
            <p className="text-slate-500 text-sm">Your personal study notes and algorithm summaries</p>
          </div>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
            New Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <button className="text-slate-600 hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-headline font-bold text-slate-200 mb-2">{note.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-4 mb-4">{note.content}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                <Calendar className="w-3 h-3" />
                {note.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Resources Section */}
      <section className="space-y-8 pt-12 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-headline font-bold text-slate-100">Recommended Resources</h2>
            <p className="text-slate-500 text-sm">Curated learning materials for your journey</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-1.5">
              <Filter className="w-3 h-3 text-slate-500" />
              <select 
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-slate-300 focus:outline-none"
              >
                <option value="All">All Domains</option>
                <option value="Web Development">Web Dev</option>
                <option value="App Development">App Dev</option>
                <option value="Game Development">Game Dev</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-1.5">
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-slate-300 focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredResources.map((res) => (
            <div key={res.id} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  res.type === 'Video' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {res.type === 'Video' ? <Video className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest",
                  res.level === 'Beginner' ? "bg-green-500/10 text-green-500" :
                  res.level === 'Intermediate' ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-red-500/10 text-red-500"
                )}>
                  {res.level}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-primary transition-colors">{res.title}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">{res.domain}</p>
              <a 
                href={res.link}
                className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
              >
                View Resource
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
