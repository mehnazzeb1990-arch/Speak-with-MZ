import React from 'react';
import { Mic, Sparkles, BookOpen, Flame, Zap, CheckCircle2, Award } from 'lucide-react';

export const FeaturesView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  return (
    <div id="features-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Commercial-Grade Platform Features
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Achieve English Fluency
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Explore the technology behind Speak with MZ. Designed specifically for active vocabulary retention and real-time speaking confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real-Time Voice & Speech Intelligence</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Speak directly into your browser using Web Speech API or ElevenLabs high-fidelity neural voice synthesis. Hear natural responses spoken at your choice of speed.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Grammar Doctor</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Never wonder if your sentence was correct. The Grammar Doctor instantly pinpoints verb tenses, prepositions, and word choices with clear explanations.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vocabulary Vault & Flashcards</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            One-click save new vocabulary words learned during conversations. Review them anytime with interactive flashcards and native audio pronunciation.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Daily Streak & Gamified Badges</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Build habit loops with daily minute counters, streak tracking, and XP milestone badges for consistent practice.
          </p>
        </div>
      </div>
    </div>
  );
};
