import React from 'react';
import { INITIAL_ACHIEVEMENTS } from '../../data/mockData';
import { Award, Flame, Mic, BookOpen, Clock, Trophy, Lock, Check } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  return (
    <div id="achievements-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Achievements & Badges</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Earn XP points and unlock milestone badges as you practice speaking everyday.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_ACHIEVEMENTS.map((ach) => (
          <div
            key={ach.id}
            className={`rounded-3xl p-6 border transition-all space-y-4 ${
              ach.isUnlocked
                ? 'bg-white dark:bg-slate-900 border-emerald-500/40 shadow-md'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                ach.isUnlocked ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                {ach.isUnlocked ? <Check className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600">
                +{ach.xpReward} XP
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{ach.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ach.description}</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Progress</span>
                <span>{ach.currentProgress} / {ach.maxProgress}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.min(100, (ach.currentProgress / ach.maxProgress) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
