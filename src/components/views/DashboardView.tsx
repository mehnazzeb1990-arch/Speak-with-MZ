import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Flame, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Crown,
  Zap,
  Star
} from 'lucide-react';
import { SPEAKING_SCENARIOS, AI_PERSONAS } from '../../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div id="dashboard-view-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-700 p-8 lg:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
                {user.level} Level
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-400 text-slate-950 flex items-center space-x-1 shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                <span className="capitalize">{user.subscriptionPlan.replace('_', ' ')}</span>
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Good Morning, {user.name.split(' ')[0]} 👋
            </h1>
            
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
              You're on a <strong className="text-sky-300 font-bold">{user.currentStreak} day streak</strong>. Keep up daily practice with your AI speaking partner!
            </p>
          </div>

          <button
            id="dashboard-start-speaking-now"
            onClick={() => onNavigate('speaking')}
            className="px-6 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 shrink-0"
          >
            <Play className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <span>Start Speaking Now</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Streak Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Streak</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60">
              <Flame className="w-5 h-5 fill-indigo-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.currentStreak} Days</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Daily target: {user.dailyGoalMinutes} mins</p>
        </div>

        {/* Minutes Practiced */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sky-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Practiced</span>
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60">
              <Clock className="w-5 h-5 text-sky-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.totalMinutesPracticed} mins</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total conversation time</p>
        </div>

        {/* Conversations Completed */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-cyan-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sessions</span>
            <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.conversationsCompleted}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Completed scenarios</p>
        </div>

        {/* Vocabulary Saved */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vocabulary</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.vocabularyLearned} Words</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Saved in Vault</p>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Recommended Scenarios & Weekly Progress */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recommended Practice Scenarios */}
          <div className="space-y-4">
            
            {/* 400 Topics Curriculum Card Banner */}
            <div 
              onClick={() => onNavigate('curriculum')}
              className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-indigo-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-xs font-bold border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>COMPLETE LEARNING CONTENT</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight group-hover:text-sky-300 transition-colors">
                  400 Structured English Topics Catalog
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Explore 200 Beginner (Free), 100 Intermediate (Premium), and 100 Advanced (Premium) lessons with picture descriptions, vocabulary, idioms, mini-games, debates, and presentation practice!
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-2xl bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center space-x-2 shadow-md">
                <span>Browse Topics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Scenarios for You</h2>
              <button 
                onClick={() => onNavigate('speaking')}
                className="text-xs font-bold text-indigo-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPEAKING_SCENARIOS.slice(0, 4).map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => onNavigate('speaking')}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300 border border-indigo-100 dark:border-indigo-900/40">
                      {scen.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{scen.difficulty}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                      {scen.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {scen.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-indigo-600 dark:text-sky-400 font-bold">
                    <span>Start Practice</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Practice Bar Visualizer */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Weekly Practice Minutes</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: 15 mins daily</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                +18% vs Last Week
              </span>
            </div>

            {/* Simulated Days Bar Chart */}
            <div className="flex items-end justify-between h-40 pt-4 px-2">
              {[
                { day: 'Mon', mins: 15 },
                { day: 'Tue', mins: 20 },
                { day: 'Wed', mins: 10 },
                { day: 'Thu', mins: 25 },
                { day: 'Fri', mins: 15 },
                { day: 'Sat', mins: 30 },
                { day: 'Sun', mins: 22 },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 flex-1">
                  <span className="text-[10px] font-bold text-slate-400">{item.mins}m</span>
                  <div
                    className="w-8 rounded-xl bg-gradient-to-t from-indigo-600 to-sky-500 transition-all duration-500"
                    style={{ height: `${(item.mins / 30) * 100}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: AI Partner Status & Daily Tip */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active AI Partner Box */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Your Lead AI Partner</h3>
            
            <div className="flex items-center space-x-4">
              <img
                src={AI_PERSONAS[0].avatarUrl}
                alt={AI_PERSONAS[0].name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{AI_PERSONAS[0].name}</h4>
                <p className="text-xs text-indigo-600 dark:text-sky-400 font-medium">{AI_PERSONAS[0].role}</p>
                <p className="text-[11px] text-slate-400">{AI_PERSONAS[0].accent} Accent</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
              "Ready to work on your vocabulary and natural speaking flow today, {user.name.split(' ')[0]}?"
            </p>

            <button
              onClick={() => onNavigate('speaking')}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              Start Conversation
            </button>
          </div>

          {/* Smart Suggestion Lesson */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-700 dark:text-sky-300 uppercase tracking-wider">Smart Suggestion</span>
            </div>
            <h4 className="font-bold text-indigo-950 dark:text-indigo-100 text-sm leading-tight">Mastering Phrasal Verbs in Travel</h4>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed">
              Based on your recent conversation, practice essential phrasal verbs like 'get on', 'take off', and 'check in'.
            </p>
            <button 
              onClick={() => onNavigate('speaking')}
              className="w-full py-2.5 bg-white dark:bg-slate-800 text-indigo-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100/60 transition-colors"
            >
              View Recommended Practice
            </button>
          </div>

          {/* AI Tip of the Day */}
          <div className="rounded-3xl bg-gradient-to-tr from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-200/80 dark:border-sky-800/60 p-6 space-y-3">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Fluency Tip of the Day</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Embrace Filler Words Naturally</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Native speakers frequently use transition phrases like "Well, as a matter of fact..." or "To be honest..." to gather their thoughts without losing flow.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
