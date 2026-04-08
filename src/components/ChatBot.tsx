import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  onNavigate: (view: string) => void;
}

const SYSTEM_INSTRUCTION = `You are the CodeTrack AI Assistant. 
Your primary goals are:
1. Help users with study-related questions (Learning guidance, App navigation, Feature explanations).
2. Guide users through the CodeTrack website.

SCOPE LIMITATION:
- ONLY answer about learning, study guidance, and site navigation.
- DO NOT solve coding problems.
- DO NOT give problem-specific hints.
- DO NOT explain DSA questions directly.

REDIRECT LOGIC:
- If a user asks for coding help, a specific problem hint, or a DSA explanation, respond: "Please use the Problem Assistant in the Problems section for coding help."

NAVIGATION CAPABILITY:
- You can trigger navigation to different pages. 
- If a user wants to see a specific page, include the command [NAVIGATE:view_id] at the end of your response.
- Available view_ids: dashboard, learning-path, problems, leaderboard, notes, goals, profile.

TONE:
- Friendly, helpful, short, and clear.`;

export const ChatBot: React.FC<ChatBotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your CodeTrack AI. How can I help you with your learning journey today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    history.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await chatWithGemini(history, SYSTEM_INSTRUCTION);
    
    // Check for navigation command
    const navMatch = response.match(/\[NAVIGATE:(\w+-\w+|\w+)\]/);
    if (navMatch) {
      const viewId = navMatch[1];
      onNavigate(viewId);
    }

    // Clean response from commands for display
    const cleanResponse = response.replace(/\[NAVIGATE:(\w+-\w+|\w+)\]/, '').trim();

    setMessages(prev => [...prev, { role: 'model', text: cleanResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className={cn(
              "bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
              isMinimized 
                ? "h-16 w-64" 
                : "h-[500px] max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] sm:w-[380px]"
            )}
          >
            {/* Header */}
            <div className="bg-surface-container-highest px-4 py-3 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">CodeTrack AI</p>
                  {!isMinimized && <p className="text-[10px] text-secondary font-mono">Online</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-outline-variant/20"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                        m.role === 'user' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                      )}>
                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        m.role === 'user' 
                          ? "bg-secondary text-on-secondary rounded-tr-none" 
                          : "bg-surface-container-highest text-slate-200 rounded-tl-none"
                      )}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about learning, navigation, or features..."
                      className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-lg disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
