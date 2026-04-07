import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Send, HelpCircle, Lightbulb, ChevronRight, CheckCircle2, XCircle, Terminal, Play, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  platform: string;
  tags: string[];
  sample_input: string;
  sample_output: string;
  hints: string[];
}

interface ProblemDetailViewProps {
  problemId: string;
  onBack: () => void;
  onRefresh?: () => void;
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problemId, onBack, onRefresh }) => {
  const { user } = useFirebase();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<'c' | 'cpp' | 'python'>('python');
  const [code, setCode] = useState<string>("# Write your solution here\n\ndef solution():\n    # Your code\n    print('Hello World')");
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [assistantData, setAssistantData] = useState<any>(null);
  const [assistantTab, setAssistantTab] = useState<'hints' | 'approach' | 'complexity' | 'edge-cases'>('hints');
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  const templates = {
    c: '#include <stdio.h>\n\nint main() {\n    // Your code\n    printf("Hello World\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code\n    cout << "Hello World" << endl;\n    return 0;\n}',
    python: '# Write your solution here\n\ndef solution():\n    # Your code\n    print("Hello World")\n\nsolution()'
  };

  useEffect(() => {
    setCode(templates[language]);
  }, [language]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/${problemId}`);
        const data = await res.json();
        if (data.success) setProblem(data.data);
      } catch (err) {
        console.error("Failed to fetch problem", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleRun = async () => {
    if (!user) return;
    setRunning(true);
    try {
      const res = await fetch('/api/problems/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, problem_id: problemId, code, language, input: customInput })
      });
      const data = await res.json();
      setOutput(data.data);
    } catch (err) {
      console.error("Failed to run code", err);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/problems/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, problem_id: problemId, code, language })
      });
      const data = await res.json();
      setOutput(data.data);
      if (data.data.status === 'accepted' && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to submit solution", err);
    } finally {
      setSubmitting(false);
    }
  };

  const askAssistant = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/problems/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, problem_id: problemId, question: 'get_guidance' })
      });
      const data = await res.json();
      if (data.success) {
        setAssistantData(data.data);
      }
    } catch (err) {
      console.error("Failed to ask assistant", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) askAssistant();
  }, [problemId]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">LOADING PROBLEM ARCHITECTURE...</div>;
  if (!problem) return <div className="p-12 text-center text-slate-500 font-mono text-xs">PROBLEM NOT FOUND</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      {/* Left Column: Problem Description */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-xs font-mono text-primary hover:underline flex items-center gap-1">
              <ChevronRight className="w-4 h-4 rotate-180" />
              BACK TO LIST
            </button>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              problem.difficulty === 'easy' ? "bg-green-500/20 text-green-500" :
              problem.difficulty === 'medium' ? "bg-yellow-500/20 text-yellow-500" :
              "bg-red-500/20 text-red-500"
            )}>
              {problem.difficulty}
            </span>
          </div>

          <h1 className="text-3xl font-headline font-bold text-slate-100">{problem.title}</h1>
          
          <div className="flex gap-2">
            {problem.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-mono text-slate-400 uppercase">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">{problem.description}</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-surface-container-highest/30 rounded-lg border border-outline-variant/5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sample Input</h3>
              <pre className="text-xs font-mono text-primary bg-black/20 p-3 rounded">{problem.sample_input}</pre>
            </div>
            <div className="p-4 bg-surface-container-highest/30 rounded-lg border border-outline-variant/5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sample Output</h3>
              <pre className="text-xs font-mono text-secondary bg-black/20 p-3 rounded">{problem.sample_output}</pre>
            </div>
          </div>
        </div>

        {/* AI Assistant Guidance */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col min-h-[400px]">
          <div className="px-6 py-4 border-b border-outline-variant/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">AI Problem Assistant</h3>
            </div>
            {assistantData && (
              <div className="flex gap-1">
                {assistantData.concepts.slice(0, 2).map((c: string) => (
                  <span key={c} className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{c}</span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex border-b border-outline-variant/5">
            {(['hints', 'approach', 'complexity', 'edge-cases'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAssistantTab(tab)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                  assistantTab === tab ? "text-primary border-primary bg-primary/5" : "text-slate-500 border-transparent hover:text-slate-300"
                )}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {!assistantData ? (
              <div className="text-center py-8">
                <Lightbulb className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-mono uppercase">Analyzing problem context...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={assistantTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {assistantTab === 'hints' && (
                    <div className="space-y-4">
                      {assistantData.hints.map((hint: string, i: number) => (
                        <div key={i} className="p-4 bg-surface-container-highest/50 rounded-lg border border-outline-variant/5">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Hint {i + 1}</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{hint}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {assistantTab === 'approach' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-surface-container-highest/50 rounded-lg border border-outline-variant/5">
                        <p className="text-xs text-slate-300 leading-relaxed">{assistantData.approach}</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-outline-variant/5">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Example Walkthrough</span>
                        <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">{assistantData.walkthrough}</pre>
                      </div>
                    </div>
                  )}

                  {assistantTab === 'complexity' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container-highest/50 rounded-lg border border-outline-variant/5 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Time Complexity</span>
                        <span className="text-lg font-mono text-primary font-bold">{assistantData.complexity.time}</span>
                      </div>
                      <div className="p-4 bg-surface-container-highest/50 rounded-lg border border-outline-variant/5 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Space Complexity</span>
                        <span className="text-lg font-mono text-secondary font-bold">{assistantData.complexity.space}</span>
                      </div>
                      <div className="col-span-2 p-4 bg-surface-container-highest/50 rounded-lg border border-outline-variant/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Key Concepts</span>
                        <div className="flex flex-wrap gap-2">
                          {assistantData.concepts.map((c: string) => (
                            <span key={c} className="px-2 py-1 bg-black/20 rounded text-[10px] font-mono text-slate-400 uppercase">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {assistantTab === 'edge-cases' && (
                    <div className="space-y-3">
                      {assistantData.edge_cases.map((ec: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-highest/30 rounded-lg">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{i + 1}</div>
                          <p className="text-xs text-slate-300">{ec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Code Editor & Console */}
      <div className="flex flex-col gap-6">
        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden">
          <div className="px-6 py-3 bg-[#252526] border-b border-outline-variant/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-slate-400">solution.{language === 'python' ? 'py' : language}</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-surface-container-highest border border-outline-variant/10 rounded px-2 py-0.5 text-[10px] font-mono text-slate-300 focus:outline-none"
              >
                <option value="python">Python 3</option>
                <option value="cpp">C++ 17</option>
                <option value="c">C (GCC 11)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-white/5 rounded text-slate-400" title="Save">
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent p-6 font-mono text-sm text-slate-300 focus:outline-none resize-none custom-scrollbar"
            spellCheck="false"
          />

          <div className="px-6 py-3 bg-[#252526] border-t border-outline-variant/5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Custom Input</h3>
            <textarea 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter test input here..."
              className="w-full h-16 bg-black/30 border border-outline-variant/10 rounded p-2 font-mono text-xs text-slate-300 focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="p-4 bg-[#252526] border-t border-outline-variant/5 flex justify-between items-center">
            <div className="flex gap-4">
              <button 
                onClick={handleRun}
                disabled={running || submitting}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                  (running || submitting) ? "opacity-50 cursor-not-allowed" : "hover:text-slate-100"
                )}
              >
                <Play className="w-4 h-4" />
                {running ? "Running..." : "Run Code"}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting || running}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                  (submitting || running) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-hover"
                )}
              >
                {submitting ? "Submitting..." : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>

        {/* Console / Result */}
        <div className="h-48 bg-black rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden">
          <div className="px-6 py-2 bg-surface-container-highest/50 border-b border-outline-variant/5 flex items-center gap-2">
            <Terminal className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Terminal Output</span>
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar bg-black">
            {!output ? (
              <p className="text-slate-600 italic">Run or submit your code to see results...</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  {output.status === 'accepted' || output.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={cn(
                    "font-bold uppercase tracking-widest", 
                    (output.status === 'accepted' || output.status === 'success') ? "text-green-500" : "text-red-500"
                  )}>
                    {output.status.toUpperCase()}
                  </span>
                </div>
                
                <pre className={cn(
                  "p-3 rounded bg-white/5 whitespace-pre-wrap",
                  (output.status === 'accepted' || output.status === 'success') ? "text-green-400" : "text-red-400"
                )}>
                  {output.terminal_output || output.output}
                </pre>

                {output.submitted_at && (
                  <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-slate-500 flex justify-between">
                    <span>Submitted: {new Date(output.submitted_at).toLocaleTimeString()}</span>
                    {output.status === 'accepted' && <span className="text-primary font-bold">Points: +{output.score}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
