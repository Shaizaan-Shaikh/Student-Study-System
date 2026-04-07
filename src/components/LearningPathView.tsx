import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Star, 
  Layout, 
  Code, 
  Gamepad, 
  Smartphone,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';

interface Sheet {
  id: string;
  name: string;
  total_questions: number;
  solved_questions: number;
  percentage: number;
}

interface LearningPath {
  id: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  topics: string[];
  recommended_content_ids: string[];
  recommended_problem_ids: string[];
  completion_percentage: number;
}

export const LearningPathView: React.FC = () => {
  const { user } = useFirebase();
  const [data, setData] = useState<{ sheets: Sheet[], learning_paths: LearningPath[], personalized: LearningPath[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const domains = ['All', 'Web Development', 'App Development', 'Game Development', 'Data Structures & Algorithms'];
  const levels = ['All', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/learning/combined/${user.id}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch learning path data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">LOADING ARCHITECTURAL ROADMAPS...</div>;
  if (!data) return <div className="p-12 text-center text-slate-500 font-mono text-xs">FAILED TO LOAD DATA</div>;

  const filteredPaths = data.learning_paths.filter(path => {
    const domainMatch = selectedDomain === 'All' || path.domain === selectedDomain;
    const levelMatch = selectedLevel === 'All' || path.level === selectedLevel;
    return domainMatch && levelMatch;
  });

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'Web Development': return <Layout className="w-4 h-4" />;
      case 'App Development': return <Smartphone className="w-4 h-4" />;
      case 'Game Development': return <Gamepad className="w-4 h-4" />;
      case 'Data Structures & Algorithms': return <Code className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Learning Paths</h1>
        <p className="text-slate-500 text-sm">Structured roadmaps to master your chosen domain</p>
      </div>

      {/* Sheet Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.sheets.map((sheet) => (
          <div key={sheet.id} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-500">{sheet.percentage}%</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1 truncate">{sheet.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase mb-3">{sheet.solved_questions}/{sheet.total_questions} SOLVED</p>
            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${sheet.percentage}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Personalized Recommendation */}
      {data.personalized.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Star className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Recommended for you</span>
            </div>
            <h2 className="text-2xl font-headline font-bold text-slate-100 mb-2">
              Continue your {data.personalized[0].domain} journey
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mb-6">
              Based on your progress, we recommend focusing on the <span className="text-primary font-bold uppercase">{data.personalized[0].level}</span> track.
            </p>
            <div className="flex flex-wrap gap-3">
              {data.personalized.map(path => (
                <button 
                  key={path.id}
                  className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                >
                  Start {path.title}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Learning Paths Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-headline font-bold text-slate-200 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Explore Paths
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-primary"
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-primary"
            >
              {levels.map(l => <option key={l} value={l}>{l === 'All' ? l : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPaths.map((path) => (
            <motion.div 
              layout
              key={path.id}
              className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden hover:border-primary/20 transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {getDomainIcon(path.domain)}
                    {path.domain}
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono uppercase",
                    path.level === 'beginner' ? "bg-green-500/10 text-green-500" :
                    path.level === 'intermediate' ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-red-500/10 text-red-500"
                  )}>
                    {path.level}
                  </span>
                </div>

                <h3 className="text-lg font-headline font-bold text-slate-100 mb-2 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                  {path.description}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Path Progress</span>
                    <span className="text-xs font-mono text-primary">{path.completion_percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${path.completion_percentage}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-outline-variant/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.topics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-surface-container-highest/50 rounded text-[10px] text-slate-400">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button className="w-full py-4 bg-surface-container-highest/30 hover:bg-primary/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all flex items-center justify-center gap-2">
                View Roadmap
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
