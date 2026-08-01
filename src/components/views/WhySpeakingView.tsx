import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  GraduationCap, 
  Globe, 
  Briefcase, 
  UserCheck, 
  Award, 
  Plane, 
  Compass, 
  ArrowRight,
  Bot,
  Mic
} from 'lucide-react';

interface WhySpeakingViewProps {
  onNavigate: (view: string) => void;
}

export const WhySpeakingView: React.FC<WhySpeakingViewProps> = ({ onNavigate }) => {
  const REASONS = [
    {
      id: 'confidence',
      title: 'Build Unshakable Confidence',
      icon: ShieldCheck,
      description: 'Overcome hesitation and fear of making mistakes by practicing daily in a safe, judgment-free AI environment.',
      actionableTip: 'Speak out loud for 5 minutes every morning with MZ AI Coach.',
    },
    {
      id: 'effective',
      title: 'Communicate Effectively',
      icon: MessageSquare,
      description: 'Express your thoughts, ideas, and opinions clearly with structured vocabulary and natural phrasing.',
      actionableTip: 'Use full sentences instead of single words during practice.',
    },
    {
      id: 'ielts',
      title: 'Improve IELTS & Exam Scores',
      icon: GraduationCap,
      description: 'Ace IELTS Speaking Part 1, Part 2 cue cards, and Part 3 analytical discussions with real-time feedback.',
      actionableTip: 'Practice timed 2-minute topical monologues in Speaking Studio.',
    },
    {
      id: 'abroad',
      title: 'Study at Top Global Universities',
      icon: Globe,
      description: 'Qualify for admissions and scholarships at international academic institutions across the US, UK, Canada, and Europe.',
      actionableTip: 'Master academic vocabulary and presentation structures.',
    },
    {
      id: 'career',
      title: 'Get Better Jobs & Promotions',
      icon: Briefcase,
      description: 'Unlock high-paying international remote jobs and executive career growth opportunities worldwide.',
      actionableTip: 'Practice business English roleplays with AI personas.',
    },
    {
      id: 'interviews',
      title: 'Succeed in Job Interviews',
      icon: UserCheck,
      description: 'Answer behavioral and technical interview questions with poise, clarity, and professional impact.',
      actionableTip: 'Use the STAR method (Situation, Task, Action, Result) in response scenarios.',
    },
    {
      id: 'professional',
      title: 'Communicate Professionally',
      icon: Award,
      description: 'Lead team meetings, negotiate agreements, and deliver compelling corporate presentations confidently.',
      actionableTip: 'Refine transition words and polite business expressions.',
    },
    {
      id: 'travel',
      title: 'Travel Confidently Anywhere',
      icon: Plane,
      description: 'Navigate airports, hotels, restaurants, and foreign cities without language barriers or stress.',
      actionableTip: 'Roleplay real-world travel scenario scripts with MZ Coach.',
    },
    {
      id: 'global',
      title: 'Access Global Opportunities',
      icon: Compass,
      description: 'Connect with international communities, attend global summits, and build global networks.',
      actionableTip: 'Engage in open discussions on current global topics.',
    },
  ];

  return (
    <div id="why-speaking-view-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
          Core Foundation
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          Why English Speaking Skills Matter
        </h1>
        <p className="text-teal-900/80 text-sm sm:text-base font-medium leading-relaxed">
          Mastering spoken English transforms your career, education, and personal growth. Discover how fluent communication opens doors worldwide.
        </p>
      </div>

      {/* Featured Callout Banner */}
      <div className="card-ai-luxury p-8 border border-[#CBDED9] bg-gradient-to-r from-[#DCEDE9] via-[#E6F1EF] to-[#DCEDE9] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>AI Speaking Coach Approach</span>
            </div>
            <h2 className="text-2xl font-black text-[#134E4A]">
              Fluency is Built Through Action, Not Just Grammar Books
            </h2>
            <p className="text-xs sm:text-sm text-teal-900/80 font-medium leading-relaxed">
              Traditional study focuses on reading and rules, but speaking fluently requires active muscle memory and real-time voice practice. Speak with MZ provides a safe environment to speak every day.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={() => onNavigate('speaking')}
              className="px-6 py-3.5 rounded-2xl bg-ai-gradient text-white font-extrabold text-sm shadow-lg shadow-teal-800/25 hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span>Start Practice Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 9 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REASONS.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <IconComp className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-black text-[#134E4A] leading-snug">{item.title}</h3>
                <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#CBDED9] space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E] block">
                  💡 Actionable Growth Tip
                </span>
                <p className="text-xs text-[#134E4A] font-semibold italic bg-[#DCEDE9] p-2.5 rounded-xl border border-[#CBDED9]">
                  "{item.actionableTip}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white text-center space-y-4 border border-[#14B8A6]/30 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14B8A6]/20 text-teal-200 text-xs font-bold border border-[#14B8A6]/30">
          <Bot className="w-4 h-4 text-[#F59E0B]" />
          <span>Ready to Experience the Difference?</span>
        </div>
        <h3 className="text-2xl font-black text-white">Transform Your English Speaking Skills Today</h3>
        <p className="text-xs text-teal-100/80 font-medium max-w-xl mx-auto">
          Take the first step towards global communication and career success with 24/7 AI feedback.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => onNavigate('speaking')}
            className="px-8 py-3.5 rounded-2xl bg-ai-gradient text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Mic className="w-5 h-5 text-white animate-pulse" />
            <span>Practice Speaking with AI Coach</span>
          </button>
        </div>
      </div>

    </div>
  );
};
