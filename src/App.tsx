import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { PlatformCard } from './components/PlatformCard';
import { PerformanceChart } from './components/PerformanceChart';
import { InsightsSection } from './components/InsightsSection';
import { Leaderboard } from './components/Leaderboard';
import { GoalsSection } from './components/GoalsSection';
import { TopicItem } from './components/TopicItem';
import { SheetCard } from './components/SheetCard';
import { Badge } from './components/Badge';
import { ComparisonView } from './components/ComparisonView';
import { ProblemList } from './components/ProblemList';
import { NotesView } from './components/NotesView';
import { ProfileView } from './components/ProfileView';
import { ChatBot } from './components/ChatBot';
import { CareerGuidanceAI } from './components/CareerGuidanceAI';
import { FriendsView } from './components/FriendsView';
import { ProblemDetailView } from './components/ProblemDetailView';
import { LearningPathView } from './components/LearningPathView';
import { FocusMode } from './components/FocusMode';
import { MockInterview } from './components/MockInterview';
import { WeeklyChallenges } from './components/WeeklyChallenges';
import { OnboardingGuide } from './components/OnboardingGuide';
import { Login } from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from './context/FirebaseContext';
import { LayoutDashboard, GraduationCap, Code2, Trophy, FileEdit, Target, User as UserIcon, Search, Zap, Users } from 'lucide-react';
import { cn } from './lib/utils';

type View = 'dashboard' | 'learning-path' | 'problems' | 'problem-detail' | 'friends' | 'leaderboard' | 'notes' | 'goals' | 'profile' | 'compare' | 'focus' | 'interview';

export default function App() {
  const { user, loading: authLoading } = useFirebase();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [backendData, setBackendData] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('onboarding_visited');
    if (!visited && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_visited', 'true');
    setShowOnboarding(false);
  };

  const replayTutorial = () => {
    setShowOnboarding(true);
    setCurrentView('dashboard');
  };

  const fetchData = async () => {
    if (!user) return;
    try {
      const [dashRes, probRes, noteRes, studRes] = await Promise.all([
        fetch(`/api/dashboard/${user.id}`),
        fetch('/api/problems'),
        fetch(`/api/notes/${user.id}`),
        fetch('/api/students')
      ]);
      
      const [dash, prob, note, stud] = await Promise.all([
        dashRes.json(),
        probRes.json(),
        noteRes.json(),
        studRes.json()
      ]);

      setBackendData(dash.data);
      setProblems(prob.data || prob);
      setNotes(note.data || note);
      setStudents(stud.data || stud);
    } catch (err) {
      console.error("Failed to fetch backend data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const refreshData = () => fetchData();

  const handleCompare = async (otherUserId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/friends/compare/${user.id}/${otherUserId}`);
      const response = await res.json();
      setComparisonData(response.data);
      setCurrentView('compare');
    } catch (err) {
      console.error("Comparison failed", err);
    }
  };

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    setCurrentView('problem-detail');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-headline font-bold animate-pulse tracking-widest">INITIALIZING CODE-TRACK...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-headline font-bold animate-pulse tracking-widest">LOADING ARCHITECT DATA...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm">Track your competitive programming journey</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Problems" 
          value={backendData?.student?.total_points || "847"} 
          trend="+12 this week" 
          trendType="positive" 
        />
        <StatCard 
          label="Current Streak" 
          value={`${backendData?.student?.streak_days || "23"} days`} 
          isStreak 
          subText="Top 2%" 
        />
        <StatCard 
          label="Level" 
          value={backendData?.student?.level >= 80 ? "Expert" : "Novice"} 
          trend="Architect" 
          trendType="neutral" 
        />
        <StatCard 
          label="Longest Streak" 
          value={`${backendData?.student?.longest_streak || "45"} days`} 
          trend="Personal Best" 
          trendType="positive" 
        />
      </div>

      {/* Badges Section */}
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-4 h-4 text-tertiary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Badges</h3>
          <span className="text-[10px] text-slate-500 ml-auto">3 of 6 earned</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <Badge icon="flame" label="7-Day Streak" active />
          <Badge icon="hundred" label="Century Club" active />
          <Badge icon="gem" label="Hard Hitter" active />
          <Badge icon="trophy" label="Contest King" />
          <Badge icon="zap" label="30-Day Streak" />
          <Badge icon="target" label="500 Club" />
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlatformCard stats={{
          name: 'LeetCode',
          solved: 423,
          total: 2400,
          color: 'bg-orange-500',
          difficultyBreakdown: { easy: 180, medium: 195, hard: 48 }
        }} />
        <PlatformCard stats={{
          name: 'Codeforces',
          solved: 312,
          total: 1000,
          rating: 1756,
          maxRating: 1823,
          color: 'bg-blue-500'
        }} />
        <PlatformCard stats={{
          name: 'CodeChef',
          solved: 112,
          total: 500,
          rank: '2,012',
          color: 'bg-emerald-500'
        }} />
      </div>

      <InsightsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <GoalsSection />
        </div>
        <div className="lg:col-span-2">
          <WeeklyChallenges />
        </div>
      </div>

      <PerformanceChart />
    </motion.div>
  );

  const renderLeaderboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-slate-100">Leaderboard</h1>
        <p className="text-slate-500 text-sm">Global rankings and competitive comparisons</p>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/5">
          <h2 className="text-xl font-headline font-bold text-slate-200">Global Rankings</h2>
        </div>
        <div className="divide-y divide-outline-variant/5">
          {students.map((s, index) => (
            <div key={s.id} className="px-8 py-4 flex items-center justify-between hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-4">
                <span className={cn("font-mono font-bold w-4", index === 0 ? "text-primary" : "text-slate-500")}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <img src={s.avatar} className="w-10 h-10 rounded-full border border-primary/20" alt={s.name} />
                <span className="font-headline font-medium text-slate-200">{s.name}</span>
                {s.id === user?.id && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">You</span>}
              </div>
              <div className="flex items-center gap-4">
                {s.id !== user?.id && (
                  <button 
                    onClick={() => handleCompare(s.id)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                  >
                    <Users className="w-3 h-3" />
                    Compare
                  </button>
                )}
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-slate-500 uppercase">Points</p>
                  <p className="font-mono text-sm text-secondary font-bold">{s.total_points || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-primary selection:text-on-primary">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="lg:pl-64 pt-20 pb-12 transition-all duration-300">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'dashboard' && renderDashboard()}
              {currentView === 'learning-path' && <LearningPathView />}
              {currentView === 'problems' && <ProblemList problems={problems} onSelect={handleSelectProblem} />}
              {currentView === 'problem-detail' && <ProblemDetailView problemId={selectedProblemId!} onBack={() => setCurrentView('problems')} onRefresh={refreshData} />}
              {currentView === 'focus' && <FocusMode />}
              {currentView === 'interview' && <MockInterview />}
              {currentView === 'friends' && <FriendsView onCompare={handleCompare} />}
              {currentView === 'leaderboard' && renderLeaderboard()}
              {currentView === 'notes' && <NotesView notes={notes} />}
              {currentView === 'goals' && <GoalsSection />}
              {currentView === 'profile' && <ProfileView student={backendData?.student} onReplayTutorial={replayTutorial} />}
              {currentView === 'compare' && <ComparisonView data={comparisonData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {showOnboarding && (
        <OnboardingGuide 
          onComplete={handleOnboardingComplete} 
          onNavigate={(view) => setCurrentView(view as View)} 
        />
      )}

      {/* Floating ChatBot */}
      <ChatBot onNavigate={(view) => setCurrentView(view as View)} />
    </div>
  );
}
