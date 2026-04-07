import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, BookOpen, Target, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const SYSTEM_INSTRUCTION = `You are a Career Guidance AI for CodeTrack. 
Your task is to provide a detailed, step-by-step roadmap for a specific tech domain requested by the user.

STRUCTURE YOUR RESPONSE:
1. Domain Overview (What is it?)
2. Core Skills (What to learn first?)
3. Tools & Frameworks
4. Project Ideas (Practical application)
5. Career Outlook (Job roles, salary expectations)

TONE:
- Professional, insightful, and structured.
- Use Markdown for formatting (bolding, lists, headers).`;

export const CareerGuidanceAI: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!domain.trim() || isLoading) return;
    
    setIsLoading(true);
    const prompt = `Generate a comprehensive career roadmap for the domain: ${domain}`;
    const response = await getGeminiResponse(prompt, SYSTEM_INSTRUCTION);
    setRoadmap(response);
    setIsLoading(false);
  };

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 border-b border-outline-variant/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-slate-100">Career Guidance AI</h2>
        </div>
        <p className="text-slate-400 text-sm max-w-2xl">
          Not sure where to start? Tell me your target domain (e.g., Full Stack Dev, AI/ML, DevOps, Cyber Security) and I'll build a custom roadmap for you.
        </p>
      </div>

      <div className="p-8">
        {!roadmap ? (
          <div className="max-w-xl mx-auto space-y-6 py-8">
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                placeholder="Enter a domain (e.g. Data Scientist, Mobile Dev)..."
                className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl pl-6 pr-16 py-4 text-slate-200 focus:outline-none focus:border-primary transition-all text-lg"
              />
              <button
                onClick={generateRoadmap}
                disabled={!domain.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-on-primary rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {['Frontend', 'Backend', 'Data Science', 'DevOps', 'Cybersecurity'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setDomain(tag)}
                  className="px-4 py-1.5 bg-surface-container-highest/50 text-slate-400 rounded-full text-xs hover:text-primary hover:bg-primary/10 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <Target className="w-5 h-5" />
                Roadmap for {domain}
              </h3>
              <button 
                onClick={() => { setRoadmap(null); setDomain(''); }}
                className="text-xs text-slate-500 hover:text-slate-200 font-bold uppercase tracking-widest"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 prose prose-invert prose-slate max-w-none bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/10">
                <ReactMarkdown>{roadmap}</ReactMarkdown>
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-xl">
                  <h4 className="text-secondary font-headline font-bold flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4" />
                    Quick Start
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-secondary flex-shrink-0" /> Master the basics of CS</li>
                    <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-secondary flex-shrink-0" /> Build 3 core projects</li>
                    <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-secondary flex-shrink-0" /> Start networking</li>
                  </ul>
                </div>

                <div className="bg-tertiary/5 border border-tertiary/20 p-6 rounded-xl">
                  <h4 className="text-tertiary font-headline font-bold flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4" />
                    Job Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Junior', 'Mid-Level', 'Senior', 'Lead'].map(role => (
                      <span key={role} className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
