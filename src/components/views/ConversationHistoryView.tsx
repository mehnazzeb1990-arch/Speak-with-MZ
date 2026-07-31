import React from 'react';
import { History, Play, MessageSquare, Clock, Award } from 'lucide-react';

export const ConversationHistoryView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const pastSessions = [
    { id: 's1', date: 'Today, 2:30 PM', scenario: 'Job Interview Simulation', partner: 'Alex Sterling', duration: '12 mins', score: 90, corrections: 2 },
    { id: 's2', date: 'Yesterday, 6:15 PM', scenario: 'Coffee Shop Order', partner: 'Coach MZ', duration: '8 mins', score: 94, corrections: 1 },
    { id: 's3', date: 'Jul 28, 2026', scenario: 'Free Conversation', partner: 'Sarah Jenkins', duration: '15 mins', score: 86, corrections: 3 },
  ];

  return (
    <div id="conversation-history-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <History className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Conversation History</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Review past speaking practice transcripts, AI coach feedback, and fluency metrics.
        </p>
      </div>

      <div className="space-y-4">
        {pastSessions.map((session) => (
          <div key={session.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">{session.date}</span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{session.scenario}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Partner: {session.partner}</p>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                <span className="font-bold">{session.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Fluency</span>
                <span className="font-bold text-emerald-500">{session.score}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Tips</span>
                <span className="font-bold text-amber-500">{session.corrections} Corrections</span>
              </div>

              <button
                onClick={() => onNavigate('speaking')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-bold transition-colors"
              >
                Replay Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
