import React from 'react';
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
  Target
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
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
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
  const { user } = useAuth();

  if (!user) return null;

  const xpPoints = (user.totalMinutesPracticed || 15) * 50 + (user.conversationsCompleted || 3) * 100;

  return (
    <div id="dashboard-view-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome & User Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#14B8A6] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-teal-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img 
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {user.level} Level
                </span>
                <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-[#F59E0B] text-slate-950 flex items-center space-x-1 shadow-sm">
                  <Crown className="w-3.5 h-3.5" />
                  <span className="capitalize">{user.subscriptionPlan.replace('_', ' ')}</span>
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                MZ AI Coach
              </h1>
              <p className="text-teal-50 text-sm font-semibold">
                Welcome back, {user.name.split(' ')[0]}! Ready for today's speaking session?
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Quick Stats Pill */}
            <div className="flex items-center space-x-3 bg-black/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-white">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] animate-bounce" />
                <span className="font-extrabold text-sm">{user.currentStreak || 7} Day Streak</span>
              </div>
              <div className="w-px h-5 bg-white/30" />
              <div className="flex items-center space-x-1.5">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span className="font-extrabold text-sm">{xpPoints} XP</span>
              </div>
            </div>

            <button
              id="dashboard-start-speaking-now"
              onClick={() => onNavigate('speaking')}
              className="px-6 py-3.5 bg-white text-[#0F766E] hover:bg-teal-50 font-black rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 shrink-0 text-sm"
            >
              <Play className="w-4 h-4 text-[#0F766E] fill-[#0F766E]" />
              <span>Start Speaking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Continue Learning Banner */}
      <div className="card-ai-luxury p-6 sm:p-7 border border-[#CBDED9] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2 text-[#0F766E] font-extrabold text-xs uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-[#14B8A6]" />
              <span>Continue Learning</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#134E4A]">IELTS Speaking & General Fluency Practice</h2>
              <p className="text-xs text-teal-800/80 font-medium mt-1">
                Topic: Expressing Personal Opinions & Complex Arguments with AI Voice Coach
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 max-w-md pt-1">
              <div className="flex justify-between text-xs font-bold text-[#134E4A]">
                <span>Progress</span>
                <span className="text-[#0F766E]">75%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#CBDED9] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] w-[75%] transition-all duration-500" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('speaking')}
            className="px-6 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-md shadow-teal-700/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Resume Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Skills Overview Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-[#134E4A] flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#0F766E]" />
          <span>Core Speaking Skills</span>
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Fluency */}
          <div className="card-ai-luxury p-5 space-y-3 border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <Mic className="w-6 h-6" />
              </div>
              <CircularProgress percentage={88} size={54} strokeWidth={5} color="#0F766E" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">🎤 Fluency</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Natural speaking speed & continuous flow</p>
            </div>
          </div>

          {/* Vocabulary */}
          <div className="card-ai-luxury p-5 space-y-3 border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <BookOpen className="w-6 h-6" />
              </div>
              <CircularProgress percentage={92} size={54} strokeWidth={5} color="#14B8A6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">📚 Vocabulary</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Contextual word choice & phrasal verbs</p>
            </div>
          </div>

          {/* Pronunciation */}
          <div className="card-ai-luxury p-5 space-y-3 border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <Volume2 className="w-6 h-6" />
              </div>
              <CircularProgress percentage={84} size={54} strokeWidth={5} color="#0F766E" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">🗣 Pronunciation</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Intonation, stress & phonetic clarity</p>
            </div>
          </div>

          {/* Grammar */}
          <div className="card-ai-luxury p-5 space-y-3 border border-[#CBDED9] hover:border-[#14B8A6] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
                <PenTool className="w-6 h-6" />
              </div>
              <CircularProgress percentage={90} size={54} strokeWidth={5} color="#14B8A6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#134E4A]">✍ Grammar</h4>
              <p className="text-xs text-teal-800/80 font-medium mt-0.5">Tense accuracy & complex clauses</p>
            </div>
          </div>

        </div>
      </div>

      {/* Topic Learning Mastery Levels (Circular Progress Indicators) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#134E4A] flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#0F766E]" />
            <span>Topic Mastery Progress</span>
          </h3>
          <button
            onClick={() => onNavigate('curriculum')}
            className="text-xs font-extrabold text-[#0F766E] hover:underline flex items-center space-x-1"
          >
            <span>Explore All 400 Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Business Negotiations',
              category: 'Professional',
              mastery: 85,
              status: 'Advanced',
              color: '#0F766E',
            },
            {
              title: 'Academic IELTS Debate',
              category: 'Advanced',
              mastery: 78,
              status: 'Proficient',
              color: '#14B8A6',
            },
            {
              title: 'Travel & Dining Conversations',
              category: 'Everyday',
              mastery: 94,
              status: 'Mastered',
              color: '#0F766E',
            },
            {
              title: 'Idioms & Native Expressions',
              category: 'Fluency',
              mastery: 68,
              status: 'In Progress',
              color: '#10B981',
            },
          ].map((topicItem, index) => (
            <div
              key={index}
              onClick={() => onNavigate('curriculum')}
              className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                  {topicItem.category}
                </span>
                <h4 className="font-extrabold text-sm text-[#134E4A] group-hover:text-[#0F766E] transition-colors line-clamp-1">
                  {topicItem.title}
                </h4>
                <div className="flex items-center space-x-1 text-[11px] font-semibold text-teal-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{topicItem.status}</span>
                </div>
              </div>

              <CircularProgress
                percentage={topicItem.mastery}
                size={58}
                strokeWidth={5}
                color={topicItem.color}
                sublabel="mastery"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Recommended Scenarios & Curriculum Topics */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recommended Practice Scenarios */}
          <div className="space-y-4">
            
            {/* 400 Topics Curriculum Card Banner */}
            <div 
              onClick={() => onNavigate('curriculum')}
              className="p-6 rounded-3xl bg-gradient-to-r from-[#0F766E] via-[#042F2C] to-[#0D9488] text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#14B8A6]/30 flex flex-col sm:flex-row items-center justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-200 text-xs font-bold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>COMPLETE LEARNING CONTENT</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight group-hover:text-teal-200 transition-colors">
                  400 Structured English Topics Catalog
                </h3>
                <p className="text-xs text-teal-100/90 max-w-xl">
                  Explore 200 Beginner (Free), 100 Intermediate (Premium), and 100 Advanced (Premium) lessons with picture descriptions, vocabulary, idioms, mini-games, debates, and presentation practice!
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-2xl bg-[#14B8A6] group-hover:bg-[#0D9488] text-white font-bold text-xs shrink-0 flex items-center space-x-2 shadow-md">
                <span>Browse Topics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#134E4A]">Recommended Practice Topics</h2>
              <button 
                onClick={() => onNavigate('speaking')}
                className="text-xs font-extrabold text-[#0F766E] hover:underline flex items-center space-x-1"
              >
                <span>View All Scenarios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPEAKING_SCENARIOS.slice(0, 4).map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => onNavigate('speaking')}
                  className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#14B8A6] shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                      {scen.category}
                    </span>
                    <span className="text-xs text-teal-800/70 font-bold">{scen.difficulty}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#134E4A] group-hover:text-[#0F766E] transition-colors">
                      {scen.title}
                    </h3>
                    <p className="text-xs text-teal-900/70 font-medium mt-1 line-clamp-2">
                      {scen.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#0F766E] font-extrabold">
                    <span>Start Practice Session</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Practice Bar Visualizer */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-[#134E4A]">Weekly Practice Minutes</h3>
                <p className="text-xs text-teal-800/70 font-medium">Daily Target: {user.dailyGoalMinutes || 15} mins</p>
              </div>
              <span className="text-xs font-extrabold text-[#0F766E] bg-[#DCEDE9] px-3 py-1 rounded-full border border-[#CBDED9]">
                +24% vs Last Week
              </span>
            </div>

            {/* Days Bar Chart */}
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
                  <span className="text-[10px] font-bold text-teal-800/70">{item.mins}m</span>
                  <div
                    className="w-8 rounded-xl bg-gradient-to-t from-[#0F766E] to-[#14B8A6] transition-all duration-500 shadow-sm"
                    style={{ height: `${(item.mins / 30) * 100}%` }}
                  />
                  <span className="text-xs font-extrabold text-[#134E4A]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: AI Partner Status & Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active AI Partner Box */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-[#134E4A] uppercase tracking-wider">Your Personal AI Coach</h3>
            
            <div className="flex items-center space-x-4">
              <img
                src={AI_PERSONAS[0].avatarUrl}
                alt={AI_PERSONAS[0].name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0F766E] shadow-sm"
              />
              <div>
                <h4 className="font-extrabold text-base text-[#134E4A]">{AI_PERSONAS[0].name}</h4>
                <p className="text-xs text-[#0F766E] font-bold">{AI_PERSONAS[0].role}</p>
                <p className="text-[11px] text-teal-800/70 font-medium">{AI_PERSONAS[0].accent} Accent</p>
              </div>
            </div>

            <p className="text-xs text-teal-900/80 font-medium leading-relaxed bg-[#DCEDE9] p-3.5 rounded-2xl border border-[#CBDED9]">
              "Ready to work on your vocabulary and natural speaking flow today, {user.name.split(' ')[0]}?"
            </p>

            <button
              onClick={() => onNavigate('speaking')}
              className="w-full py-3 bg-ai-gradient text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-teal-700/20 hover:opacity-95"
            >
              Start AI Conversation
            </button>
          </div>

          {/* Recent Conversations */}
          <div className="bg-[#E6F1EF] rounded-3xl border border-[#CBDED9] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#134E4A] text-sm">Recent Conversations</h4>
              <button 
                onClick={() => onNavigate('history')}
                className="text-[11px] font-extrabold text-[#0F766E] hover:underline"
              >
                View History
              </button>
            </div>
            
            <div className="space-y-2.5">
              {[
                { title: 'Job Interview Simulation', time: 'Yesterday', score: '94%' },
                { title: 'Coffee Shop Small Talk', time: '2 days ago', score: '88%' },
                { title: 'IELTS Part 2 Cue Card', time: '3 days ago', score: '91%' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#DCEDE9] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-[#134E4A]">{item.title}</div>
                    <div className="text-[10px] text-teal-800/70 font-medium">{item.time}</div>
                  </div>
                  <span className="font-extrabold text-[#0F766E] bg-teal-100/80 px-2 py-0.5 rounded-lg border border-[#CBDED9]">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tip of the Day */}
          <div className="rounded-3xl bg-gradient-to-tr from-[#14B8A6]/15 via-teal-500/5 to-transparent border border-[#CBDED9] p-6 space-y-3">
            <div className="flex items-center space-x-2 text-[#0F766E] font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Fluency Tip of the Day</span>
            </div>
            <h4 className="font-extrabold text-sm text-[#134E4A]">Embrace Connected Speech</h4>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              Native speakers link words together seamlessly. For instance, "what do you" often sounds like "whaddya". Try relaxing your tongue on unstressed vowels!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
