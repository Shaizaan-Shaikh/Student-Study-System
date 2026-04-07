import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Trophy, 
  Target, 
  Brain, 
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../context/FirebaseContext';

type Phase = 'entry' | 'test' | 'result' | 'interview';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface Message {
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

const SKILL_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1
  },
  {
    id: 2,
    text: "Which hook is used to handle side effects in React?",
    options: ["useState", "useContext", "useEffect", "useMemo"],
    correct: 2
  },
  {
    id: 3,
    text: "What is a closure in JavaScript?",
    options: [
      "A way to close the browser tab",
      "A function combined with its lexical environment",
      "A method to end a loop",
      "A private variable declaration"
    ],
    correct: 1
  },
  {
    id: 4,
    text: "In CSS, what does 'flex-grow: 1' do?",
    options: [
      "Makes the item grow to fill available space",
      "Increases font size by 1px",
      "Adds 1px margin",
      "Makes the item invisible"
    ],
    correct: 0
  },
  {
    id: 5,
    text: "What is the primary purpose of a Redux store?",
    options: [
      "To store local component state",
      "To manage global application state",
      "To handle HTTP requests",
      "To style the application"
    ],
    correct: 1
  }
];

const INTERVIEW_QUESTIONS = [
  "Can you explain the difference between 'let', 'const', and 'var' in JavaScript?",
  "How does the Virtual DOM work in React?",
  "What are the advantages of using TypeScript over plain JavaScript?",
  "Explain the concept of 'hoisting' in JavaScript.",
  "How would you optimize a slow React application?",
  "What is the difference between a shallow copy and a deep copy?",
  "Explain the 'this' keyword in JavaScript."
];

export const MockInterview: React.FC = () => {
  const { user } = useFirebase();
  const [phase, setPhase] = useState<Phase>('entry');
  const [testIndex, setTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interviewIndex, setInterviewIndex] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startTest = () => {
    setPhase('test');
    setTestIndex(0);
    setScore(0);
  };

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === SKILL_TEST_QUESTIONS[testIndex].correct) {
      setScore(prev => prev + 1);
    }

    if (testIndex < SKILL_TEST_QUESTIONS.length - 1) {
      setTestIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const percentage = (score / SKILL_TEST_QUESTIONS.length) * 100;
    let detectedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    
    if (percentage <= 40) detectedLevel = 'Beginner';
    else if (percentage <= 70) detectedLevel = 'Intermediate';
    else detectedLevel = 'Advanced';

    setLevel(detectedLevel);
    setPhase('result');
  };

  const startInterview = () => {
    setPhase('interview');
    setMessages([
      {
        role: 'ai',
        content: `Hello ${user?.name || 'Candidate'}! I'm your AI Interviewer. Based on your ${level} level, I've prepared some technical questions. Let's begin.`,
        timestamp: new Date()
      },
      {
        role: 'ai',
        content: INTERVIEW_QUESTIONS[0],
        timestamp: new Date()
      }
    ]);
    setInterviewIndex(0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Feedback
    setTimeout(() => {
      const feedback = getSimulatedFeedback(input, INTERVIEW_QUESTIONS[interviewIndex]);
      const nextIndex = interviewIndex + 1;
      
      const aiMessages: Message[] = [
        {
          role: 'ai',
          content: feedback,
          timestamp: new Date()
        }
      ];

      if (nextIndex < INTERVIEW_QUESTIONS.length) {
        aiMessages.push({
          role: 'ai',
          content: INTERVIEW_QUESTIONS[nextIndex],
          timestamp: new Date()
        });
        setInterviewIndex(nextIndex);
      } else {
        aiMessages.push({
          role: 'ai',
          content: "That concludes our mock interview! You've shown good understanding. Keep practicing these concepts to sharpen your skills.",
          timestamp: new Date()
        });
      }

      setMessages(prev => [...prev, ...aiMessages]);
      setIsTyping(false);
    }, 1500);
  };

  const getSimulatedFeedback = (answer: string, question: string) => {
    if (answer.length < 20) return "That's a bit brief. Try to provide more technical details and perhaps an example to demonstrate your depth of knowledge.";
    if (answer.toLowerCase().includes('don\'t know') || answer.toLowerCase().includes('not sure')) return "It's okay not to know everything. In a real interview, try to explain what you *do* know about related concepts or how you would find the answer.";
    return "Good explanation! You covered the core concepts well. To make it even better, you could mention specific use cases or performance implications.";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Mock Interview</h1>
        <p className="text-slate-500 text-sm">Test your skills and practice technical interviews</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'entry' && (
          <motion.div 
            key="entry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-12 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <Brain className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-headline font-bold text-slate-100">Ready to level up?</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Start with a quick 5-question skill assessment to determine your current level and get personalized interview questions.
              </p>
            </div>
            <button 
              onClick={startTest}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              Start Skill Test
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div 
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-8 space-y-8"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Question {testIndex + 1} of {SKILL_TEST_QUESTIONS.length}</span>
              <div className="h-1 w-32 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${((testIndex + 1) / SKILL_TEST_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-headline font-bold text-slate-100">
              {SKILL_TEST_QUESTIONS[testIndex].text}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {SKILL_TEST_QUESTIONS[testIndex].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left p-4 rounded-xl border border-outline-variant/10 bg-surface-container-highest/30 hover:bg-primary/10 hover:border-primary/30 transition-all group flex items-center justify-between"
                >
                  <span className="text-sm text-slate-300 group-hover:text-slate-100">{option}</span>
                  <div className="w-5 h-5 rounded-full border border-outline-variant/20 group-hover:border-primary/50" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-12 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assessment Complete</p>
              <h2 className="text-3xl font-headline font-bold text-slate-100">
                You are at <span className="text-secondary">{level} Level</span>
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Great job! Your score indicates a solid foundation. We've tailored the mock interview to challenge you at this level.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={startInterview}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Start Mock Interview
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={startTest}
                className="w-full sm:w-auto px-8 py-3 bg-surface-container-highest text-slate-300 rounded-full font-bold uppercase tracking-widest hover:bg-surface-container-highest/80 transition-all flex items-center justify-center gap-2"
              >
                Retake Test
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'interview' && (
          <motion.div 
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-[600px] bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">AI Interviewer</p>
                  <p className="text-[10px] text-primary font-mono uppercase">Technical Round • {level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Live Session</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'ai' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  )}>
                    {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'ai' 
                      ? "bg-surface-container-highest text-slate-200 rounded-tl-none" 
                      : "bg-primary text-on-primary rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-highest p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-surface-container border-t border-outline-variant/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 pr-12 text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                Press Enter to send your answer. The AI will provide feedback after each response.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
