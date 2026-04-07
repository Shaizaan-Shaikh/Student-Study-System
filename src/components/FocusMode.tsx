import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Timer, 
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '../lib/utils';

type TimerMode = 'focus' | 'break';

export const FocusMode: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    
    if (mode === 'focus') {
      setMode('break');
      setTimeLeft(5 * 60);
      setSessionsCompleted(prev => prev + 1);
      if (!isMuted) playNotification();
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
      if (!isMuted) playNotification();
    }
  };

  const playNotification = () => {
    // Simulated sound notification
    console.log("Timer complete!");
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Focus Mode</h1>
        <p className="text-slate-500 text-sm">Deep work session with Pomodoro technique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timer Card */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-3xl border border-outline-variant/10 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Glow */}
          <div className={cn(
            "absolute inset-0 opacity-5 transition-colors duration-1000",
            mode === 'focus' ? "bg-primary" : "bg-secondary"
          )} />

          <div className="relative z-10 flex flex-col items-center">
            {/* Mode Indicator */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 transition-colors duration-500",
              mode === 'focus' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
            )}>
              {mode === 'focus' ? <Brain className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
              {mode === 'focus' ? 'Focus Session' : 'Break Time'}
            </div>

            {/* Circular Progress */}
            <div className="relative w-64 h-64 mb-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-surface-container-highest"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 120}
                  initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 120) * (1 - progress / 100) }}
                  transition={{ duration: 1, ease: "linear" }}
                  className={mode === 'focus' ? "text-primary" : "text-secondary"}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-mono font-bold text-slate-100 tracking-tighter">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase mt-2">
                  {mode === 'focus' ? 'Stay Focused' : 'Relax'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button 
                onClick={resetTimer}
                className="p-4 bg-surface-container-highest text-slate-300 rounded-full hover:bg-surface-container-highest/80 transition-all hover:scale-110 active:scale-95"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <button 
                onClick={toggleTimer}
                className={cn(
                  "p-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95",
                  mode === 'focus' ? "bg-primary text-on-primary shadow-primary/20" : "bg-secondary text-on-secondary shadow-secondary/20"
                )}
              >
                {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-4 bg-surface-container-highest text-slate-300 rounded-full hover:bg-surface-container-highest/80 transition-all hover:scale-110 active:scale-95"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* AI Recommendation */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Focus Insight</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              "Based on your recent activity in <span className="text-primary font-bold">DSA Fundamentals</span>, a 25-minute deep focus session is recommended to master the current module."
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Today's Progress</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{sessionsCompleted}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Sessions Done</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{sessionsCompleted * 25}m</p>
                    <p className="text-[10px] text-slate-500 uppercase">Focus Time</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Goal</span>
                  <span className="text-[10px] font-mono text-primary">{Math.min(100, Math.round((sessionsCompleted / 8) * 100))}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (sessionsCompleted / 8) * 100)}%` }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic">Goal: 8 sessions (4 hours)</p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Focus Tips</h3>
            <ul className="space-y-3">
              {[
                "Close all unnecessary browser tabs",
                "Keep your phone in another room",
                "Have a glass of water nearby",
                "Take the 5-min break away from screens"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
