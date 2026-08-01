import React from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Star, 
  Target, 
  Lock, 
  Sparkles,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_ACHIEVEMENTS } from '../../data/mockData';

export const AchievementsView: React.FC = () => {
  const { user } = useAuth();

  const streakDays = user ? user.streak : 5;
  const xpPoints = user ? user.xp : 320;

  return (
    <div id="achievements-streaks-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>LEARNING MILESTONES & REWARDS</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Achievements & Streaks</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Track your daily speaking practice streak, earn XP points, unlock milestone badges, and claim rewards.
          </p>
        </div>
      </div>

      {/* Daily Streak & XP Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Streak Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#042F2C] via-[#0F766E] to-[#115E59] text-white space-y-4 shadow-xl border border-[#14B8A6]/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-teal-200 tracking-wider">Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white">{streakDays}</span>
              <span className="text-sm font-bold text-teal-200">Days Consecutive</span>
            </div>
            <p className="text-xs text-teal-100/80 font-medium mt-1">
              Practiced today! Keep your streak active by completing 1 session tomorrow.
            </p>
          </div>

          {/* Days of Week Tracker */}
          <div className="pt-2 flex justify-between items-center text-xs font-bold text-teal-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="flex flex-col items-center space-y-1">
                <span className="text-[10px] text-teal-300">{day}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  idx < streakDays 
                    ? 'bg-[#F59E0B] text-slate-950 shadow-md'
                    : 'bg-teal-900/60 text-teal-400 border border-teal-700/50'
                }`}>
                  {idx < streakDays ? '✓' : idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total XP & Rank Card */}
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Total Experience</span>
            <div className="p-2 rounded-xl bg-[#DCEDE9] text-[#0F766E]">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-[#134E4A]">{xpPoints}</span>
              <span className="text-sm font-bold text-[#0F766E]">XP Points</span>
            </div>
            <p className="text-xs text-teal-800/80 font-medium mt-1">
              Level 2 • Intermediate Speaker Rank
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-[#134E4A]">
              <span>Progress to Level 3</span>
              <span>{xpPoints} / 500 XP</span>
            </div>
            <div className="w-full bg-[#CBDED9] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#0F766E] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (xpPoints / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed Sessions & Milestones */}
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider">Completed Sessions</span>
            <div className="p-2 rounded-xl bg-[#DCEDE9] text-[#0F766E]">
              <Target className="w-6 h-6 text-[#0F766E]" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-[#134E4A]">18</span>
              <span className="text-sm font-bold text-[#0F766E]">AI Voice Sessions</span>
            </div>
            <p className="text-xs text-teal-800/80 font-medium mt-1">
              Total practice time: 142 Minutes
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-xs font-bold text-[#134E4A] flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>Weekly Goal: 5 / 7 Days Completed!</span>
          </div>
        </div>

      </div>

      {/* Motivational Message Banner */}
      <div className="p-6 rounded-3xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="font-black text-sm text-[#134E4A]">Motivational Coach Insight</h3>
          <p className="text-xs text-teal-900/80 font-medium mt-0.5">
            "Consistency is the secret sauce of language mastery. 10 minutes of daily speaking rewires your brain faster than any grammar textbook!"
          </p>
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#134E4A]">Milestone Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-3xl p-6 border transition-all space-y-4 ${
                ach.isUnlocked
                  ? 'bg-[#E6F1EF] border-[#CBDED9] shadow-sm'
                  : 'bg-[#F3F7F6] border-[#CBDED9] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  ach.isUnlocked ? 'bg-[#0F766E] text-white shadow-md' : 'bg-[#CBDED9] text-teal-800/50'
                }`}>
                  {ach.isUnlocked ? <CheckCircle2 className="w-6 h-6 text-[#F59E0B]" /> : <Lock className="w-6 h-6" />}
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                  +{ach.xpReward} XP
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-[#134E4A]">{ach.title}</h3>
                <p className="text-xs text-teal-900/80 font-medium mt-1">{ach.description}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-[#0F766E]">
                  <span>Progress</span>
                  <span>{ach.currentProgress} / {ach.maxProgress}</span>
                </div>
                <div className="w-full bg-[#CBDED9] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0F766E] h-full transition-all"
                    style={{ width: `${Math.min(100, (ach.currentProgress / ach.maxProgress) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
