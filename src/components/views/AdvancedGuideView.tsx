import React from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Mic, 
  Sparkles, 
  Briefcase, 
  Award, 
  Bot,
  Play
} from 'lucide-react';

interface AdvancedGuideViewProps {
  onNavigate: (view: string) => void;
}

export const AdvancedGuideView: React.FC<AdvancedGuideViewProps> = ({ onNavigate }) => {
  const ADVANCED_SECTIONS = [
    {
      title: '1. Executive Professional Communication',
      desc: 'Master executive presence, diplomacy, high-stakes negotiations, and authoritative tone in global business environments.',
      topics: ['Tactful Disagreement', 'Executive Summaries', 'Softening Direct Demands'],
    },
    {
      title: '2. C1-C2 Business English Mastery',
      desc: 'Formulate complex corporate strategy ideas, financial reviews, cross-functional projects, and quarterly pitch presentations.',
      topics: ['Strategic Terminology', 'Project Governance Terms', 'Stakeholder Management'],
    },
    {
      title: '3. Academic & Intellectual Discussions',
      desc: 'Analyze scientific studies, philosophical debates, socioeconomic trends, and literature using formal academic structures.',
      topics: ['Nuanced Argumentation', 'Synthesizing Multiple Views', 'Citing Evidence Verbally'],
    },
    {
      title: '4. Advanced Vocabulary & Precision Nuance',
      desc: 'Replace generic adjectives with sophisticated C2 vocabulary (ubiquitous, quintessential, pragmatic, paradigm shift).',
      topics: ['Precise Synonyms', 'Domain-Specific Terminology', 'Subtle Tone Shifting'],
    },
    {
      title: '5. Idioms, Metaphors & Collocations',
      desc: 'Incorporate natural native idioms and professional metaphors ("hit the ground running", "double down", "paradigm shift").',
      topics: ['Business Idiomatic Expressions', 'Metaphorical Framing', 'Native Phrasal Nuances'],
    },
    {
      title: '6. Accent Polish & Native Intonation Patterns',
      desc: 'Master sentence stress, pitch variations, emotional emphasis, and subtle pauses that captivate listeners.',
      topics: ['Pitch Movement Patterns', 'Emphatic Stress Placement', 'Pacing Control'],
    },
    {
      title: '7. Keynote Presentation & Public Speaking Skills',
      desc: 'Structure keynote presentations, hook audiences in the first 30 seconds, and handle Q&A sessions under high scrutiny.',
      topics: ['Audience Hook Techniques', 'Verbal Signposting', 'Deflecting Hostile Questions'],
    },
    {
      title: '8. Global Executive Interview Preparation',
      desc: 'Prepare for C-suite, VP, and Director behavioral interviews with high-impact STAR narratives and strategic vision statements.',
      topics: ['C-Suite STAR Stories', 'Demonstrating ROI Verbally', 'Handling Case Scenarios'],
    },
  ];

  return (
    <div id="advanced-guide-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>LEVEL 3 LEARNING PATH</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Advanced English Speaking Guide</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Achieve executive presence, C2 fluency, public speaking mastery, and high-impact business communication.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Practice Advanced AI Session</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ADVANCED_SECTIONS.map((sec, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
            <h3 className="text-base font-black text-[#134E4A]">{sec.title}</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{sec.desc}</p>
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Advanced Competencies:</span>
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

      {/* C-Suite Scenario Prompt Card */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14B8A6]/30 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14B8A6]/20 text-teal-200 text-xs font-bold">
            <Bot className="w-4 h-4 text-[#F59E0B]" />
            <span>Executive AI Simulations</span>
          </div>
          <h3 className="text-xl font-black text-white">Roleplay C-Level Boardroom & Pitch Scenarios</h3>
          <p className="text-xs text-teal-100/80 font-medium">Practice defending quarterly business metrics and executive proposals with Coach MZ.</p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-8 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-xl hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Start Advanced AI Session</span>
        </button>
      </div>

    </div>
  );
};
