import React from 'react';
import { 
  BookMarked, 
  CheckCircle2, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Globe, 
  Bot,
  Play
} from 'lucide-react';

interface IntermediateGuideViewProps {
  onNavigate: (view: string) => void;
}

export const IntermediateGuideView: React.FC<IntermediateGuideViewProps> = ({ onNavigate }) => {
  const INTERMEDIATE_SECTIONS = [
    {
      title: '1. Advanced Conversation Skills',
      desc: 'Move beyond short answers. Learn to extend your turns with explanations, personal stories, and opinions.',
      topics: ['Adding "Because" & "For Example"', 'Expressing Mixed Opinions', 'Transition Words'],
    },
    {
      title: '2. Expanding Active Vocabulary',
      desc: 'Replace basic words (good, bad, happy) with precise intermediate descriptors (beneficial, detrimental, delighted).',
      topics: ['Synonym Swapping', 'Topic-Specific Phrasal Verbs', 'Common Collocations'],
    },
    {
      title: '3. Speaking Naturally & Connected Speech',
      desc: 'Understand contractions, weak sounds, and connected speech ("gonna", "would\'ve", "wanna") to sound fluid.',
      topics: ['Linking Vowels & Consonants', 'Reduced Vowels in Unstressed Words', 'Intonation Curves'],
    },
    {
      title: '4. Improving Speech Fluency',
      desc: 'Reduce long awkward pauses. Learn natural hesitation devices ("Well...", "Let me think...", "To be honest...").',
      topics: ['Using Native Fillers', 'Pacing & Chunking Sentences', 'Continuous Flow Drills'],
    },
    {
      title: '5. Grammar Refinement & Complex Tenses',
      desc: 'Master Present Perfect ("I have lived"), Conditionals ("If I were... I would"), and Passive Voice naturally.',
      topics: ['First & Second Conditionals', 'Present Perfect vs Past Simple', 'Modals of Speculation'],
    },
    {
      title: '6. Active Listening & Response Matching',
      desc: 'Improve comprehension of fast English accents so you can respond accurately without misinterpreting context.',
      topics: ['Keyword Extraction', 'Asking Clarification Questions', 'Paraphrasing What You Heard'],
    },
    {
      title: '7. IELTS Speaking Preparation (B2-C1)',
      desc: 'Structured strategies for Part 1 intro questions, Part 2 long turn cue cards, and Part 3 analytical arguments.',
      topics: ['2-Minute Cue Card Structure', 'Band 7+ Lexical Resource', 'Cohesion Markers'],
    },
    {
      title: '8. Speaking Confidently Under Pressure',
      desc: 'Techniques for workplace meetings, presentations, and spontaneous questions with zero preparation.',
      topics: ['PREP Method (Point, Reason, Example, Point)', 'Handling Interruptions', 'Reframing Mistakes'],
    },
  ];

  return (
    <div id="intermediate-guide-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <BookMarked className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>LEVEL 2 LEARNING PATH</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Intermediate English Speaking Guide</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Bridge the gap from basic communication to natural fluency, expanded vocabulary, and IELTS Band 7+ prep.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Practice Intermediate AI Session</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INTERMEDIATE_SECTIONS.map((sec, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
            <h3 className="text-base font-black text-[#134E4A]">{sec.title}</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{sec.desc}</p>
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Key Strategies:</span>
              <ul className="space-y-1">
                {sec.topics.map((t, i) => (
                  <li key={i} className="text-xs text-[#134E4A] font-medium flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Spotlight Banner */}
      <div className="card-ai-luxury p-8 border border-[#CBDED9] bg-[#DCEDE9] space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-black text-[#134E4A]">The PREP Framework for Intermediate Speakers</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-medium">
          <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9]">
            <span className="font-extrabold text-[#0F766E] block text-sm">P - Point</span>
            <span>State your main answer or opinion clearly in sentence 1.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9]">
            <span className="font-extrabold text-[#0F766E] block text-sm">R - Reason</span>
            <span>Explain WHY you hold this opinion using connectors.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9]">
            <span className="font-extrabold text-[#0F766E] block text-sm">E - Example</span>
            <span>Give a quick personal story or specific fact to back it up.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9]">
            <span className="font-extrabold text-[#0F766E] block text-sm">P - Point</span>
            <span>Summarize your takeaway sentence smoothly.</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14B8A6]/30 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black text-white">Test your PREP technique with MZ AI Coach</h3>
          <p className="text-xs text-teal-100/80 font-medium">Get instant feedback on your fluency and vocabulary choice.</p>
        </div>
        <button
          onClick={() => onNavigate('speaking')}
          className="px-8 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-xl hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Launch Intermediate AI Session</span>
        </button>
      </div>

    </div>
  );
};
