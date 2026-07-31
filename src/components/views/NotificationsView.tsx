import React from 'react';
import { Bell, Flame, Award, BookOpen, Sparkles } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const notifications = [
    { id: 1, title: 'Streak Preserved! 🔥', desc: 'You completed your daily 15-minute speaking practice target.', time: '2 hours ago', icon: Flame, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950' },
    { id: 2, title: 'Achievement Unlocked 🏆', desc: 'You unlocked "Grammar Prodigy" badge (+200 XP).', time: '1 day ago', icon: Award, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
    { id: 3, title: 'New Scenario Added ☕', desc: 'Practice "Ordering Coffee in London" with MZ Standard AI.', time: '2 days ago', icon: Sparkles, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950' },
  ];

  return (
    <div id="notifications-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <Bell className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Notification Center</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Recent alerts, achievement unlocks, and practice reminders.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => {
          const IconComp = n.icon;
          return (
            <div key={n.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className={`p-3 rounded-2xl ${n.color} shrink-0`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h3>
                  <span className="text-[11px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
