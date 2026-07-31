import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, TrendingUp, Zap, Clock, CheckCircle, BarChart3, Target } from 'lucide-react';

interface LearningProgressViewProps {
  onNavigate: (view: string) => void;
}

export const LearningProgressView: React.FC<LearningProgressViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div id="learning-progress-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Learning Analytics & Progress</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Detailed metrics evaluating your speaking fluency, pronunciation clarity, and grammar accuracy over time.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fluency Rating</span>
          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">88 %</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[88%]" />
          </div>
          <p className="text-xs text-slate-500">Based on speaking pace and pause minimization</p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grammar Accuracy</span>
          <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">92 %</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full w-[92%]" />
          </div>
          <p className="text-xs text-slate-500">Grammar Doctor correction history</p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pronunciation Score</span>
          <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">85 %</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[85%]" />
          </div>
          <p className="text-xs text-slate-500">Phonetic clarity assessment</p>
        </div>
      </div>

      {/* Strength & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>Top Key Strengths</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <strong className="text-slate-900 dark:text-white">Natural Speech Pace:</strong> Maintains a smooth 110-130 WPM speed without excessive hesitation.
            </li>
            <li className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <strong className="text-slate-900 dark:text-white">Professional Vocabulary:</strong> Frequently applies business terms like "implement", "articulate", and "strategy".
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-500" />
            <span>Focus Areas for Next Practice</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <strong className="text-slate-900 dark:text-white">Preposition Usage:</strong> Pay attention to "in" vs "at" for location descriptions.
            </li>
            <li className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <strong className="text-slate-900 dark:text-white">Past Perfect Tense:</strong> Practice combining "had done" when ordering past events.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
