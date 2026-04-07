import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type TimerMode = 'focus' | 'break';

interface FocusContextType {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  sessionsCompleted: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('focus_timer_state');
    if (saved) {
      try {
        const { timeLeft: savedTime, isActive: savedActive, mode: savedMode, sessions: savedSessions, lastUpdate } = JSON.parse(saved);
        const now = Date.now();
        const elapsed = Math.floor((now - lastUpdate) / 1000);
        
        if (savedActive) {
          const newTime = Math.max(0, savedTime - elapsed);
          if (newTime === 0) {
            if (savedMode === 'focus') {
              setMode('break');
              setTimeLeft(5 * 60);
              setSessionsCompleted(savedSessions + 1);
            } else {
              setMode('focus');
              setTimeLeft(25 * 60);
              setSessionsCompleted(savedSessions);
            }
            setIsActive(false);
          } else {
            setTimeLeft(newTime);
            setIsActive(true);
            setMode(savedMode);
            setSessionsCompleted(savedSessions);
          }
        } else {
          setTimeLeft(savedTime);
          setMode(savedMode);
          setSessionsCompleted(savedSessions);
          setIsActive(false);
        }
      } catch (e) {
        console.error("Failed to parse timer state", e);
      }
    }
  }, []);

  // Save state to localStorage on every update
  useEffect(() => {
    const state = {
      timeLeft,
      isActive,
      mode,
      sessions: sessionsCompleted,
      lastUpdate: Date.now()
    };
    localStorage.setItem('focus_timer_state', JSON.stringify(state));
  }, [timeLeft, isActive, mode, sessionsCompleted]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
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
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
    
    // Play notification (simulated)
    console.log("Timer complete!");
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(25 * 60);
  };

  return (
    <FocusContext.Provider value={{ mode, timeLeft, isActive, sessionsCompleted, toggleTimer, resetTimer, setMode }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
