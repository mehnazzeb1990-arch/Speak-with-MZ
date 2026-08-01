import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Mic, 
  ArrowRight, 
  Bot,
  HelpCircle
} from 'lucide-react';

interface GrammarImprovementViewProps {
  onNavigate: (view: string) => void;
}

export const GrammarImprovementView: React.FC<GrammarImprovementViewProps> = ({ onNavigate }) => {
  const [userInput, setUserInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<{ original: string; corrected: string; explanation: string } | null>(null);

  const COMMON_MISTAKES = [
    {
      incorrect: 'I am agree with your opinion.',
      correct: 'I agree with your opinion.',
      rule: 'Agree is a verb itself. Do not pair it with "am/is/are".',
    },
    {
      incorrect: 'He don\'t likes coffee.',
      correct: 'He doesn\'t like coffee.',
      rule: 'Use "doesn\'t" for 3rd person singular (he/she/it) followed by base verb.',
    },
    {
      incorrect: 'I have 25 years old.',
      correct: 'I am 25 years old.',
      rule: 'Use "to be" (am/is/are) to state age in English, not "have".',
    },
    {
      incorrect: 'She explained me the problem.',
      correct: 'She explained the problem to me.',
      rule: 'Explain takes an object first, followed by "to [person]".',
    },
  ];

  const handleTestGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Simulated instant AI Doctor feedback
    setAiFeedback({
      original: userInput,
      corrected: userInput.replace(/i am agree/gi, 'I agree').replace(/he don't/gi, "he doesn't").replace(/i have (\d+) years/gi, 'I am $1 years old'),
      explanation: 'MZ AI Doctor checked your sentence! Notice proper verb agreement and tense placement.',
    });
  };

  return (
    <div id="grammar-improvement-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <PenTool className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>AI GRAMMAR DOCTOR</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Grammar Improvement & AI Feedback</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Fix common spoken grammar errors in real time without getting bogged down by boring grammar rules.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Practice Live Grammar with AI</span>
        </button>
      </div>

      {/* Interactive AI Grammar Checker Widget */}
      <div className="card-ai-luxury p-6 sm:p-8 border border-[#CBDED9] bg-[#E6F1EF] space-y-5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-black text-[#134E4A]">Instant AI Sentence Improvement Doctor</h3>
        </div>

        <form onSubmit={handleTestGrammar} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#134E4A] mb-1">
              Type any sentence you want to test:
            </label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. 'I am agree with your opinion about this job...'"
              className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#F3F7F6] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-black text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Check Grammar Now</span>
          </button>
        </form>

        {aiFeedback && (
          <div className="p-5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-rose-600 block">Original Input:</span>
              <p className="font-semibold text-rose-700 line-through">"{aiFeedback.original}"</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#0F766E] block">AI Corrected Version:</span>
              <p className="font-extrabold text-[#134E4A] text-sm bg-white p-2.5 rounded-xl border border-[#CBDED9]">
                "{aiFeedback.corrected}"
              </p>
            </div>
            <p className="text-teal-900/80 font-medium italic">💡 {aiFeedback.explanation}</p>
          </div>
        )}
      </div>

      {/* Top 4 Spoken Grammar Mistakes */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#134E4A]">Top Spoken Grammar Mistakes & Quick Fixes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMMON_MISTAKES.map((m, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="line-through">"{m.incorrect}"</span>
              </div>
              <div className="flex items-center space-x-2 text-[#0F766E] font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>"{m.correct}"</span>
              </div>
              <p className="text-xs text-teal-900/80 font-medium pt-2 border-t border-[#CBDED9]">
                <strong className="text-[#134E4A]">Rule:</strong> {m.rule}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
