import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Mic, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  AlertTriangle, 
  BookOpen, 
  Bot,
  Play
} from 'lucide-react';

interface BeginnerGuideViewProps {
  onNavigate: (view: string) => void;
}

export const BeginnerGuideView: React.FC<BeginnerGuideViewProps> = ({ onNavigate }) => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<string | null>(null);

  const MODULES = [
    {
      title: '1. Introduction to Speaking',
      desc: 'Understand how spoken English differs from written English. Learn to focus on meaning rather than perfect grammar.',
      keyPoints: ['Use short sentences', 'Speak at a steady pace', 'Focus on message clarity'],
    },
    {
      title: '2. Building Confidence',
      desc: 'Overcome self-consciousness. AI Studio provides a safe space where you can make mistakes without fear.',
      keyPoints: ['Practice 5 mins daily', 'Celebrate small progress', 'Don’t apologize for mistakes'],
    },
    {
      title: '3. Basic Core Vocabulary',
      desc: 'Master top 300 essential high-frequency words for everyday greetings, self-introductions, and food/ordering.',
      keyPoints: ['Greetings & Farewells', 'Expressing Needs & Wants', 'Asking Simple Questions'],
    },
    {
      title: '4. Daily Conversation Starters',
      desc: 'Learn ready-to-use phrases for weather, hobbies, family, and daily routines.',
      keyPoints: ['"How are you doing today?"', '"Could you help me please?"', '"Nice to meet you!"'],
    },
    {
      title: '5. Pronunciation Basics',
      desc: 'Learn clear vowel sounds and consonant pairs (th, v/b, r/l) that boost listener comprehension.',
      keyPoints: ['Open mouth clearly', 'Emphasize stress syllables', 'Listen to AI audio samples'],
    },
    {
      title: '6. Simple Grammar Patterns',
      desc: 'Focus on Present Simple ("I work"), Present Continuous ("I am learning"), and Past Simple ("I went").',
      keyPoints: ['Subject + Verb + Object', 'Avoid overcomplicating tense structures', 'Keep it active'],
    },
    {
      title: '7. Daily 10-Minute Practice Routine',
      desc: 'A structured daily habit designed to build consistency without feeling overwhelmed.',
      keyPoints: ['2 mins: Listen to AI prompt', '5 mins: Speak responses out loud', '3 mins: Review corrections'],
    },
    {
      title: '8. Common Beginner Mistakes to Avoid',
      desc: 'Identify and fix common errors like translating directly from your native language in your head.',
      keyPoints: ['Stop translating word-for-word', 'Don’t speak too fast', 'Don’t fear pause filler words'],
    },
  ];

  const EXERCISES = [
    {
      id: 1,
      prompt: 'Complete the self-introduction sentence: "Hello! My name is Alex and I am learning English because ____."',
      options: [
        'I want to communicate with global friends',
        'learning language is very happy',
        'because I am speak every day'
      ],
      correct: 0,
      explanation: 'Options A provides a natural, grammatically sound reason for learning English!',
    },
    {
      id: 2,
      prompt: 'Which response is most polite when meeting someone for the first time?',
      options: [
        'Who are you person?',
        'It is a pleasure to meet you!',
        'Tell me your name now.'
      ],
      correct: 1,
      explanation: '"It is a pleasure to meet you!" is a classic, polite greeting standard.',
    },
  ];

  const handleExerciseClick = (exId: number, optIdx: number, correctIdx: number) => {
    setSelectedExercise(exId);
    if (optIdx === correctIdx) {
      setExerciseFeedback('✅ Excellent! That is the standard, natural response.');
    } else {
      setExerciseFeedback('💡 Try again! Focus on polite and simple English phrasing.');
    }
  };

  return (
    <div id="beginner-guide-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <Rocket className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>LEVEL 1 LEARNING PATH</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Beginner English Speaking Guide</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Build your foundation from zero. Learn basic sentence structures, everyday phrases, and overcome hesitation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Practice Beginner AI Session</span>
        </button>
      </div>

      {/* Modules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODULES.map((m, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
            <h3 className="text-base font-black text-[#134E4A]">{m.title}</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{m.desc}</p>
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Key Focus Areas:</span>
              <ul className="space-y-1">
                {m.keyPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-[#134E4A] font-medium flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Beginner Quiz Exercise */}
      <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="font-extrabold text-base text-[#134E4A]">Daily Beginner Exercises</h3>
        </div>

        <div className="space-y-4">
          {EXERCISES.map((ex) => (
            <div key={ex.id} className="p-5 rounded-2xl bg-[#F3F7F6] border border-[#CBDED9] space-y-3">
              <p className="font-bold text-xs text-[#134E4A]">{ex.prompt}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ex.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleExerciseClick(ex.id, optIdx, ex.correct)}
                    className="p-3 rounded-xl bg-white border border-[#CBDED9] hover:border-[#0F766E] text-xs font-bold text-[#134E4A] text-left transition-colors cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {exerciseFeedback && (
            <div className="p-4 rounded-xl bg-[#DCEDE9] border border-[#CBDED9] text-xs font-bold text-[#0F766E]">
              {exerciseFeedback}
            </div>
          )}
        </div>
      </div>

      {/* Practice with AI Coach Prompt Box */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14B8A6]/30 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14B8A6]/20 text-teal-200 text-xs font-bold">
            <Bot className="w-4 h-4 text-[#F59E0B]" />
            <span>Interactive Beginner Coach</span>
          </div>
          <h3 className="text-xl font-black text-white">Ready for your first 2-minute conversation?</h3>
          <p className="text-xs text-teal-100/80 font-medium">MZ AI Coach will speak slowly and encourage you at every step.</p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-8 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-xl hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Start Beginner AI Practice</span>
        </button>
      </div>

    </div>
  );
};
