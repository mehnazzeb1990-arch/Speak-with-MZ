import React from 'react';
import { Mic, Heart, Shield, Globe, Award, Sparkles } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div id="about-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Our Mission & Vision
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Empowering Millions to Speak English with Confidence
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          Speak with MZ was created to eliminate the fear of speaking a new language. By combining natural conversational AI, human-like voice synthesis, and real-time grammar feedback, we provide a safe, non-judgmental environment to build daily fluency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Human-Like AI</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our AI speaking partner interacts with natural speech inflections, encouraging tone, and contextually intelligent responses.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Instant Grammar Doctor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Receive immediate, friendly feedback on sentence structure without interrupting your natural conversational flow.
          </p>
        </div>

        <div className="rounded-3xl bg-[#E6F1EF] p-8 border border-[#CBDED9] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Accessible Worldwide</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Available 24 hours a day, 7 days a week from any device, anywhere in the world.
          </p>
        </div>
      </div>
    </div>
  );
};
