import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  LayoutDashboard, 
  GraduationCap, 
  Target, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  targetId: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'step1',
    title: 'Welcome to Observatory',
    description: 'Your command center for mastering software engineering. Let\'s take a quick tour of your new workspace.',
    icon: Sparkles,
    targetId: 'dashboard'
  },
  {
    id: 'step2',
    title: 'Master Your Progress',
    description: 'Track your coding streaks, points, and global rank here. See your growth across all platforms in one view.',
    icon: LayoutDashboard,
    targetId: 'dashboard'
  },
  {
    id: 'step3',
    title: 'Personalized Roadmaps',
    description: 'Follow structured learning paths tailored to your skill level. From Web Dev to advanced DSA.',
    icon: GraduationCap,
    targetId: 'learning-path'
  },
  {
    id: 'step4',
    title: 'Identify Weak Spots',
    description: 'Our AI analyzes your performance to highlight topics that need more focus. Turn weaknesses into strengths.',
    icon: Target,
    targetId: 'insights'
  },
  {
    id: 'step5',
    title: 'Mock Interviews',
    description: 'Practice with our AI interviewer to sharpen your technical communication and problem-solving skills.',
    icon: MessageSquare,
    targetId: 'interview'
  }
];

interface OnboardingGuideProps {
  onComplete: () => void;
  onNavigate: (view: string) => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Navigate to the relevant view for the next step
      if (STEPS[nextStep].targetId !== 'dashboard' && STEPS[nextStep].targetId !== 'insights') {
        onNavigate(STEPS[nextStep].targetId);
      } else if (STEPS[nextStep].targetId === 'dashboard' || STEPS[nextStep].targetId === 'insights') {
        onNavigate('dashboard');
      }
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onNavigate(STEPS[prevStep].targetId === 'insights' ? 'dashboard' : STEPS[prevStep].targetId);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {/* Overlay without blur */}
          <div className="absolute inset-0 bg-background/20" />
          
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-surface-container-low border border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(var(--primary),0.2)] overflow-hidden relative"
            >
              {/* Arrow Pointer (Simulated) */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-surface-container-low border-t border-l border-primary/30 rotate-45" />

              {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            <button 
              onClick={handleFinish}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold text-slate-100">{step.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-surface-container-highest"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 disabled:opacity-0 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleFinish}
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition-all"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                    {currentStep === STEPS.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  );
};
