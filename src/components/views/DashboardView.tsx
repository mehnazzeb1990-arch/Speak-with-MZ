import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Flame, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Crown,
  Star,
  Mic,
  Volume2,
  PenTool,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Target,
  RotateCcw,
  BarChart2,
  FileText,
  Calendar,
  Zap,
  Check,
  ChevronRight,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { SPEAKING_SCENARIOS, AI_PERSONAS } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  sublabel?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 5,
  color = '#0F766E',
  trackColor = '#CBDED9',
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xs font-black text-[#134E4A] leading-none">{percentage}%</span>
        {sublabel && <span className="text-[8px] font-bold text-teal-800/70 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, updateProfile, activeScenario, savedVocabList } = useAuth();
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  if (!user) return null;

  const xpPoints = (user.totalMinutesPracticed || 15) * 50 + (user.conversationsCompleted || 3) * 100;
  const dailyTarget = user.dailyGoalMinutes || 15;
  const todayMinutes = Math.min(dailyTarget, Math.round((user.totalMinutesPracticed || 12) % 30) || 12);
  const goalPercentage = Math.min(100, Math.round((todayMinutes / dailyTarget) * 100));

  const handleSetDailyGoal = (mins: number) => {
    updateProfile({ dailyGoalMinutes: mins });
    setShowGoalSelector(false);
  };

  // Mock recent session logs
  const recentSessions = [
    {
      id: 'sess_1',
      title: 'Job Interview Simulation',
      scenarioCategory: 'Career & Business',
      personaName: 'Coach MZ',
      timestamp: 'Today, 10:15 AM',
      duration: '14 mins',
      score: 94,
      fluency: 92,
      grammar: 90,
      vocab: 96,
    },
    {
      id: 'sess_2',
      title: 'Coffee Shop Small Talk & Greetings',
      scenarioCategory: 'Everyday Conversation',
      personaName: 'Coach MZ',
      timestamp: 'Yesterday, 4:30 PM',
      duration: '10 mins',
      score: 88,
      fluency: 87,
      grammar: 85,
      vocab: 90,
    },
    {
      id: 'sess_3',
      title: 'IELTS Speaking Part 2 Monologue',
      scenarioCategory: 'Academic Exam',
      personaName: 'Coach MZ',
      timestamp: '2 days ago',
      duration: '18 mins',
      score: 91,
      fluency: 90,
      grammar: 88,
      vocab: 94,
    },
  ];

  return (
    <div id="dashboard-view-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#042F2C] via-[#0F766E] to-[#0D9488] p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-[#14B8A6]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img 
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-[#14B8A6]/40 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#14B8A6]/30 text-teal-100 border border-[#14B8A6]/40">
                  {user.level} English Level
                </span>
                <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-[#F59E0B] text-slate-950 flex items-center space-x-1 shadow-sm">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span className="capitalize">{user.subscriptionPlan.replace('_', ' ')}</span>
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-teal-100 text-xs sm:text-sm font-semibold">
                Coach MZ is ready for your daily speaking practice session.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Quick Stats Pill */}
            <div className="flex items-center space-x-3 bg-[#042F2C]/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#14B8A6]/30 text-white shadow-inner">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] animate-bounce" />
                <span className="font-extrabold text-xs sm:text-sm">{user.currentStreak || 7} Day Streak</span>
              </div>
              <div className="w-px h-5 bg-[#14B8A6]/40" />
              <div className="flex items-center space-x-1.5">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span className="font-extrabold text-xs sm:text-sm">{xpPoints} XP</span>
              </div>
            </div>

            <button
              id="dashboard-start-speaking-now"
              onClick={() => onNavigate('speaking')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white hover:opacity-95 font-black rounded-2xl shadow-lg shadow-teal-900/40 transition-all active:scale-95 flex items-center justify-center space-x-2 shrink-0 text-sm cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B] animate-pulse" />
              <span>Start Speaking with Coach MZ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Daily Goal Tracker & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Goal Tracking Widget (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2.5 rounded-xl bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#134E4A]">Daily Speaking Goal</h3>
                <p className="text-xs text-teal-800/70 font-medium">Consistency builds speech fluency</p>
              </div>
            </div>

            <button
              onClick={() => setShowGoalSelector(!showGoalSelector)}
              className="px-3 py-1.5 rounded-xl bg-[#DCEDE9] border border-[#CBDED9] text-[#0F766E] text-xs font-bold hover:bg-teal-200/60 cursor-pointer"
            >
              {dailyTarget}m Goal ⚙️
            </button>
          </div>

          {/* Goal Selector Drawer */}
          {showGoalSelector && (
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2 animate-fade-in">
              <span className="text-[11px] font-bold text-[#134E4A] block">Select Your Daily Target:</span>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetDailyGoal(mins)}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      dailyTarget === mins
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'bg-[#E6F1EF] text-[#134E4A] hover:bg-teal-100'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goal Progress Bar & Visual Indicator */}
          <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-[#134E4A]">{todayMinutes} <span className="text-xs font-bold text-teal-800">/ {dailyTarget} mins</span></div>
                <div className="text-[11px] text-teal-800/80 font-medium">{dailyTarget - todayMinutes > 0 ? `${dailyTarget - todayMinutes} mins left today` : '🎉 Daily goal accomplished!'}</div>
              </div>
              <CircularProgress percentage={goalPercentage} size={54} strokeWidth={5} color="#0F766E" />
            </div>

            <div className="w-full bg-[#CBDED9] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] h-full rounded-full transition-all duration-700" 
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-teal-800/80 font-medium pt-1">
            <span className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <strong className="text-[#134E4A]">{user.currentStreak || 7} Days</strong> Streak
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Target: {dailyTarget}m / day</span>
            </span>
          </div>
        </div>

        {/* Continue Learning Section (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#0F766E] font-extrabold text-xs uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-[#14B8A6]" />
              <span>Active Learning Module</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] font-extrabold text-[10px] uppercase border border-[#CBDED9]">
              In Progress
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#134E4A] leading-tight">
              {activeScenario.title}
            </h2>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              {activeScenario.description}
            </p>
          </div>

          {/* Module Progress & Vocab Chips */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-[#134E4A]">
                <span>Topic Completion</span>
                <span className="text-[#0F766E]">75%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#CBDED9] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] w-[75%] transition-all duration-500" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="font-bold text-teal-800/70 mr-1 self-center">Key Target Vocab:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DCEDE9] text-[#134E4A] font-extrabold border border-[#CBDED9]">Articulate</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DCEDE9] text-[#134E4A] font-extrabold border border-[#CBDED9]">Persuasive</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DCEDE9] text-[#134E4A] font-extrabold border border-[#CBDED9]">Coherent</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-extrabold text-[#0F766E] hover:underline"
            >
              Browse 400 Topics →
            </button>

            <button
              onClick={() => onNavigate('speaking')}
              className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md shadow-teal-700/20 hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Resume Practice</span>
            </button>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Progress Summary (4 Skills Overview Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#134E4A] flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#0F766E]" />
            <span>Progress Summary & Skill Evaluation</span>
          </h3>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-extrabold text-[#0F766E] hover:underline flex items-center space-x-1"
          >
            <span>Detailed Analytics Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Fluency */}
          <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <Mic className="w-6 h-6" />
              </div>
              <CircularProgress percentage={88} size={54} strokeWidth={5} color="#0F766E" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">🎤 Fluency</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Continuous speech flow & natural speed</p>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-xl text-center">
              Band 7.5 • Good Flow
            </div>
          </div>

          {/* Vocabulary */}
          <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <BookOpen className="w-6 h-6" />
              </div>
              <CircularProgress percentage={92} size={54} strokeWidth={5} color="#14B8A6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">📚 Vocabulary</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">{savedVocabList.length} words saved in Vault</p>
            </div>
            <div className="text-[11px] font-bold text-teal-800 bg-[#DCEDE9] px-2.5 py-1 rounded-xl text-center">
              Level C1 • Advanced Words
            </div>
          </div>

          {/* Pronunciation */}
          <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <Volume2 className="w-6 h-6" />
              </div>
              <CircularProgress percentage={84} size={54} strokeWidth={5} color="#0F766E" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">🗣 Pronunciation</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Intonation, word stress & phonetic clarity</p>
            </div>
            <div className="text-[11px] font-bold text-teal-800 bg-[#DCEDE9] px-2.5 py-1 rounded-xl text-center">
              Clear Articulation
            </div>
          </div>

          {/* Grammar */}
          <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <PenTool className="w-6 h-6" />
              </div>
              <CircularProgress percentage={90} size={54} strokeWidth={5} color="#14B8A6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">✍ Grammar</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Tense accuracy & sentence structure</p>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-xl text-center">
              High Accuracy (90%)
            </div>
          </div>

        </div>
      </div>

      {/* Grid Row 3: Recent Sessions Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Sessions List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#134E4A] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#0F766E]" />
              <span>Recent Speaking Sessions</span>
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-extrabold text-[#0F766E] hover:underline"
            >
              View Full History →
            </button>
          </div>

          <div className="space-y-3">
            {recentSessions.map((sess) => (
              <div
                key={sess.id}
                className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                        {sess.scenarioCategory}
                      </span>
                      <span className="text-xs text-teal-800/70 font-medium">{sess.timestamp}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#134E4A]">{sess.title}</h4>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-[#0F766E]">{sess.score}% <span className="text-xs font-bold text-teal-800">Score</span></div>
                      <div className="text-[10px] text-teal-800/70 font-medium">{sess.duration}</div>
                    </div>
                    <button
                      onClick={() => onNavigate('speaking')}
                      className="px-4 py-2 rounded-xl bg-[#0F766E] text-white font-bold text-xs hover:bg-[#115E59] cursor-pointer shadow-xs"
                    >
                      Report 📊
                    </button>
                  </div>
                </div>

                {/* Score Pills Breakdown */}
                <div className="flex items-center space-x-4 pt-2 border-t border-[#CBDED9] text-xs font-semibold text-teal-900/80">
                  <span>Fluency: <strong className="text-[#134E4A]">{sess.fluency}%</strong></span>
                  <span>Grammar: <strong className="text-[#134E4A]">{sess.grammar}%</strong></span>
                  <span>Vocab: <strong className="text-[#134E4A]">{sess.vocab}%</strong></span>
                  <span>Partner: <strong className="text-[#0F766E]">{sess.personaName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Recommended Scenarios & Tip of the Day (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Scenario Start Box */}
          <div className="rounded-3xl bg-[#042F2C] text-white p-6 border border-[#14B8A6]/30 shadow-xl space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#14B8A6] tracking-wider">Quick Launch</span>
              <h3 className="text-lg font-black text-white">Recommended Roleplays</h3>
            </div>

            <div className="space-y-2 text-xs">
              {SPEAKING_SCENARIOS.slice(0, 3).map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => onNavigate('speaking')}
                  className="p-3 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 hover:bg-[#0F766E] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-extrabold text-white text-xs">{scen.title}</div>
                    <div className="text-[10px] text-teal-200">{scen.category}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('speaking')}
              className="w-full py-3 rounded-2xl bg-[#14B8A6] hover:bg-[#0D9488] text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Mic className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Launch Speaking Studio</span>
            </button>
          </div>

          {/* AI Tip of the Day */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-6 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-[#0F766E] font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Fluency Tip of the Day</span>
            </div>
            <h4 className="font-extrabold text-sm text-[#134E4A]">Use the PREP Response Framework</h4>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              When answering interview questions or Part 2 IELTS topics, follow: <strong>Point</strong> → <strong>Reason</strong> → <strong>Example</strong> → <strong>Point</strong>. This organizes your thoughts without pauses!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
