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
          <div className="p-2.5 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Learning Analytics & Progress</h1>
        </div>
        <p className="text-sm text-teal-900/80 font-medium mt-1">
          Detailed metrics evaluating your speaking fluency, pronunciation clarity, and grammar accuracy over time.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0F766E]">Fluency Rating</span>
          <p className="text-4xl font-black text-[#0F766E]">88 %</p>
          <div className="w-full bg-[#DCEDE9] h-2.5 rounded-full overflow-hidden border border-[#CBDED9]">
            <div className="bg-[#0F766E] h-full w-[88%]" />
          </div>
          <p className="text-xs text-teal-800/70 font-medium">Based on speaking pace and pause minimization</p>
        </div>

        <div className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0F766E]">Grammar Accuracy</span>
          <p className="text-4xl font-black text-[#0F766E]">92 %</p>
          <div className="w-full bg-[#DCEDE9] h-2.5 rounded-full overflow-hidden border border-[#CBDED9]">
            <div className="bg-[#14B8A6] h-full w-[92%]" />
          </div>
          <p className="text-xs text-teal-800/70 font-medium">Grammar Doctor correction history</p>
        </div>

        <div className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0F766E]">Pronunciation Score</span>
          <p className="text-4xl font-black text-[#0F766E]">85 %</p>
          <div className="w-full bg-[#DCEDE9] h-2.5 rounded-full overflow-hidden border border-[#CBDED9]">
            <div className="bg-[#0F766E] h-full w-[85%]" />
          </div>
          <p className="text-xs text-teal-800/70 font-medium">Phonetic clarity assessment</p>
        </div>
      </div>

      {/* Strength & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#134E4A] flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#0F766E]" />
            <span>Top Key Strengths</span>
          </h3>
          <ul className="space-y-3 text-xs text-[#134E4A]">
            <li className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
              <strong className="text-[#0F766E] font-black">Natural Speech Pace:</strong> Maintains a smooth 110-130 WPM speed without excessive hesitation.
            </li>
            <li className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
              <strong className="text-[#0F766E] font-black">Professional Vocabulary:</strong> Frequently applies business terms like "implement", "articulate", and "strategy".
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#134E4A] flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#F59E0B]" />
            <span>Focus Areas for Next Practice</span>
          </h3>
          <ul className="space-y-3 text-xs text-[#134E4A]">
            <li className="p-3 rounded-2xl bg-amber-100/80 border border-amber-300">
              <strong className="text-amber-900 font-black">Preposition Usage:</strong> Pay attention to "in" vs "at" for location descriptions.
            </li>
            <li className="p-3 rounded-2xl bg-amber-100/80 border border-amber-300">
              <strong className="text-amber-900 font-black">Past Perfect Tense:</strong> Practice combining "had done" when ordering past events.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
